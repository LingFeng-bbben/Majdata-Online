"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import { apiroot3 } from "../apiroot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LazyLoad from "react-lazy-load";
import useSWR from "swr";
import {CoverPic, InteractCount, Levels, MajdataLogo} from "../widgets";

export default function Page() {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent">
          <a href="../">返回</a>
        </div>
      </div>
      <div className="theList">
        <h1>~推荐乐曲排行榜~</h1>
      </div>
      <div className="theList">
        这里会选出七天内最有人气的谱面哟！
      </div>
      <div className="theList">
        <h2>~游玩榜~</h2>
      </div>
      <div className="theList">
        <SongList search="scorep" />
      </div>
      <div className="theList">
        <h2>~点赞榜~</h2>
      </div>
      <div className="theList">
        <SongList search="likep" />
      </div>
      <div className="theList">
        <h2>~评论榜~</h2>
      </div>
      <div className="theList">
        <SongList search="commp" />
      </div>
      <div className="theList">
        <h2>~下载榜~</h2>
      </div>
      <div className="theList">
        <SongList search="playp" />
      </div>

      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

function SongList({ search }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 +
      "/maichart/list?&isRanking=true&sort=" +
      encodeURIComponent(search),
    fetcher
  );
  if (error) return <div className="notReady">已闭店</div>;
  if (isLoading) {
    return (
      <>
        <div className="loading"></div>
      </>
    );
  }
  const list = data.map((o, index) => (
    <div key={o.id} id={o.id}>
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          <CoverPic id={o.id} display={"No." + (index + 1)} />
          <div className="songInfo">
            <div className="songTitle" id={o.id}>
              <a href={"/song?id=" + o.id}>{o.title}</a>
            </div>

            <div className="songArtist">
              <a href={"/song?id=" + o.id}>
                {o.artist == "" || o.artist == null ? "-" : o.artist}
              </a>
            </div>

            <div className="songDesigner">
                <a href={"/space?id=" + o.uploader}>
                  <img
                    className="smallIcon"
                    src={apiroot3 + "/account/Icon?username=" + o.uploader}
                  />
                  {o.uploader + "@" + o.designer}
                </a>
              </div>
            <Levels levels={o.levels} songid={o.id} isPlayer={false} />
            <br />
            <div className="commentBox downloadButtonBox">
              <svg
                className="downloadButton"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </svg>
            </div>
            <InteractCount songid={o.id} />
            <br />
          </div>
        </div>
      </LazyLoad>
    </div>
  ));
  return list;
}
