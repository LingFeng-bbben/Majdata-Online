import React, { useEffect, useState } from "react";
import { setLanguage, loc } from "../utils";

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    const browserLang = navigator.language.slice(0, 2);
    const lang = savedLang || browserLang;
    setCurrentLang(lang);
    setLanguage(lang);
  }, []);

  const handleChange = async (e) => {
    const newLang = e.target.value;
    setCurrentLang(newLang);
    await setLanguage(newLang);
    window.location.reload(); // 如果你用 Context 管理语言，也可以不刷新
  };

  return (
    <div
      style={{
        width: "fit-content",
        margin: "auto",
        marginTop: "2rem",
        zIndex: 9999,
        backgroundColor: "black",
        padding: "6px 10px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        fontSize: "14px",
        border: "1px solid whitesmoke"
      }}
    >
      <select
        value={currentLang}
        onChange={handleChange}
        style={{
          background: "black",
          border: "none",
          fontSize: "inherit",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="en">🌐 English</option>
        <option value="zh">🇨🇳 中文</option>
        <option value="ja">🇯🇵 日本語</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
