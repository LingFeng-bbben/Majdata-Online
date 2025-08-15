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
  UserInfo,
  Logout,
  SongList,
  PageLayout
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
  
  const navigationItems = [
    { href: "/", label: loc("HomePage") }
  ];

  return (
    <PageLayout 
      title={`${username} ${loc("PersonalSpace")}`}
      navigationItems={navigationItems}
      className="user-space-page"
      showNavigation={false}
    >

      {/* User Introduction */}
      <section className="user-intro-section">
        <Introduction username={username} />
      </section>

      {/* Recent Activity */}
      <section className="activity-section">
        <h2 className="section-title">{loc("RecentlyPlayedCharts")}</h2>
        <div className="hr-solid"></div>
        <RecentPlayed username={username} />
      </section>

      {/* Uploaded Charts */}
      <section className="charts-section">
        <h2 className="section-title">{loc("UploadedCharts")}</h2>
        <div className="hr-solid"></div>
        <SongList url={apiroot3 + "/maichart/list?search=" + encodeURIComponent("uploader:" + username)} />
      </section>
    </PageLayout>
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
    <div className="user-profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            className="avatar-image"
            src={apiroot3 + "/account/Icon?username=" + username}
            alt={username}
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-username">{data.username}</h1>
          <p className="profile-join-date">
            {loc("JoinAt")} {(new Date(data.joinDate)).toLocaleString()}
          </p>
        </div>
      </div>
      
      {data.introduction && (
        <div className="profile-introduction">
          <h3 className="intro-title">{loc("SelfIntro")}</h3>
          <article className="markdown-body intro-content">
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
      )}
    </div>
  );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());