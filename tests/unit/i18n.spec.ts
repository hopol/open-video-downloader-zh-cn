import { afterEach, describe, expect, it, vi } from 'vitest';

const navigatorLanguagesDescriptor = Object.getOwnPropertyDescriptor(navigator, 'languages');
const navigatorLanguageDescriptor = Object.getOwnPropertyDescriptor(navigator, 'language');

function mockBrowserLanguages(languages: string[]) {
  Object.defineProperty(navigator, 'languages', {
    configurable: true,
    value: languages,
  });
  Object.defineProperty(navigator, 'language', {
    configurable: true,
    value: languages[0] ?? 'en',
  });
}

afterEach(() => {
  vi.resetModules();
  if (navigatorLanguagesDescriptor) {
    Object.defineProperty(navigator, 'languages', navigatorLanguagesDescriptor);
  }
  if (navigatorLanguageDescriptor) {
    Object.defineProperty(navigator, 'language', navigatorLanguageDescriptor);
  }
});

describe('默认界面语言', () => {
  it.each([
    ['zh-CN', 'zh-CN'],
    ['zh-Hans', 'zh-CN'],
    ['zh', 'zh-CN'],
    ['zh-TW', 'zh-TW'],
    ['zh-Hant', 'zh-TW'],
  ])('将 %s 解析为 %s', async (browserLanguage, expectedLocale) => {
    mockBrowserLanguages([browserLanguage]);
    const { getDefaultLocale } = await import('../../src/i18n.ts');

    expect(getDefaultLocale()).toBe(expectedLocale);
  });
});
