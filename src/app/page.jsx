"use client";
import React, { useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { setLanguage, loc } from "./utils";
import { SongList, AdComponent, UnifiedHeader, FloatingButtons } from "./widgets";
import { apiroot3 } from "./apiroot";
import { getCarouselEvents, getNextCarouselEvents, getNonFeaturedEventsCount, getEventStatusText, getEventStatusClass, getOngoingEvents } from "./utils/eventsData";

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ready, setReady] = useState(false);
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
      <FloatingButtons />
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
          <img className="footerImage" loading="lazy" src={"/bee.webp"} alt={loc("MiniGame")} />
        </a>
      </footer>
    </>
  );
}

function EventsCarousel(){
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldRotate, setShouldRotate] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const remainingEventsCount = getNonFeaturedEventsCount();

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 初始化活动数据
  useEffect(() => {
    const result = getCarouselEvents();
    setCurrentEvents(result.events);
    setShouldRotate(result.shouldRotate);
  }, []);

  // 智能轮播逻辑：只有在需要轮播时才启动定时器（仅限桌面端）
  useEffect(() => {
    if (!shouldRotate || isMobile) {
      return; // 不需要轮播或移动端，直接返回
    }

    const interval = setInterval(() => {
      // 第一阶段：开始淡出
      setIsTransitioning(true);
      
      // 第二阶段：在淡出进行到一半时更换内容
      setTimeout(() => {
        const result = getNextCarouselEvents();
        setCurrentEvents(result.events);
      }, 300); // 在过渡进行到一半时更换内容
      
      // 第三阶段：继续完成淡入效果
      setTimeout(() => {
        setIsTransitioning(false);
      }, 650); // 稍微延长总过渡时间
    }, 7000); // 延长轮播间隔到7秒，让用户有更多时间观看

    return () => clearInterval(interval);
  }, [shouldRotate, isMobile]);

  // 移动端渲染
  if (isMobile) {
    return <MobileEventsSwiper />;
  }

  // 桌面端渲染（原有逻辑）
  return (
    <section className="events-showcase">
      <div className="events-showcase-container">
        <div className="events-grid">
          {/* 智能轮播活动卡片 */}
          {currentEvents.map((event, i) => (
            <div 
              key={`${event.id}-${i}`} 
              className={`event-card ${isTransitioning ? 'transitioning' : ''} ${!shouldRotate ? 'static' : ''}`}
            >
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
                        <span className={`event-status ${getEventStatusClass(event)}`}>
                          • {getEventStatusText(event)}
                        </span>
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
          
          {/* 第三个卡片：more 按钮（不参与轮播） */}
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

// 移动端专用的 Swiper 组件
function MobileEventsSwiper() {
  const [ongoingEvents, setOngoingEvents] = useState([]);

  useEffect(() => {
    // 获取所有进行中的活动
    const events = getOngoingEvents().map(event => ({
      ...event,
      timeAgo: new Date(event.createDate) < new Date() 
        ? Math.floor((new Date() - new Date(event.createDate)) / (1000 * 60 * 60 * 24)) + '天前'
        : '今天',
      createDateFormatted: new Date(event.createDate).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
    setOngoingEvents(events);
  }, []);

  return (
    <section className="mobile-events-showcase">
      <div className="mobile-events-container">
        <div className="mobile-swiper-wrapper">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            centeredSlides={false}
            autoplay={ongoingEvents.length > 0 ? {
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            } : false}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            navigation={false}
            loop={false}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                spaceBetween: 20
              },
              600: {
                slidesPerView: 1.5,
                spaceBetween: 24
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24
              }
            }}
            className="mobile-events-swiper"
          >
            {/* 进行中的活动 */}
            {ongoingEvents.map((event) => (
              <SwiperSlide key={event.id} className="mobile-event-slide">
                <a href={event.href} className="mobile-event-link">
                  <div className="mobile-event-card">
                    <div className="mobile-event-image-container">
                      <img 
                        className="mobile-event-image" 
                        src={event.src} 
                        alt={event.alt} 
                        loading="lazy" 
                      />
                      <div className="mobile-event-overlay">
                        <div className="mobile-event-info">
                          <h3 className="mobile-event-title">{event.title}</h3>
                          <div className="mobile-event-meta">
                            <span className="mobile-event-category">{event.category}</span>
                            <span className={`mobile-event-status ${getEventStatusClass(event)}`}>
                              • {getEventStatusText(event)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
            
            {/* More 页面作为 Swiper 的最后一页 */}
            <SwiperSlide className="mobile-event-slide mobile-more-slide">
              <a href="/events" className="mobile-event-link">
                <div className="mobile-more-card">
                  <div className="mobile-more-card-content">
                    <div className="mobile-more-icon-large">→</div>
                    <h3 className="mobile-more-title">MORE</h3>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          </Swiper>
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

