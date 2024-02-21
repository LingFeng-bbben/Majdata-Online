"use client";
import React from "react";
import "../eventstyle.css";
import EventLogo from "../eventcompos";
import Link from "next/link";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function Page() {
  return (
    <>
      <div className="seprate"></div>
      <EventLogo />
      <div className="links">
        <div className="linkContent">
          <Link href="./">返回</Link>
        </div>
        {/* <div className='linkContent'><a href='./contest'>MMFC 6th</a></div> */}
      </div>
      <div className="eventContent">
        <p>
          参赛者在1月27日到2月2O日之间，在
          <Link href={"/user"} style={{ fontWeight: "bolder", color: "pink" }}>
            上传页
          </Link>
          发布谱面
        </p>
        <p>截止3月1日，赞数最多的谱获胜</p>
        <p>一等奖：第一位；二等奖：前五；三等奖：前十</p>
        <p style={{ fontSize: "30px" }}>!!鼓励新人参赛，鼓励正常谱面!!</p>

        <p style={{ color: "pinl", fontSize: "50px" }}>注意！</p>
        <p>
          1. 互动有效的前提：在majnet上至少有一张谱面，且该账号并非为刷票注册。
        </p>
        <p>2. 一个账号可以上传多张谱面参与活动，上限5张。</p>
        <p>
          3. 若按赞数排序有多个第一名/第二名/第三名...，最先上传的优先领奖。
        </p>
        <p>4. 一人仅能领取一份奖品。</p>
        <p>
          5. 本赛不分娱乐/正赛，就算是宴谱也可投稿。唯一评判标准为大众赞数。
        </p>
        <p>6. 本赛不设专职评委。</p>
        <p>
          7.
          参赛选手每上传一张谱面，就应至少给除自己以外的三张参赛谱面点赞，否则视为非参赛谱面。例：上传2张谱，应给6张自己之外的参赛谱点赞。若参赛选手点赞数量不足，仅取先上传的满足点赞数量的前几个谱面。
        </p>

        <p>8. 谱面应符合majnet的上传要求。</p>
        <p>9. 确保你留在网站上的email有效，不然无法颁发奖品。</p>
        <PhotoProvider
          bannerVisible={false}
          loadingElement={<div className="loading"></div>}
        >
          <PhotoView
            src={
              "https://img.alicdn.com/imgextra/i4/2215647782183/O1CN01hEw6Yc1RzrS6pHF6R_!!2215647782183.jpg"
            }
          >
            <img
              className="eventPrize"
              loading="lazy"
              src={
                "https://img.alicdn.com/imgextra/i4/2215647782183/O1CN01hEw6Yc1RzrS6pHF6R_!!2215647782183.jpg"
              }
              alt=""
            />
          </PhotoView>
          <p>一等奖： 子弟薯片5袋/35元（一份）</p>
          <PhotoView
            src={
              "https://img.alicdn.com/imgextra/i2/2212313796950/O1CN015YV8Wu21D9LtMTsWV_!!2212313796950.jpg"
            }
          >
            <img
              className="eventPrize"
              loading="lazy"
              src={
                "https://img.alicdn.com/imgextra/i2/2212313796950/O1CN015YV8Wu21D9LtMTsWV_!!2212313796950.jpg"
              }
              alt=""
            />
          </PhotoView>
          <p>二等奖： 佳达拖肥混合口味35g*20包/12元（四份）</p>
          <PhotoView
            src={
              "https://img.alicdn.com/imgextra/i3/2215144432710/O1CN018Oycgw1VtEBqZ2BPV_!!2215144432710.jpg"
            }
          >
            <img
              className="eventPrize"
              loading="lazy"
              src={
                "https://img.alicdn.com/imgextra/i3/2215144432710/O1CN018Oycgw1VtEBqZ2BPV_!!2215144432710.jpg"
              }
              alt=""
            />
          </PhotoView>
          <p>三等奖： 旺旺碎冰冰78ml*10/9元 （五份）</p>
          <PhotoView
            src={
              "https://img.alicdn.com/imgextra/i3/2530732442/O1CN01G2PE591TuTsVcNbWF_!!2530732442.jpg"
            }
          >
            <img
              className="eventPrize"
              loading="lazy"
              src={
                "https://img.alicdn.com/imgextra/i3/2530732442/O1CN01G2PE591TuTsVcNbWF_!!2530732442.jpg"
              }
              alt=""
            />
          </PhotoView>
          <p>
            最多评论奖：小猪抱枕粉色趴趴猪公仔超软萌毛绒玩具/15.9元 （一份）
          </p>
        </PhotoProvider>
      </div>
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}
