"use client";
import React, {useEffect, useState} from "react";
import "react-photo-view/dist/react-photo-view.css";
import {apiroot3} from "../apiroot";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LazyLoad from "react-lazy-load";
import useSWR from "swr";
import {useSearchParams} from "next/navigation";

import "github-markdown-css/github-markdown-dark.css";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import {loc, setLanguage} from "../utils";
import {
  RecentPlayed,
  CoverPic,
  MajdataLogo,
  InteractCount,
  Levels,
  UserInfo,
  Logout
} from "../widgets";

export default function Page() {
  const searchParams = useSearchParams();
  const username = searchParams.get("id");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language")||navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return <div className="loading"></div>;
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
      <MajdataLogo/>
      <div className="links">
        <div className="linkContent">
          <a href="/">{loc("HomePage")}</a>
        </div>
        <UserInfo/>
        <Logout></Logout>
      </div>

      <Introduction username={username}/>

      <h2>{loc("RecentlyPlayedCharts")}</h2>
      <div className="hr-solid"></div>
      <RecentPlayed username={username}/>

      <h2>{loc("UploadedCharts")}</h2>
      <div className="hr-solid"></div>
      <SongList search={"uploader:" + username}/>

      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt=""/>
    </>
  );
}

function Introduction({username}) {
  const {data, error, isLoading} = useSWR(
    apiroot3 + "/account/intro?username=" + encodeURIComponent(username),
    fetcher
  );
  if (error) {
    return <div className="notReady">{loc("ServerError")}</div>;
  }
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
      <p>{loc("JoinAt")} {data.joinDate}</p>
      <article className="markdown-body">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            ol(props) {
              const {...rest} = props;
              return <ol type="1" {...rest} />;
            },
            ul(props) {
              const {...rest} = props;
              return <ol style={{listStyleType: "disc"}} {...rest} />;
            },
            img(props) {
              const {...rest} = props;
              return <img style={{margin: "auto"}} {...rest} />;
            },
          }}
        >
          {data.introduction}
        </Markdown>
      </article>
    </div>
  );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

function SongList({search}) {
  const {data, error, isLoading} = useSWR(
    apiroot3 + "/maichart/list?search=" + encodeURIComponent(search),
    fetcher
  );
  if (error) {
    return <div className="notReady">{loc("ServerError")}</div>;
  }
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
          <CoverPic id={o.id}/>
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
            <Levels levels={o.levels} songid={o.id} isPlayer={false}/>
            <br/>
            <div className="commentBox downloadButtonBox">
              <svg
                className="downloadButton"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
              </svg>
            </div>
            <InteractCount songid={o.id}/>
            <br/>
          </div>
        </div>
      </LazyLoad>
    </div>
  ));
  return <div className="songCardContainer">{list}</div>;
}
