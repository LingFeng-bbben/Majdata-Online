import React, { memo, useMemo } from "react";
import { loc } from "../utils";

const EventBanner = memo(({ event }) => {
  if (!event) return null;

  // 使用useMemo缓存计算结果，避免重复计算
  const { categoryTranslation, timeAgo } = useMemo(() => {
    // 获取category的翻译
    const categoryMap = {
      "高校赛事": loc("EventCategoryUniversity"),
      "大型赛事": loc("EventCategoryMajor"),
      "私立企划": loc("EventCategoryPrivateProject"),
      "私立赛事": loc("EventCategoryPrivateContest")
    };
    const categoryResult = categoryMap[event.category] || event.category;

    // 计算创建时间的"xx天前"格式
    const getTimeAgo = (dateString) => {
      const eventDate = new Date(dateString);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - eventDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 1) {
        return "今天";
      } else if (diffDays === 1) {
        return "1天前";
      } else if (diffDays < 30) {
        return `${diffDays}天前`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months}个月前`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years}年前`;
      }
    };

    const createTimeAgo = getTimeAgo(event.createDate);

    return {
      categoryTranslation: categoryResult,
      timeAgo: createTimeAgo
    };
  }, [event.category, event.createDate]);

  return (
    <div className="event-banner">
      <div 
        className="event-banner-container"
        style={{
          backgroundImage: `url(${event.src})`,
        }}
      >
        {/* 毛玻璃遮罩层 */}
        <div className="event-banner-overlay">
          <div className="event-banner-content">
            <div className="event-banner-info">
            <div className="event-banner-header">
              <h2 className="event-banner-title">{event.title}</h2>
            </div>
            <p className="event-banner-description">{event.description}</p>
            <div className="event-banner-meta-bottom">
              <span className="event-banner-category">
                {categoryTranslation}
              </span>
              <span className="event-banner-date">
                • {timeAgo}
              </span>
            </div>
            </div>
          </div>
          <div className="event-banner-close">
            <span className="event-banner-hint">{loc("EventBannerSearching")}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// 设置displayName用于调试
EventBanner.displayName = 'EventBanner';

export default EventBanner;
