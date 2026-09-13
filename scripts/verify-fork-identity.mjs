#!/usr/bin/env node
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releasePlaceholder = /YOUR_GITHUB_(OWNER|REPOSITORY)/;
const placeholder = /(?:YOUR_GITHUB_(OWNER|REPOSITORY)|your_github_owner|your_github_repository)/i;
const forkRepository = 'https://github.com/hopol/open-video-downloader-zh-cn';
const forkRepositoryPattern = /https:\/\/github\.com\/hopol\/open-video-downloader-zh-cn(?:\.git)?(?:[\/#?]|$)/;
let failed = false;

function fail(message) {
  console.error(`身份验证失败：${message}`);
  failed = true;
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(root, relativePath), 'utf8'));
}

async function mustExist(relativePath) {
  try {
    await stat(resolve(root, relativePath));
  } catch {
    fail(`缺少必需文件 ${relativePath}`);
  }
}

const [packageJson, cargoToml, tauriConfig, upstream] = await Promise.all([
  readJson('package.json'),
  readFile(resolve(root, 'src-tauri/Cargo.toml'), 'utf8'),
  readJson('src-tauri/tauri.conf.json'),
  readJson('.fork/upstream.json'),
]);

for (const file of ['LICENSE', 'NOTICE', 'AGENTS.md', '.fork/upstream.json']) {
  await mustExist(file);
}

if (packageJson.version !== tauriConfig.version) {
  fail(`package.json 版本 ${packageJson.version} 与 Tauri 版本 ${tauriConfig.version} 不一致`);
}

const cargoVersion = cargoToml.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
if (!cargoVersion) {
  fail('无法从 src-tauri/Cargo.toml 读取版本');
} else if (cargoVersion !== packageJson.version) {
  fail(`Cargo 版本 ${cargoVersion} 与 package.json 版本 ${packageJson.version} 不一致`);
}

if (tauriConfig.identifier === 'com.jelleglebbeek.youtube-dl-gui') {
  fail('Tauri identifier 仍使用上游应用标识');
}

const identifierHasPlaceholder = placeholder.test(tauriConfig.identifier ?? '');
if (identifierHasPlaceholder) {
  console.warn('身份验证提示：Tauri identifier 仍含部署前维护者占位符。');
}

if (!identifierHasPlaceholder && (!tauriConfig.identifier || !/^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/.test(tauriConfig.identifier))) {
  fail(`Tauri identifier 无效：${tauriConfig.identifier ?? '未设置'}`);
}

if (tauriConfig.plugins?.updater || tauriConfig.bundle?.createUpdaterArtifacts) {
  fail('应用自动更新配置仍然存在');
}

const identitySourceFiles = [
  'src-tauri/Cargo.toml',
  'src-tauri/tauri.conf.json',
  'src-tauri/src/lib.rs',
  'src/main.ts',
  'package.json',
];
for (const relativePath of identitySourceFiles) {
  const content = await readFile(resolve(root, relativePath), 'utf8');
  if (/tauri-plugin-updater|@tauri-apps\/plugin-updater|sentry\.io|@sentry\//.test(content)) {
    fail(`${relativePath} 仍包含应用更新器或 Sentry 遥测引用`);
  }
}

if (upstream.upstream?.repository !== 'https://github.com/jely2002/youtube-dl-gui.git') {
  fail('上游来源记录缺失或错误');
}

if (upstream.fork?.repository !== forkRepository) {
  fail(`来源记录中的派生仓库必须为 ${forkRepository}`);
}

if (upstream.fork?.applicationUpdates !== false) {
  fail('来源记录未声明已关闭应用自动更新');
}

if (upstream.fork?.toolManifest?.independenceStatus !== 'temporary-upstream-signed-service') {
  fail('来源记录未准确声明当前工具清单信任边界');
}

if (upstream.fork?.telemetry !== false) {
  fail('来源记录未声明已关闭遥测');
}

const repository = packageJson.repository?.url ?? '';
if (!forkRepositoryPattern.test(repository)) {
  fail(`package.json 仓库地址必须为 ${forkRepository}.git`);
}

if (tauriConfig.identifier !== 'io.github.hopol.open-video-downloader-zh-cn') {
  fail('Tauri identifier 必须为 io.github.hopol.open-video-downloader-zh-cn');
}

const configurableIdentityFiles = [
  'src-tauri/src/menu.rs',
  'src/views/app/settings/SettingsAboutTab.vue',
  'src/components/authentication/CookiesConfig.vue',
  'snapcraft.yaml',
  'SECURITY.md',
  'docs/index.html',
  'docs/js/app.js',
  'docs/README.md',
];
for (const relativePath of configurableIdentityFiles) {
  const content = await readFile(resolve(root, relativePath), 'utf8');
  if (content.includes('https://github.com/jely2002/youtube-dl-gui')) {
    fail(`${relativePath} 仍将用户导向上游项目地址`);
  }
  if (releasePlaceholder.test(content)) {
    fail(`${relativePath} 仍含部署前 GitHub 地址占位符，不能用于正式发布`);
  }
  if (placeholder.test(content)) {
    console.warn(`身份验证提示：${relativePath} 仍含部署前 GitHub 地址占位符。`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('派生项目身份验证通过。');
}
