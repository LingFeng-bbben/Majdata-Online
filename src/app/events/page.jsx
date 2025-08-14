'use client'
import React, { useEffect, useState } from 'react';
import { setLanguage, loc } from "../utils";
import { UnifiedHeader } from "../widgets";
import { getEventsWithTimeAgo } from "../utils/eventsData";

export default function EventsPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  // 获取完整的活动列表（带智能时间计算）
  const allEvents = getEventsWithTimeAgo();

  if (!ready) return <div className="loading">加载中...</div>;

  return (
    <>
      {/* Background */}
      <div className="bg"></div>
      
      {/* Unified Header */}
      <UnifiedHeader />

      {/* Main Content */}
      <main className="events-page">
        <div className="events-page-container">
          <header className="events-page-header">
            <div className="breadcrumb">
              <a href="/" className="breadcrumb-link">首页</a>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">活动列表</span>
            </div>
         
            <p className="events-page-subtitle">
              在此处浏览各种谱面竞赛例如MMFC、线下活动等...
            </p>
          </header>

          <div className="events-grid-page">
            {allEvents.map((event, i) => (
              <div key={i} className="event-card-large">
                <a href={event.href} className="event-link-large">
                  <div className="event-image-container-large">
                    <img 
                      className="event-image-large" 
                      src={event.src} 
                      alt={event.alt} 
                      loading="lazy" 
                    />
                    <div className="event-overlay-large">
                      <div className="event-info-large">
                        <h3 className="event-title-large">{event.title}</h3>
                        <p className="event-description">{event.description}</p>
                        <div className="event-meta-large">
                          <span className="event-category-large">{event.category}</span>
                          <span 
                            className="event-time-large" 
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
            ))}
          </div>
        </div>
      </main>

      {/* Go to Top Button */}
      <div
        className="topButton"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        {loc("GoTop")}
      </div>
    </>
  );
}
