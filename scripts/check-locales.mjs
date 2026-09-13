#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pairs = [
  ['src/locales/en.json', 'src/locales/zh-CN.json'],
  ['src-tauri/locales/en.json', 'src-tauri/locales/zh-CN.json'],
];

let failed = false;

function flatten(value, path = '') {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) => flatten(child, path ? `${path}.${key}` : key));
  }

  return [[path, value]];
}

function placeholders(value) {
  if (typeof value !== 'string') return [];
  return [...value.matchAll(/\{([^{}]+)\}/g)].map(match => match[1]).sort();
}

async function checkPair(basePath, translatedPath) {
  const [base, translated] = await Promise.all([
    readFile(resolve(root, basePath), 'utf8').then(JSON.parse),
    readFile(resolve(root, translatedPath), 'utf8').then(JSON.parse),
  ]);
  const baseEntries = new Map(flatten(base));
  const translatedEntries = new Map(flatten(translated));
  const keys = new Set([...baseEntries.keys(), ...translatedEntries.keys()]);

  for (const key of [...keys].sort()) {
    const baseValue = baseEntries.get(key);
    const translatedValue = translatedEntries.get(key);
    const label = `${translatedPath}:${key}`;

    if (!baseEntries.has(key)) {
      console.error(`${label}: 翻译文件中存在英文基准未定义的键`);
      failed = true;
      continue;
    }

    if (!translatedEntries.has(key)) {
      console.error(`${label}: 缺少翻译键`);
      failed = true;
      continue;
    }

    if (typeof baseValue !== typeof translatedValue) {
      console.error(`${label}: 值类型不一致（英文为 ${typeof baseValue}，翻译为 ${typeof translatedValue}）`);
      failed = true;
      continue;
    }

    const basePlaceholders = placeholders(baseValue);
    const translatedPlaceholders = placeholders(translatedValue);
    if (basePlaceholders.join('\0') !== translatedPlaceholders.join('\0')) {
      console.error(`${label}: 插值占位符不一致（英文为 ${basePlaceholders.join(', ') || '无'}，翻译为 ${translatedPlaceholders.join(', ') || '无'}）`);
      failed = true;
    }
  }
}

for (const pair of pairs) {
  await checkPair(...pair);
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('简体中文语言包检查通过。');
}
