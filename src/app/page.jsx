"use client";
import React, { useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLanguage, loc } from "./utils";
import { LanguageSelector, MajdataLogo, UserInfo, SongList, AdComponent, UnifiedHeader } from "./widgets";
import { apiroot3 } from "./apiroot";

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      }
    );
  }, []);

  if (!ready) return <div className="loading"></div>;

  return (
    <>
      {/* Background */}
      <div className="bg"></div>
      
      {/* Unified Header */}
      <UnifiedHeader />

      {/* Events Carousel */}
      <EventsCarousel />
      {/* Floating Buttons */}
      <div className="floating-buttons">
        {/* Go to Top Button */}
        <div
          className="topButton"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          ↑
        </div>

        {/* Language Settings Button */}
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
        </div>
      </div>
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
      {/* Main Content */}
      <main className="main-content">
        <MainComp />
      </main>

      
      {/* Footer */}
      <footer className="site-footer">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7973799234411834" crossOrigin="anonymous"></script>
        <AdComponent/>
        <a href="/minigame" className="footer-game-link">
          <img className="footerImage" loading="lazy" src={"/bee.webp"} alt={loc("MiniGame")} />
        </a>
      </footer>
    </>
  );
}

function EventsCarousel(){
  // 智能获取首页推荐活动数据（带时间计算）
  const { getFeaturedEventsWithTime, getNonFeaturedEventsCount } = require('./utils/eventsData.js');
  const events = getFeaturedEventsWithTime(2); // 获取2个推荐活动（带智能时间）
  const remainingEventsCount = getNonFeaturedEventsCount(); // 获取剩余活动数量

  return (
    <section className="events-showcase">
      <div className="events-showcase-container">
        <div className="events-grid">
          {/* 智能显示推荐活动卡片 */}
          {events.map((event, i) => (
            <div key={i} className="event-card">
              <a href={event.href} className="event-link">
                <div className="event-image-container">
                  <img 
                    className="event-image" 
                    src={event.src} 
                    alt={event.alt} 
                    loading="lazy" 
                  />
                  <div className="event-hover-info">
                    <div className="event-details">
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-meta">
                        <span className="event-category">{event.category}</span>
                        <span className="event-time" title={`活动创建于 ${event.createDateFormatted}`}>
                          • {event.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
          
          {/* 第三个卡片：more 按钮 */}
          <div className="event-card more-card">
            <a href="/events" className="event-link">
              <div className="more-content">
                <div className="more-icon">→</div>
                <div className="more-text">more</div>
              </div>
              <div className="more-overlay">
                <div className="more-hover-text">
                  <span>{loc("ViewAllEvents")}</span>
                  <span className="more-count">+{remainingEventsCount} {loc("EventsCount")}</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchBar({ onChange, initS, sortType, onSortChange }) {
  const sortOptions = [
    loc("UploadDate"),
    loc("LikeCount"),
    loc("CommentCount"),
    loc("PlayCount"),
  ];
  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-row">
          <div className="search-bar">
            <input
              type="text"
              className="searchInput modern-search"
              placeholder={initS === "" ? loc("SearchPlaceholder") : initS}
              onChange={onChange}
              onClick={onChange}
            />
          </div>
          <div className="search-controls">
            <div className="sort-selector">
              <label className="sort-label">{loc("SortBy")}</label>
              <select
                value={sortType}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onSortChange(val);
                }}
                className="sortSelect modern-select"
              >
                {sortOptions.map((label, i) => (
                  <option key={i} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <IntegratedDownloadTypeSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

function MainComp() {
  const [Search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [maxpage, setMaxpage] = useState(999999);
  const [sortType, setSortType] = useState(0);

  useEffect(() => {
    if (!isLoaded) {
      const a = localStorage.getItem("search");
      const b = localStorage.getItem("lastclickpage");
      const s = localStorage.getItem("sort");
      setSearch(a ? a : "");
      setPage(parseInt(b ? b : 0));
      setIsLoaded(true);
      setSortType(s ? parseInt(s) : 0);
    }
  }, [isLoaded]);

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setSearch(value);
      setPage(0);
      setMaxpage(9999999999999);
      localStorage.setItem("search", value);
      localStorage.setItem("lastclickpage", 0);
    },
    // delay in ms
    500
  );

  const onSortChange = (val) => {
    setSortType(val);
    localStorage.setItem("sort", val);
    setPage(0);
    localStorage.setItem("lastclickpage", 0);
  };

  const sortWords = ["", "likep", "commp", "playp"];

  // 渲染数据
  return (
    <>
      <SearchBar
        onChange={(e) => debounced(e.target.value)}
        initS={Search}
        sortType={sortType}
        onSortChange={onSortChange}
      />

      <SongList
        url={
          apiroot3 +
          "/maichart/list?sort=" +
          sortWords[sortType] +
          "&page=" +
          page +
          "&search=" +
          encodeURIComponent(Search)
        }
        page={page}
        setMax={setMaxpage}
      />

      <div className="pagination-section">
        <div className="pagination-container">
          <button
            className={`pagination-btn ${page - 1 < 0 ? 'disabled' : ''}`}
            disabled={page - 1 < 0}
            onClick={() => {
              setPage(page - 1);
              window.scrollTo(0, 200);
            }}
          >
            ← {loc("LastPage")}
          </button>

          <div className="page-input-container">
            <span className="page-label">{loc("PageOf")}</span>
            <input
              type="number"
              value={page}
              className="page-input"
              onChange={(event) => {
                if (event.target.value !== "")
                  setPage(parseInt(event.target.value));
                else setPage(0);
              }}
              min="0"
              step="1"
            />
            <span className="page-label">{loc("Page")}</span>
          </div>

          <button
            className={`pagination-btn ${page >= maxpage ? 'disabled' : ''}`}
            disabled={page >= maxpage}
            onClick={() => {
              setPage(page + 1);
              window.scrollTo(0, 200);
            }}
          >
            {loc("NextPage")} →
          </button>
        </div>
        
        <button
          className="first-page-btn"
          onClick={() => {
            setPage(0);
            window.scrollTo(0, 200);
          }}
        >
          {loc("FrontPage")}
        </button>
      </div>
    </>
  );
}

// 集成到搜索栏的简化版本
function IntegratedDownloadTypeSelector(){
  const [currentType,setCurrentType] = useState("zip")
  const [justChanged, setJustChanged] = useState(false)

  useEffect(()=>{
    //get init type
    const type = localStorage.getItem("DownloadType")
    if(type!=undefined)
      setCurrentType(type);
  })

  const handleChange = async (e) => {
      const newtype = e.target.value
      localStorage.setItem("DownloadType", newtype)
      setCurrentType(newtype)
      
      // 显示保存成功状态
      setJustChanged(true)
      setTimeout(() => setJustChanged(false), 2000)
    };

  return (
    <div className="download-format-selector">
      <label className={`sort-label ${justChanged ? 'label-success' : ''}`}>
        {loc("DownloadFormat")}
        {justChanged && <span className="success-indicator">✓</span>}
      </label>
      <select
        value={currentType}
        onChange={handleChange}
        className="sortSelect modern-select"
      >
        <option value="zip">ZIP</option>
        <option value="adx">ADX</option>
      </select>
    </div>
  );
}

// 保留原版本的DownloadTypeSelector以防其他地方需要使用
function DownloadTypeSelector(){
  const [currentType,setCurrentType] = useState("zip")
  const [justChanged, setJustChanged] = useState(false)

  useEffect(()=>{
    //get init type
    const type = localStorage.getItem("DownloadType")
    if(type!=undefined)
      setCurrentType(type);
  })

  const handleChange = async (e) => {
      const newtype = e.target.value
      localStorage.setItem("DownloadType", newtype)
      setCurrentType(newtype)
      
      // 显示保存成功状态
      setJustChanged(true)
      setTimeout(() => setJustChanged(false), 2000)
    };

  return (
    <div className={`setting-item ${justChanged ? 'setting-success' : ''}`}>
      <div className="setting-icon">{justChanged ? '✅' : '📁'}</div>
      <div className="setting-content">
        <label className="setting-label">
          {loc("DownloadFormatFull")} / Download Format
          {justChanged && <span className="setting-status">{loc("Saved")}</span>}
        </label>
        <select
          value={currentType}
          onChange={handleChange}
          className="setting-select"
        >
          <option value="zip">{loc("ZipFormat")}</option>
          <option value="adx">{loc("AdxFormat")}</option>
        </select>
      </div>
    </div>
  );
}