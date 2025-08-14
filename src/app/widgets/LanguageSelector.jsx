import React, { useEffect, useState } from "react";
import { setLanguage} from "../utils";

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
    <div className={`setting-item ${isChanging ? 'setting-loading' : ''}`}>
      <div className="setting-icon">{isChanging ? '🔄' : '🌐'}</div>
      <div className="setting-content">
        <label className="setting-label">
          语言 / Language
          {isChanging && <span className="setting-status">正在切换...</span>}
        </label>
        <select
          value={currentLang}
          onChange={handleChange}
          className="setting-select"
          disabled={isChanging}
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
