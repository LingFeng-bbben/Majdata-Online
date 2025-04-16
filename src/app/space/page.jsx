"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import Levels from "../levels";
import InteractCount from "../interact";
import { apiroot3 } from "../apiroot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TheHeader from "../header";
import LazyLoad from "react-lazy-load";
import CoverPic from "../cover";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";

import "github-markdown-css/github-markdown-dark.css";
import Markdown from "react-markdown";
import Level from "../level";

export default function Page() {
  const searchParams = useSearchParams();
  const username = searchParams.get("id");
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

      <Introduction username={username} />
        <p>上传的谱面</p>
        <SongList search={"uploader:" + username} />
        <p>Recent10</p>
        <Recent10 />
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

function Introduction({ username }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/account/intro?username=" + encodeURIComponent(username),
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
  return (
    <div>
      <div className="theList">
        <img
          className="bigIcon"
          src={apiroot3 + "/account/Icon?username=" + username}
         alt={username}/>
        <h1>{data.username}</h1>
      </div>
      <p>注册于{data.joinDate}</p>
      <article className="markdown-body">
        <Markdown
          components={{
            ol(props) {
              const { ...rest } = props;
              return <ol type="1" {...rest} />;
            },
            ul(props) {
              const { ...rest } = props;
              return <ol style={{listStyleType: "disc"}} {...rest} />;
            },
            img(props) {
              const { ...rest } = props;
              return <img style={{margin:"auto"}} {...rest} />;
            },
          }}
        >
          {data.introduction}
        </Markdown>
      </article>
    </div>
  );
}

function Recent10() {
    const { data, error, isLoading } = useSWR(
        apiroot3 + "/account/Recent?username=bbben",
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

    console.log(data);

    const list = data.map((o) => (
        <div key={o.chartId} id={o.chartId} className="songCardWrapper">
            <LazyLoad height={165} width={352} offset={300}>
                <div className="songCard">
                    <CoverPic id={o.chartId} />
                    <div className="songInfo">
                        <div className="songTitle" id={o.chartId}>
                            <Level
                                level={o.level}
                                difficulty={o.difficulty}
                                songid={o.chartId}
                                isPlayer={false}
                            />
                            <a href={"/song?id=" + o.chartId}>{o.title}</a>
                        </div>

                        <div className="songArtist">
                            <a href={"/song?id=" + o.chartId}>
                                {o.artist == "" || o.artist == null ? "-" : o.artist}
                            </a>
                        </div>

                        <div className="songDesigner">
                            <a href={"/space?id=" + o.uploader}>
                                <img
                                    className="smallIcon"
                                    src={apiroot3 + "/account/Icon?username=" + o.uploader}
                                    alt={o.uploader}
                                />
                                {o.designer}
                            </a>
                        </div>
                        <div className="songAcc">{o.acc}</div>
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
                        <InteractCount songid={o.chartId} />
                        <br />
                    </div>
                </div>
            </LazyLoad>
        </div>
    ));

    return <div className="songCardContainer">{list}</div>;
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
    <div key={o.id} id={o.id} className="songCardWrapper">
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
              <a href={"/space?id=" + o.uploader}>
                <img
                  className="smallIcon"
                  src={apiroot3 + "/account/Icon?username=" + o.uploader}
                 alt={o.uploader}/>
                {o.designer}
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
    return <div className="songCardContainer">{list}</div>;
}
