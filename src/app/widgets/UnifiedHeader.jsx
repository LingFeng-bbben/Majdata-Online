"use client";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { MajdataLogo } from "./index";
import { loc } from "../utils";
import { apiroot3 } from "../apiroot";
import { AiOutlineLoading3Quarters, AiOutlineUser } from "react-icons/ai";

export default function UnifiedHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMainNavOpen, setIsMainNavOpen] = useState(false);
  const [isMobileAuthMenuOpen, setIsMobileAuthMenuOpen] = useState(false);
  const [isRankingsMenuOpen, setIsRankingsMenuOpen] = useState(false);
  const [isMobileRankingsOpen, setIsMobileRankingsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mainNavRef = useRef(null);
  const mobileAuthMenuRef = useRef(null);
  const rankingsMenuRef = useRef(null);

  const fetcher = (url) =>
    fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
      res.json()
    );

  const {
    data: userInfo,
    error,
    isLoading,
  } = useSWR(apiroot3 + "/account/info/", fetcher);
  const username = userInfo?.username || "";
  const isLoggedIn = !!username && !error;

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mainNavRef.current && !mainNavRef.current.contains(event.target)) {
        setIsMainNavOpen(false);
        setIsMobileRankingsOpen(false); // 主菜单关闭时，同时关闭子菜单
      }
      if (
        mobileAuthMenuRef.current &&
        !mobileAuthMenuRef.current.contains(event.target)
      ) {
        setIsMobileAuthMenuOpen(false);
      }
      if (
        rankingsMenuRef.current &&
        !rankingsMenuRef.current.contains(event.target)
      ) {
        setIsRankingsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // 调用服务器登出API
      await fetch(apiroot3 + "/account/Logout", {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });

      // 清除本地Cookie作为备用措施
      document.cookie =
        "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 关闭用户菜单
      setIsUserMenuOpen(false);

      // 跳转到首页
      window.location.href = "/";
    } catch (error) {
      console.error(loc("LogoutFailed"), error);
      // 即使API调用失败，也清除本地状态并跳转
      document.cookie =
        "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsUserMenuOpen(false);
      window.location.href = "/";
    }
  };

  return (
    <header className="unified-header">
      <div className="header-container">
        {/* 左侧区域：Logo + 导航 */}
        <div className="header-left-section">
          {/* Logo Section */}
          <div className="header-logo">
            <a href="/">
              <MajdataLogo />
            </a>
          </div>

          {/* Main Navigation */}
          <nav className="header-nav" ref={mainNavRef}>
            {/* 桌面端：完整导航 */}
            <div className="nav-links desktop-nav">
              {/* 榜单下拉菜单 */}
              <div className="nav-dropdown" ref={rankingsMenuRef}>
                <button
                  className={`nav-item nav-dropdown-trigger ${
                    isRankingsMenuOpen ? "active" : ""
                  }`}
                  onClick={() => setIsRankingsMenuOpen(!isRankingsMenuOpen)}
                >
                  <span className="nav-label">{loc("Rankings")}</span>
                  <span
                    className={`dropdown-arrow ${
                      isRankingsMenuOpen ? "open" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isRankingsMenuOpen && (
                  <div className="nav-dropdown-menu">
                    <a href="/ranking" className="nav-dropdown-item">
                      <span className="nav-label">{loc("Recommend")}</span>
                    </a>
                    <a href="/user-ranking" className="nav-dropdown-item">
                      <span className="nav-label">
                        {loc("UserRankingTitle")}
                      </span>
                    </a>
                    <a href="/mmfc-ranking" className="nav-dropdown-item">
                      <span className="nav-label">{loc("MMFCRanking")}</span>
                    </a>
                  </div>
                )}
              </div>

              <a href="/edit" className="nav-item">
                <span className="nav-label">{loc("ChartEditor")}</span>
              </a>
              <a href="/events" className="nav-item">
                <span className="nav-label">{loc("Contest")}</span>
              </a>
              <a href="/eventTag?id=Original" className="nav-item">
                <span className="nav-label">{loc("OriginalSongs")}</span>
              </a>
            </div>

            {/* 移动端：汉堡菜单 */}
            <div className="mobile-nav">
              <button
                className={`mobile-nav-trigger ${
                  isMainNavOpen ? "active" : ""
                }`}
                onClick={() => setIsMainNavOpen(!isMainNavOpen)}
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>

              {isMainNavOpen && (
                <div className="mobile-nav-menu">
                  {/* 榜单项 - 可展开 */}
                  <div className="mobile-nav-item-wrapper">
                    <button
                      className={`mobile-nav-item mobile-nav-expandable ${
                        isMobileRankingsOpen ? "active" : ""
                      }`}
                      onClick={() =>
                        setIsMobileRankingsOpen(!isMobileRankingsOpen)
                      }
                    >
                      <span className="nav-label">{loc("Rankings")}</span>
                      <span
                        className={`expand-arrow ${
                          isMobileRankingsOpen ? "open" : ""
                        }`}
                      >
                        ›
                      </span>
                    </button>

                    {/* 榜单子菜单 - 横向展开 */}
                    {isMobileRankingsOpen && (
                      <div className="mobile-nav-submenu">
                        <a href="/ranking" className="mobile-nav-subitem">
                          <span className="nav-label">{loc("Recommend")}</span>
                        </a>
                        <a
                          href="/user-ranking"
                          className="mobile-nav-subitem"
                        >
                          <span className="nav-label">
                            {loc("UserRankingTitle")}
                          </span>
                        </a>
                        <a
                          href="/mmfc-ranking"
                          className="mobile-nav-subitem"
                        >
                          <span className="nav-label">
                            {loc("MMFCRanking")}
                          </span>
                        </a>
                      </div>
                    )}
                  </div>

                  <a href="/edit" className="mobile-nav-item">
                    <span className="nav-label">{loc("ChartEditor")}</span>
                  </a>
                  <a href="/events" className="mobile-nav-item">
                    <span className="nav-label">{loc("Contest")}</span>
                  </a>
                  <a href="/eventTag?id=Original" className="mobile-nav-item">
                    <span className="nav-label">{loc("OriginalSongs")}</span>
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="mobile-header-logo">
          <a href="/">
            <img
              className="xxlb"
              src="../../../salt.webp"
              alt="xxlb"
            >
            </img>
          </a>
        </div>

        {/* User Section */}
        <div className="header-user" ref={userMenuRef}>
          {isLoading
            ? (
              <div className="auth-links">
                <div className="auth-link loading-placeholder">
                  <AiOutlineLoading3Quarters className="loading-spinner" />
                  <span className="auth-label desktop-only">
                    {loc("Loading")}
                  </span>
                </div>
              </div>
            )
            : isLoggedIn
              ? (
                <div className="user-dropdown">
                  <button
                    className={`user-trigger ${isUserMenuOpen ? "active" : ""}`}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <img
                      className="user-avatar"
                      src={apiroot3 + "/account/Icon?username=" + username}
                      alt={username}
                    />
                    <span className="username desktop-only">{username}</span>
                    <span
                      className={`dropdown-arrow ${isUserMenuOpen ? "open" : ""}`}
                    >
                      ▼
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-menu">
                      <a href={"/space?id=" + username} className="menu-item">
                        <span className="menu-label">
                          {loc("PersonalHomePage")}
                        </span>
                      </a>
                      {
                        /* <a href="/user" className="menu-item">
                      <span className="menu-label">用户中心</span>
                    </a> */
                      }
                      <a href="/user/charts" className="menu-item">
                        <span className="menu-label">
                          {loc("ChartsManagement")}
                        </span>
                      </a>
                      <a href="/user/profile" className="menu-item">
                        <span className="menu-label">
                          {loc("AccountSetting")}
                        </span>
                      </a>
                      <div className="menu-divider"></div>
                      <button onClick={handleLogout} className="menu-item logout">
                        <span className="menu-label">{loc("Logout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              )
              : (
                <div className="auth-section" ref={mobileAuthMenuRef}>
                  {/* 桌面端：传统链接形式 */}
                  <div className="auth-links desktop-auth">
                    <a href="/login" className="auth-link">
                      <span className="auth-label">{loc("Login")}</span>
                    </a>
                    <a href="/register" className="auth-link register">
                      <span className="auth-label">{loc("Register")}</span>
                    </a>
                  </div>

                  {/* 移动端：下拉菜单形式 */}
                  <div className="mobile-auth-dropdown">
                    <button
                      className={`mobile-auth-trigger ${isMobileAuthMenuOpen ? "active" : ""
                        }`}
                      onClick={() =>
                        setIsMobileAuthMenuOpen(!isMobileAuthMenuOpen)}
                    >
                      <AiOutlineUser className="auth-icon" />
                      <span
                        className={`dropdown-arrow ${isMobileAuthMenuOpen ? "open" : ""
                          }`}
                      >
                        ▼
                      </span>
                    </button>

                    {isMobileAuthMenuOpen && (
                      <div className="mobile-auth-menu">
                        <a href="/login" className="mobile-auth-item">
                          <span className="menu-label">{loc("Login")}</span>
                        </a>
                        <a href="/register" className="mobile-auth-item register">
                          <span className="menu-label">{loc("Register")}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
        </div>
      </div>
    </header>
  );
}
