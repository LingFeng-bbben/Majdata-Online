"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {setLanguage, loc} from "../utils";
import {PageLayout} from "../widgets";

export default function Page() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language")||navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return <div className="loading"></div>;
  
  const navigationItems = [
    { href: "/", label: loc("HomePage") }
  ];

  return (
    <PageLayout 
      title="MajdataEdit"
      navigationItems={navigationItems}
      className="edit-page"
    >
      <div className="edit-content">
        {/* 产品介绍部分 */}
        <section className="edit-intro-section">
          <div className="edit-hero">
            <div className="edit-logo">
              <img className="edit-logo-image" src="./salt.webp" alt="MajdataEdit" />
              <h1 className="edit-title">MajdataEdit</h1>
            </div>
            <p className="edit-description">{loc("MajdataPunchline")}</p>
            <p className="edit-platform">Windows Only</p>
            
            <div className="edit-badges">
              <a href="https://github.com/LingFeng-bbben/MajdataView" className="badge-link">
                <img src="https://badgen.net/github/tag/LingFeng-bbben/MajdataView" alt="GitHub Tag" />
              </a>
              <img src="https://img.shields.io/static/v1?label=State-of-the-art&message=Shitcode&color=7B5804" alt="Quality Badge" />
            </div>

            <a href="https://github.com/LingFeng-bbben/MajdataView/releases" className="primary-download-button">
              <div className="download-button-content">
                {loc("Download")}
              </div>
            </a>
          </div>
        </section>

        {/* 教程部分 */}
        <section className="edit-tutorials-section">
          <h2 className="section-title">{loc("Tutorials")}</h2>
          <div className="tutorial-grid">
            <a href="https://github.com/LingFeng-bbben/MajdataView/wiki/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8" className="tutorial-card">
              <div className="tutorial-content">
                <h3 className="tutorial-title">{loc("QuickStart")}</h3>
                <p className="tutorial-description">{loc("QuickStartDesc")}</p>
              </div>
            </a>
            
            <a href="https://github.com/LingFeng-bbben/MajdataView/wiki/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8" className="tutorial-card">
              <div className="tutorial-content">
                <h3 className="tutorial-title">{loc("HowToChart")}</h3>
                <p className="tutorial-description">{loc("HowToChartDesc")}</p>
              </div>
            </a>

            <a href="https://w.atwiki.jp/simai/pages/1002.html" className="tutorial-card">
              <div className="tutorial-content">
                <h3 className="tutorial-title">{loc("JapaneseVersion")}</h3>
                <p className="tutorial-description">{loc("JapaneseVersionDesc")}</p>
              </div>
            </a>

            <a href="https://rentry.org/maiguide" className="tutorial-card">
              <div className="tutorial-content">
                <h3 className="tutorial-title">English Guide</h3>
                <p className="tutorial-description">English tutorial and guide</p>
              </div>
            </a>
          </div>
        </section>

        {/* 视频教程部分 */}
        <section className="edit-videos-section">
          <h2 className="section-title">{loc("VideoTutorials")}</h2>
          <div className="video-grid">
            <div className="video-card">
              <iframe
                src="//player.bilibili.com/player.html?aid=678023171&bvid=BV15m4y1D7h1&cid=482366924&p=1&autoplay=0"
                className="video-player"
                allowFullScreen
              ></iframe>
              <div className="video-info">
                <h3 className="video-title">{loc("BasicTutorial")}</h3>
              </div>
            </div>
            
            <div className="video-card">
              <iframe
                src="//player.bilibili.com/player.html?aid=961503110&bvid=BV1nH4y1U7Cc&cid=1281833478&p=1&autoplay=0"
                className="video-player"
                allowFullScreen
              ></iframe>
              <div className="video-info">
                <h3 className="video-title">{loc("AdvancedTutorial")}</h3>
              </div>
            </div>
          </div>
          
          <div className="video-series">
            <p className="series-info">
              <a href="https://space.bilibili.com/397702/channel/collectiondetail?sid=391415&ctype=0" className="series-link">
{loc("CompleteSeries")}
              </a>
            </p>
          </div>
        </section>

        {/* 帮助与支持部分 */}
        <section className="edit-support-section">
          <h2 className="section-title">{loc("HelpAndSupport")}</h2>
          <div className="support-grid">
            <a href="https://github.com/LingFeng-bbben/MajdataView/wiki/Q&A" className="support-card">
              <div className="support-content">
                <h3 className="support-title">{loc("FAQ")}</h3>
                <p className="support-description">{loc("FAQDesc")}</p>
              </div>
            </a>

            <a href="https://discord.gg/AcWgZN7j6K" className="support-card discord-card">
              <div className="support-content">
                <h3 className="support-title">{loc("CommunitySupport")}</h3>
                <p className="support-description">{loc("CommunitySupportDesc")}</p>
                <img src="https://badgen.net/discord/online-members/AcWgZN7j6K" alt="Discord Members" className="discord-badge" />
              </div>
            </a>
          </div>
        </section>


      </div>
    </PageLayout>
  );
}
