"use client";
import React from "react";
import { apiroot3 } from "../apiroot";
import useSWR from "swr";
import { loc } from "../utils";

export default function ScoreCount({uploader, page, pageSize}) {
  const { data, error, isLoading } = useSWR(
    apiroot3 +  "/stats/score-sums?uploader="+encodeURIComponent(uploader)+"&page="+page+"&pageSize="+pageSize,
    fetcher,
    { refreshInterval: 30000 }
  );
  if (error) {
    return <div>{loc("FailedToLoad")}</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>{loc("FailedToLoad")}</div>;
  }
  const objlist = data.map((p) =>
    p.length !== 0 ? PlayCountScoreCard(p.username, p.dxAccSum, data[0].dxAccSum) : <></>
  );
  return (
    <div className="song-score-list">
      <div className="theList">{objlist}</div>
    </div>
  );
}

function PlayCountScoreCard(username, scoresum, maxscore) {
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

const fetcher = (url) =>
  fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
    res.json()
  );