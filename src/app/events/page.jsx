"use client";
import React, { useEffect, useState } from "react";
import { setLanguage } from "../utils";
import { PageLayout } from "../widgets";
import EventsFilter from "../widgets/EventsFilter";
import {
  getEventStatusClass,
  getEventStatusText,
  getEventsWithTimeAgo,
} from "../utils/eventsData";

export default function EventsPage() {
  const [ready, setReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("全部");

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      },
    );
  }, []);

  // 获取完整的活动列表（带智能时间计算），按创建日期排序
  const allEvents = getEventsWithTimeAgo()
    .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

  // 获取所有唯一的category类型
  const categories = [...new Set(allEvents.map(event => event.category))];

  // 根据选择的category筛选活动
  const filteredEvents = selectedCategory === "全部" 
    ? allEvents 
    : allEvents.filter(event => event.category === selectedCategory);

  // 处理category变化
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout
      title="活动列表"
      className="events-page"
    >
      <div className="events-page-container">
        <header className="events-page-header">
          <p className="events-page-subtitle">
            在此处浏览各种谱面竞赛例如MMFC、线下活动等...
          </p>
        </header>

        <EventsFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />

        <div className="events-grid-page">
          {filteredEvents.map((event, i) => (
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
                        <span className="event-category-large">
                          {event.category}
                        </span>
                        <span
                          className={`event-status-large ${
                            getEventStatusClass(event)
                          }`}
                        >
                          • {getEventStatusText(event)}
                        </span>
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
    </PageLayout>
  );
}
