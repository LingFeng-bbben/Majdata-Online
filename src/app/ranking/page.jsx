"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { apiroot3 } from "../apiroot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLanguage, loc } from "../utils";
import { SongList, PageLayout } from "../widgets";

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
  
  const navigationItems = [
    { href: "/", label: loc("Back") }
  ];

  return (
    <PageLayout 
      title={loc("RecommendedCharts")}
      navigationItems={navigationItems}
      className="ranking-page"
    >
      <div className="ranking-intro">
        <p className="ranking-description">{loc("RecommendedChartsHint")}</p>
      </div>
      
      <div className="ranking-sections">
        <RankingSection 
          title={loc("Play")}
          subtitle={loc("PlayCountHint")}
          sortType="scorep"
        />
        
        <RankingSection 
          title={loc("Like")}
          subtitle={loc("LikeCountHint")}
          sortType="likep"
        />
        
        <RankingSection 
          title={loc("Comment")}
          subtitle={loc("CommentCountHint")}
          sortType="commp"
        />
        
        <RankingSection 
          title={loc("Download")}
          subtitle={loc("DownloadCountHint")}
          sortType="playp"
        />
      </div>
    </PageLayout>
  );
}

function RankingSection({ title, subtitle, sortType }) {
  return (
    <div className="ranking-section">
      <div className="ranking-section-header">
        <h2 className="ranking-section-title">{title}</h2>
        <p className="ranking-section-subtitle">{subtitle}</p>
      </div>
      <SongList
        url={
          apiroot3 +
          "/maichart/list?&isRanking=true&sort=" +
          encodeURIComponent(sortType)
        }
        isRanking={true}
      />
    </div>
  );
}
