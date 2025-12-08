"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import "react-toastify/dist/ReactToastify.css";
import { loc, setLanguage } from "../utils";
import { PageLayout } from "../widgets";
import EventBanner from "../widgets/EventBanner";
import MMFCScoreCount from "../widgets/MMFCScoreCount";

export default function Page() {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      }
    );
  }, []);

  if (!ready) return <div className="loading"></div>;

  // MMFC活动信息
  const mmfcEvent = {
    id: "mmfc12",
    href: "/mmfc-ranking",
    src: "/events/MMFC12.jpg",
    alt: loc("MMFCRankingTitle"),
    title: loc("MMFCRankingTitle"),
    category: loc("EventCategoryMajor"),
    createDate: new Date().toISOString().split('T')[0],
    description: loc("MMFCRankingDescription")
  };

  return (
    <PageLayout
      showBackToHome={true}
      className="mmfc-ranking-page"
    >
      {/* MMFC活动横幅 */}
      <EventBanner event={mmfcEvent} />

      {/* 打榜排名 */}
      <div className="mmfc-ranking-content">
        <div className="mmfc-ranking-section">
          {/* 显示指定用户对mmfc_bot谱面的游玩总分排名 */}
          <MMFCScoreCount />
        </div>
      </div>
    </PageLayout>
  );
}

