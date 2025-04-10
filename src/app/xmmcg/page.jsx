"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import Levels from "../levels";
import { apiroot3 } from "../apiroot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TheHeader from "../header";
import LazyLoad from "react-lazy-load";
import CoverPic from "../cover";
import useSWR from "swr";

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
      <TheHeader toast={toast} />
      <div className="links">
        <div className="linkContent">
          <a href="../">返回</a>
        </div>
      </div>
      <div className="theList">
        <img width="400px" src="/xmmcg/title.png" alt="" />
      </div>
      <div className="theList">
        <SongList search="TeamXmmcg" />
      </div>
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

function SongList({ search }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/list?&page=0&search=" + encodeURIComponent(search),
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
  const list = data.map((o) => (
    <div key={o.id} id={o.id}>
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          <CoverPic id={o.id} />
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
              <a href={"/song?id=" + o.Id}>{o.uploader + "@" + o.designer}</a>
            </div>
            <Levels levels={o.levels} songid={o.id} isPlayer={false} />
            <br />
          </div>
        </div>
      </LazyLoad>
    </div>
  ));
  return list;
}
