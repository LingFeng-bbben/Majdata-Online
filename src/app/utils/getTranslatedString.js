let languageCache = {};
let currentLanguage = "en";

export async function setLanguage(lang) {
  lang = lang.slice(0, 2);
  if (languageCache[lang]) {
    currentLanguage = lang;
    return;
  }
  localStorage.setItem("language", lang);
  try {
    const response = await fetch(`/i18n/${lang}.json`);
    if (!response.ok) throw new Error("Language file not found");
    languageCache[lang] = await response.json();
    currentLanguage = lang;
    console.log(`[i18n] Switch to ${lang}`);
  } catch (e) {
    console.error(`[i18n] Failed to load language: ${lang}`, e);
    languageCache[lang] = {}; // fallback to empty
  }
}

export function getTranslatedString(key) {
  const translations = languageCache[currentLanguage] || {};
  if (!translations[key]) {
    console.error(`[i18n] Failed to find ${key} in ${currentLanguage}`);
    // console.log(languageCache[currentLanguage]);
  }
  return translations[key] || key;
}

// 导出 loc 作为 getTranslatedString 的别名
export const loc = getTranslatedString;
