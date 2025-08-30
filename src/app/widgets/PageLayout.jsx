"use client";
import React from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loc } from "../utils";
import { AdComponent, FloatingButtons, UnifiedHeader } from "./index";

export default function PageLayout({
  children,
  showAds = true,
  showFooter = true,
  showBackToHome = true,
  title = null,
  className = "",
}) {
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
              >
              </script>
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
              {" | "}
              <a
                href="https://discord.gg/AcWgZN7j6K"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-github-link"
              >
                Discord
              </a>
              {" | "}
              <a
                href="https://qun.qq.com/universal-share/share?ac=1&authKey=2m%2BXMJ2NrjiomE9CYBVp6ys1K9SjAJ3kl%2B3OCfVEff4ffLj3Z%2BYXJIBXbWJrdGvJ&busi_data=eyJncm91cENvZGUiOiI2Njc2NDQzMzgiLCJ0b2tlbiI6IjV0VTk1STl1Ti9RbmhvR0lHdVdySVVpR09DWFk3Y1JGelY0Qlg2YWFmYkxjYlhWZzZraDFUWTlyNHI5N243cG8iLCJ1aW4iOiIxMzIzMjkxMDk0In0%3D&data=oyLVI6BKjGNDg5-SEEe1Qw_DjQ3EnQSayTWrGQBDgGTxOw0_YffoTI_g4KQ3cJLbkkwkmzUxY3cWDqnRk-NTyw&svctype=4&tempid=h5_group_info"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-github-link"
              >
                QQ
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
    </>
  );
}
