"use client";
import React, { useState } from "react";
import { loc } from "../utils";
import LanguageSelector from "./LanguageSelector";

const FloatingButtons = () => {
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  return (
    <>
      {/* Floating Buttons */}
      <div className="floating-buttons">
        {/* Go to Top Button */}
        <button
          className="topButton floating-button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          aria-label="回到顶部"
        >
          ↑
        </button>

        {/* Language Settings Button */}
        <button 
          className="language-float-button floating-button"
          onClick={() => setShowLanguagePopup(!showLanguagePopup)}
          aria-label={loc("LanguageSettings")}
        >
          🌐
        </button>
      </div>

      {/* Language Popup */}
      {showLanguagePopup && (
        <>
          <div 
            className="language-popup-overlay"
            onClick={() => setShowLanguagePopup(false)}
          ></div>
          <div className="language-popup">
            <h4 className="language-popup-title">{loc("SelectLanguage")} / Language</h4>
            <button 
              className="language-popup-close"
              onClick={() => setShowLanguagePopup(false)}
            >
              ×
            </button>
            <LanguageSelector />
          </div>
        </>
      )}
    </>
  );
};

export default FloatingButtons;
