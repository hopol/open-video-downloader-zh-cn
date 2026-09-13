#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tagPrefix = 'zh-cn-v';
const expectedTag = process.argv[2] ?? process.env.GITHUB_REF_NAME;
let failed = false;

function fail(message) {
  console.error(`版本验证失败：${message}`);
  failed = true;
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(root, relativePath), 'utf8'));
}

const [packageJson, tauriConfig, cargoToml, upstream] = await Promise.all([
  readJson('package.json'),
  readJson('src-tauri/tauri.conf.json'),
  readFile(resolve(root, 'src-tauri/Cargo.toml'), 'utf8'),
  readJson('.fork/upstream.json'),
]);

const version = packageJson.version;
const cargoVersion = cargoToml.match(/^version\s*=\s*"([^"]+)"/m)?.[1];

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  fail(`package.json 版本无效：${version}`);
}

if (tauriConfig.version !== version) {
  fail(`Tauri 版本 ${tauriConfig.version} 与 package.json 版本 ${version} 不一致`);
}

if (cargoVersion !== version) {
  fail(`Cargo 版本 ${cargoVersion ?? '未找到'} 与 package.json 版本 ${version} 不一致`);
}

if (upstream.fork?.releaseTagPrefix !== tagPrefix) {
  fail(`来源记录的发布标签前缀必须为 ${tagPrefix}`);
}

if (expectedTag && expectedTag !== `${tagPrefix}${version}`) {
  fail(`标签 ${expectedTag} 必须精确等于 ${tagPrefix}${version}`);
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log(`版本验证通过：${version}${expectedTag ? `（${expectedTag}）` : ''}`);
}
