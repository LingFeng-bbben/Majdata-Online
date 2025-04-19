// src/components/LanguageInitializer.jsx
"use client";

import { useEffect } from "react";
import { setLanguage } from "../utils";

export default function LanguageInitializer() {
  useEffect(() => {
    const lang = localStorage.getItem("language") || navigator.language.slice(0, 2);
    setLanguage(lang);
  }, []);

  return null; // 不渲染任何内容，只做初始化
}
