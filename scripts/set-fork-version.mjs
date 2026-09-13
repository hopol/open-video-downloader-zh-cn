#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error('用法：node scripts/set-fork-version.mjs <语义化版本号>');
  process.exit(1);
}

const packagePath = resolve(root, 'package.json');
const cargoPath = resolve(root, 'src-tauri/Cargo.toml');
const tauriPath = resolve(root, 'src-tauri/tauri.conf.json');

const [packageText, cargoText, tauriText] = await Promise.all([
  readFile(packagePath, 'utf8'),
  readFile(cargoPath, 'utf8'),
  readFile(tauriPath, 'utf8'),
]);

const packageJson = JSON.parse(packageText);
packageJson.version = version;

const nextCargo = cargoText.replace(/^version\s*=\s*"[^"]+"/m, `version = "${version}"`);
if (nextCargo === cargoText) {
  throw new Error('无法更新 src-tauri/Cargo.toml 中的版本');
}

const tauriConfig = JSON.parse(tauriText);
tauriConfig.version = version;

await Promise.all([
  writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`),
  writeFile(cargoPath, nextCargo),
  writeFile(tauriPath, `${JSON.stringify(tauriConfig, null, 2)}\n`),
]);

console.log(`已将派生版本同步为 ${version}。请执行 npm install --package-lock-only 更新 package-lock.json。`);
