let languageCache = {};
let currentLanguage = "en";

export async function setLanguage(lang) {
  lang = lang.slice(0,2);
  if (languageCache[lang]) {
    currentLanguage = lang;
    return;
  }
  localStorage.setItem("language", lang);
  try {
    const response = await fetch(`/i18n/${lang}.json`);
    if (!response.ok) throw new Error('Language file not found');
    languageCache[lang] = await response.json();
    currentLanguage = lang;
    console.log("切换到", lang, languageCache[lang]);
  } catch (e) {
    console.error(`[i18n] Failed to load language: ${lang}`, e);
    languageCache[lang] = {}; // fallback to empty
  }
}

export function getTranslatedString(key) {
  const translations = languageCache[currentLanguage] || {};
  if (!translations[key]){
    console.log(`没找到${key}在${currentLanguage}`);
    console.log(languageCache);
    console.log(languageCache[currentLanguage] );
  }
  return translations[key] || key;
}
