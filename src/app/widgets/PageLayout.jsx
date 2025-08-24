"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loc } from "../utils";
import {
  MajdataLogo,
  UserInfo,
  LanguageSelector,
  AdComponent,
  UnifiedHeader,
  FloatingButtons,
} from "./index";

export default function PageLayout({
  children,
  showNavigation = true,
  navigationItems = [],
  showSettings = true,
  showAds = true,
  showFooter = true,
  showBackToHome = true,
  title = null,
  className = "",
}) {
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  return (
    <>
      {/* Background */}
      <div className="bg"></div>

      {/* Unified Header */}
      <UnifiedHeader />

      {/* Page Title */}
      {title && (
        <section className="page-title-section">
          <div className="page-title-container">
            <h1 className="page-title">{title}</h1>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className={`main-content ${className}`}>{children}</main>

      {/* Back to Home Section */}
      {showBackToHome && (
        <section className="back-to-home-section">
          <div className="back-to-home-container">
            <Link href="/" className="back-to-home-link">
              <div className="back-to-home-button">{loc("BackToHome")}</div>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      {showFooter && (
        <footer className="site-footer">
          {showAds && (
            <>
              <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7973799234411834"
                crossOrigin="anonymous"
              ></script>
              <AdComponent />
            </>
          )}

          {/* Footer Content */}
          <div className="footer-content">
            {/* Copyright */}
            <div className="footer-copyright">
              {loc("FooterCopyright")}
            </div>
            
            {/* Open Source Info */}
            <div className="footer-opensource">
              <a 
                href="https://github.com/LingFeng-bbben/Majdata-Online" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-github-link"
              >
                {loc("FooterOpenSource")}
              </a>
            </div>
            
            {/* Community */}
            <div className="footer-community">
              {loc("FooterCommunity")}
            </div>
          </div>

          {/* Mini Game Link */}
          <a href="/minigame" className="footer-game-link">
            <img
              className="footerImage"
              loading="lazy"
              src={"/bee.webp"}
              alt={loc("MiniGame")}
            />
          </a>
        </footer>
      )}

      {/* Floating Buttons */}
      <FloatingButtons />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Floating Buttons */}
      <div className="floating-buttons">
        {/* Go to Top Button */}
        <button
          className="topButton"
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
        {showSettings && (
          <div className="floating-language-button">
            <button
              className="language-float-button"
              onClick={() => setShowLanguagePopup(!showLanguagePopup)}
              aria-label={loc("LanguageSettings")}
            >
              🌐
            </button>

            {/* Language Popup */}
            {showLanguagePopup && (
              <>
                <div
                  className="language-popup-overlay"
                  onClick={() => setShowLanguagePopup(false)}
                ></div>
                <div className="language-popup-simple">
                  <div className="language-popup-header">
                    <span className="language-popup-title">
                      {loc("SelectLanguage")} / Language
                    </span>
                    <button
                      className="language-popup-close"
                      onClick={() => setShowLanguagePopup(false)}
                    >
                      ×
                    </button>
                  </div>
                  <LanguageSelector />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
