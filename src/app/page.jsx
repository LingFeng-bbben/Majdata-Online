"use client";
import React, { useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";

import "swiper/css/pagination";
import { loc, setLanguage } from "./utils";
import { PageLayout, SongList } from "./widgets";
import { apiroot3 } from "./apiroot";
import {
  getEventStatusClass,
  getEventStatusText,
  getNonFeaturedEventsCount,
  getActiveEvents,
  getTimeAgo,
} from "./utils/eventsData";

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
      },
    );
  }, []);

  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout
      showBackToHome={false}
      className="home-page"
    >
      {/* Events Carousel */}
      <EventsCarousel />

      {/* Main Content */}
      <MainComp />
    </PageLayout>
  );
}

function EventsCarousel() {
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 移动端和PC端都使用Swiper
  return isMobile ? <MobileEventsSwiper /> : <DesktopEventsSwiper />;
}

// PC端专用的 Swiper 组件
function DesktopEventsSwiper() {
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const remainingEventsCount = getNonFeaturedEventsCount();

  useEffect(() => {
    // 获取所有活跃的活动（进行中 + 即将开始）
    const events = getActiveEvents().map((event) => ({
      ...event,
      timeAgo: getTimeAgo(event.createDate),
      createDateFormatted: new Date(event.createDate).toLocaleDateString(
        "zh-CN",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      ),
    }));
    setOngoingEvents(events);
  }, []);

  return (
    <section className="events-showcase">
      <div className="events-showcase-container">
        <div className="desktop-swiper-wrapper">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            centeredSlides={false}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false
              }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={false}
            loop={ongoingEvents.length > 2}
            breakpoints={{
              1024: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1280: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1440: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
            className="desktop-events-swiper"
          >
            {/* 活跃的活动（进行中 + 即将开始） */}
            {ongoingEvents.map((event) => (
              <SwiperSlide key={event.id} className="desktop-event-slide">
                <div className="event-card">
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
                            <span className="event-category">
                              {event.category}
                            </span>
                            <span
                              className={`event-status ${
                                getEventStatusClass(event)
                              }`}
                            >
                              • {getEventStatusText(event)}
                            </span>
                            <span
                              className="event-time"
                              title={`活动创建于 ${event.createDateFormatted}`}
                            >
                              • {event.timeAgo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </SwiperSlide>
            ))}

            {/* More 页面作为 Swiper 的最后一页 */}
            <SwiperSlide className="desktop-event-slide desktop-more-slide">
              <div className="event-card more-card">
                <a href="/events" className="event-link">
                  <div className="more-content">
                    <div className="more-icon">→</div>
                    <div className="more-text">more</div>
                  </div>
                  <div className="more-overlay">
                    <div className="more-hover-text">
                      <span>{loc("ViewAllEvents")}</span>
                      <span className="more-count">
                        +{remainingEventsCount} {loc("EventsCount")}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
}

// 移动端专用的 Swiper 组件
function MobileEventsSwiper() {
  const [ongoingEvents, setOngoingEvents] = useState([]);

  useEffect(() => {
    // 获取所有活跃的活动（进行中 + 即将开始）
    const events = getActiveEvents().map((event) => ({
      ...event,
      timeAgo: getTimeAgo(event.createDate),
      createDateFormatted: new Date(event.createDate).toLocaleDateString(
        "zh-CN",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      ),
    }));
    setOngoingEvents(events);
  }, []);

  return (
    <section className="mobile-events-showcase">
      <div className="mobile-events-container">
        <div className="mobile-swiper-wrapper">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={false}
            loop={false}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              600: {
                slidesPerView: 1.5,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
            className="mobile-events-swiper"
          >
            {/* 活跃的活动（进行中 + 即将开始） */}
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
  const [isMobile, setIsMobile] = useState(false);
  const [currentValue, setCurrentValue] = useState(initS);

  const sortOptions = [
    loc("UploadDate"),
    loc("LikeCount"),
    loc("CommentCount"),
    loc("PlayCount"),
  ];

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 更新当前值
  useEffect(() => {
    setCurrentValue(initS);
  }, [initS]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentValue(value);
    onChange(e);
  };

  const handleClearSearch = () => {
    setCurrentValue("");
    const fakeEvent = { target: { value: "" } };
    onChange(fakeEvent);
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-row">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="modern-search"
                placeholder={initS === "" ? loc("SearchPlaceholder") : initS}
                value={currentValue}
                onChange={handleInputChange}
                onClick={handleInputChange}
              />
              {currentValue && (
                <button
                  className="search-clear-button"
                  onClick={handleClearSearch}
                  title="清空搜索"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="search-controls">
            <div className="sort-selector">
              <select
                value={isMobile
                  ? (sortType === undefined ? "placeholder" : sortType)
                  : sortType}
                onChange={(e) => {
                  if (e.target.value === "placeholder") return;
                  const val = parseInt(e.target.value);
                  onSortChange(val);
                }}
                className="modern-select"
                data-mobile-label={loc("SortBy")}
              >
                {isMobile && (
                  <option value="placeholder" disabled>
                    {loc("SortBy")}
                  </option>
                )}
                {sortOptions.map((label, i) => (
                  <option key={i} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
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
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoaded) {
      // 检查URL中的search参数
      const urlSearchParam = searchParams.get("search");
      const a = urlSearchParam || localStorage.getItem("search");
      const b = localStorage.getItem("lastclickpage");
      const s = localStorage.getItem("sort");
      
      setSearch(a ? a : "");
      setPage(parseInt(b ? b : 0));
      setIsLoaded(true);
      setSortType(s ? parseInt(s) : 0);
      
      // 如果URL中有search参数，保存到localStorage
      if (urlSearchParam) {
        localStorage.setItem("search", urlSearchParam);
      }
    }
  }, [isLoaded, searchParams]);

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
    500,
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
        url={apiroot3 +
          "/maichart/list?sort=" +
          sortWords[sortType] +
          "&page=" +
          page +
          "&search=" +
          encodeURIComponent(Search)}
        page={page}
        setMax={setMaxpage}
      />

      <div className="pagination-section">
        <div className="pagination-container">
          <button
            className={`pagination-btn ${page - 1 < 0 ? "disabled" : ""}`}
            disabled={page - 1 < 0}
            onClick={() => {
              setPage(page - 1);
              window.scrollTo(0, 200);
            }}
          >
            ←
          </button>

          <div className="page-input-container">
            <span className="page-label">{loc("PageOf")}</span>
            <input
              type="number"
              value={page}
              className="page-input"
              onChange={(event) => {
                if (event.target.value !== "") {
                  setPage(parseInt(event.target.value));
                } else setPage(0);
              }}
              min="0"
              step="1"
            />
            <span className="page-label">{loc("Page")}</span>
          </div>

          <button
            className={`pagination-btn ${page >= maxpage ? "disabled" : ""}`}
            disabled={page >= maxpage}
            onClick={() => {
              setPage(page + 1);
              window.scrollTo(0, 200);
            }}
          >
            →
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
        <IntegratedDownloadTypeSelector isMobile={true} />
      </div>
    </>
  );
}

// Simplified version of integrated search bar
function IntegratedDownloadTypeSelector({ isMobile }) {
  const [currentType, setCurrentType] = useState("zip");
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    // Get init type
    const type = localStorage.getItem("DownloadType");
    if (type != undefined) {
      setCurrentType(type);
    }
  });

  const handleChange = async (e) => {
    const newtype = e.target.value;
    if (newtype === "placeholder") return;
    localStorage.setItem("DownloadType", newtype);
    setCurrentType(newtype);

    // Display succession of saving
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 2000);
  };

  return (
    <div className="download-format-selector">
      {!isMobile && (
        <label className={`sort-label ${justChanged ? "label-success" : ""}`}>
          {loc("DownloadFormat")}
          {justChanged && <span className="success-indicator">✓</span>}
        </label>
      )}
      <select
        value={isMobile ? (currentType || "placeholder") : currentType}
        onChange={handleChange}
        className="modern-select"
        data-mobile-label={loc("DownloadFormat")}
      >
        {isMobile && (
          <option value="placeholder" disabled>
            {loc("DownloadFormat")}
            {justChanged && " ✓"}
          </option>
        )}
        <option value="zip">ZIP</option>
        <option value="adx">ADX</option>
      </select>
    </div>
  );
}
