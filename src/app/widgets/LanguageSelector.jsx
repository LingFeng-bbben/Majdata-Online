import React, { useEffect, useState } from "react";
import { setLanguage, loc } from "../utils";

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState("en");
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    const browserLang = navigator.language.slice(0, 2);
    const lang = savedLang || browserLang;
    setCurrentLang(lang);
    setLanguage(lang);
  }, []);

  const handleChange = async (e) => {
    const newLang = e.target.value;
    setIsChanging(true);
    setCurrentLang(newLang);
    
    try {
      await setLanguage(newLang);
      // 添加短暂延迟以显示加载状态
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error('Language change failed:', error);
      setIsChanging(false);
    }
  };

  return (
    <div className={`language-selector-simple ${isChanging ? 'setting-loading' : ''}`}>
      <select
        value={currentLang}
        onChange={handleChange}
        className="language-select-simple"
        disabled={isChanging}
      >
        <option value="en">🇺🇸 English</option>
        <option value="zh">🇨🇳 中文</option>
        <option value="ja">🇯🇵 日本語</option>
      </select>
      {isChanging && (
        <div className="language-changing-indicator">
          <span className="loading-spinner">🔄</span>
          <span>{loc("Switching")}</span>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
