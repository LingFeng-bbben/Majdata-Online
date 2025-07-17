"use client";
import React, {useEffect, useState} from "react";
import "react-photo-view/dist/react-photo-view.css";
import {apiroot3} from "../apiroot";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSWR from "swr";
import {useSearchParams} from "next/navigation";

import "github-markdown-css/github-markdown-dark.css";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import {loc, setLanguage} from "../utils";
import {
  RecentPlayed,
  MajdataLogo,
  UserInfo,
  Logout,
  SongList
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
      <SongList url= {apiroot3 + "/maichart/list?search=" + encodeURIComponent("uploader:" + username)}/>

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
      <p>{loc("JoinAt")} {(new Date(data.joinDate)).toLocaleString()}</p>
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