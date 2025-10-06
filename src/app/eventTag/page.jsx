"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { setLanguage, loc } from "../utils";
import { PageLayout, SongList } from "../widgets";
import EventBanner from "../widgets/EventBanner";
import { apiroot3 } from "../apiroot";
import { getEventBySearchKeyword } from "../utils/eventsData";

export default function EventTagPage() {
  const [ready, setReady] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      }
    );
  }, []);

  useEffect(() => {
    // 获取URL中的id参数
    const eventId = searchParams.get("id");
    if (eventId) {
      // 构造搜索关键词，格式为 tag:eventId（这是传给后端API的参数）
      const keyword = `tag:${eventId}`;
      setSearchKeyword(keyword);

      // 查找对应的活动（通过eventTag页面的URL格式）
      const matchedEvent = getEventBySearchKeyword(eventId);
      setCurrentEvent(matchedEvent);
    }
  }, [searchParams]);

  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout showBackToHome={true} className="event-tag-page">
      {/* 活动横幅 */}
      {currentEvent && <EventBanner event={currentEvent} />}

      {/* 活动相关谱面列表 */}
      {searchKeyword && (
        <div className="event-tag-content">
          <div className="event-tag-section">
            <h2 className="event-tag-section-title">{loc("RelatedCharts")}</h2>

            <div className="hr-solid"></div>
            <SongList
              url={
                apiroot3 +
                "/maichart/list?sort=" +
                "&page=0" +
                "&search=" +
                encodeURIComponent(searchKeyword)
              }
              page={0}
              setMax={() => {}} // 这个页面展示所有相关谱面
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
