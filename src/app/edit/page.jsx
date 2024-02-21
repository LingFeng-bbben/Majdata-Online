"use client";
import React from "react";
import Link from "next/link";


export default function Page() {
  return (
    <>
      <div className="seprate"></div>
      <h1>
        <img className="xxlb" src="./salt.webp"></img>
        MajdataEdit
      </h1>
      <div className="eventContent">
        
        <p>Majdata is a OpenSource Simai Note designer.</p>
        <p>Majdata是使用Simai格式的开源maimai自制谱编辑器。</p>
        <p>(Windows Only..)</p>
        <div className="theList">
          <a href="https://github.com/LingFeng-bbben/MajdataView">
            <img src="https://badgen.net/github/tag/LingFeng-bbben/MajdataView"></img>
          </a>
          <img src="https://img.shields.io/static/v1?label=State-of-the-art&message=Shitcode&color=7B5804"></img>
        </div>
        <a href="https://github.com/LingFeng-bbben/MajdataView/releases">
          <div className="fancyDownloadButton">下载</div>
        </a>
        <p>一些教程:</p>
        <a href="https://github.com/LingFeng-bbben/MajdataView/wiki/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8">
          <div className="fancyDownloadButton">快速入门</div>
        </a>
        <a href="https://github.com/LingFeng-bbben/MajdataView/wiki/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8">
          <div className="fancyDownloadButton">怎样写谱</div>
        </a>
        <div className="theList">
          <div className="linkContent">
            <a href="https://w.atwiki.jp/simai/pages/1002.html">日本語版</a>
          </div>
          <div className="linkContent">
            <a href="https://rentry.org/maiguide">English Guide</a>
          </div>
        </div>
        <iframe
          src="//player.bilibili.com/player.html?aid=678023171&bvid=BV15m4y1D7h1&cid=482366924&p=1&autoplay=0"
          border="0"
          allowfullscreen="true"
          className="biliPlayer"
        ></iframe>
        <p>
          <a href="https://space.bilibili.com/397702/channel/collectiondetail?sid=391415&ctype=0">
            小小蓝白的谱面创作教室
          </a>
        </p>
        <iframe
          src="//player.bilibili.com/player.html?aid=961503110&bvid=BV1nH4y1U7Cc&cid=1281833478&p=1&autoplay=0"
          
          className="biliPlayer"
        >
          {" "}
        </iframe>
        <p>需要帮助？</p>
        <a href="https://github.com/LingFeng-bbben/MajdataView/wiki/Q&A">
          <div className="fancyDownloadButton">常见问题</div>
        </a>
        <p>Join Discord!!</p>
        <div className="theList">
          <a href="https://discord.gg/AcWgZN7j6K">
            <img src="https://badgen.net/discord/online-members/AcWgZN7j6K"></img>
          </a>
        </div>
        <div className="links">
          <div className="linkContent">
            <Link href="./">谱面分享站</Link>
          </div>
          <div className="linkContent">
            <Link href="./dydy">DD版</Link>
          </div>
        </div>
      </div>
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}
