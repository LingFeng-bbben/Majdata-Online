"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { apiroot3 } from "../apiroot";
import "react-toastify/dist/ReactToastify.css";
import { loc, setLanguage } from "../utils";
import { PageLayout } from "../widgets";
import useSWR from "swr";

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

  const navigationItems = [{ href: "/", label: loc("Back") }];

  return (
    <PageLayout
      title={"肝帝榜"}
      navigationItems={navigationItems}
      className="ranking-page"
    >
      <div className="ranking-intro">
        <p className="ranking-description">{"总达成率榜之谁是自制谱鉴赏老资历？"}</p>
      </div>

      <div className="ranking-sections">
        <RankingSection title={loc("Play")} subtitle={loc("PlayCountHint")} />
      </div>
    </PageLayout>
  );
}

const fetcher = (url) =>
  fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
    res.json()
  );

function RankingSection() {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/stats/score-sums?page=0&pageSize=100",
    fetcher,
    { refreshInterval: 30000 }
  );
  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>failed to load</div>;
  }
  const objlist = data.map((p) =>
    p.length !== 0 ? ScoreCard(p.username, p.dxAccSum, data[0].dxAccSum) : <></>
  );
  return (
    <div className="song-score-list">
      <div className="theList">{objlist}</div>
    </div>
  );
}

function ScoreCard(username, scoresum, maxscore) {
  return (
    <div key={username} style={{ width: "100%" }}>
      <div className={"score-card modern-score-card"}>
        <div className="score-player-info">
          <a href={"/space?id=" + username} className="player-link">
            <img
              className="player-avatar"
              src={apiroot3 + "/account/Icon?username=" + username}
              alt={username}
            />
            <div className="player-details">
              <span className="player-username">{username}</span>
            </div>
          </a>
        </div>
        <div className="score-results">
          <div className={`score-accuracy`}>{scoresum.toFixed(4)}%</div>
        </div>
        <div
          style={{
            width: (scoresum/maxscore * 100).toString()+"%",
            height: "2px",
            position: "fixed",
            backgroundColor: "rgba(255,255,255,50)",
            left: "0",
            bottom: "10px"
          }}
        ></div>
      </div>
    </div>
  );
}
