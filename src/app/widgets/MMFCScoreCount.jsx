"use client";
import React from "react";
import { apiroot3 } from "../apiroot";
import useSWR from "swr";
import { loc } from "../utils";
import mmfcParticipants from "../utils/mmfc-participants.json";

export default function MMFCScoreCount() {
  // 从JSON文件获取参与者列表
  const participantsList = mmfcParticipants.participants || [];

  // 获取mmfc_bot用户的分数总和数据
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/stats/score-sums?uploader=" + encodeURIComponent("mmfc_bot") + "&page=0&pageSize=1000",
    fetcher,
    { refreshInterval: 30000 }
  );

  if (error) {
    return <div className="error-message">{loc("FailedToLoad")}</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div className="error-message">{loc("FailedToLoad")}</div>;
  }

  // 过滤出指定的参与者
  const filteredData = data.filter(p => 
    participantsList.includes(p.username)
  );

  // 按分数降序排序
  const sortedData = filteredData.sort((a, b) => b.dxAccSum - a.dxAccSum);

  // 如果没有数据
  if (sortedData.length === 0) {
    return (
      <div className="no-data-message">
        <p>{loc("NoMMFCRankingData")}</p>
      </div>
    );
  }

  // 获取最高分用于计算进度条
  const maxScore = sortedData[0]?.dxAccSum || 0;

  const objlist = sortedData.map((p, index) => 
    MMFCScoreCard(p.username, p.dxAccSum, maxScore, index + 1)
  );

  return (
    <div className="song-score-list">
      <div className="theList">{objlist}</div>
    </div>
  );
}

function MMFCScoreCard(username, scoresum, maxscore, rank) {
  // 根据排名添加特殊样式
  let rankClass = "rank-number";
  if (rank === 1) rankClass += " rank-first";
  else if (rank === 2) rankClass += " rank-second";
  else if (rank === 3) rankClass += " rank-third";

  // 根据排名添加光效
  let cardClass = "score-card modern-score-card mmfc-score-card";
  if (rank === 1) {
    cardClass += " score-card-ap"; // 第一名用AP金光
  } else if (rank === 2 || rank === 3) {
    cardClass += " score-card-fc"; // 第二、第三名用FC蓝光
  }

  return (
    <div key={username} style={{ width: "100%" }}>
      <div className={cardClass}>
        {/* 排名显示 */}
        <div className="score-rank-display">
          <span className={rankClass}>
            #{rank}
          </span>
        </div>

        {/* 玩家信息 */}
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

        {/* 分数显示 */}
        <div className="score-results">
          <div className={`score-accuracy`}>{scoresum.toFixed(4)}%</div>
        </div>
      </div>
    </div>
  );
}

const fetcher = (url) =>
  fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
    res.json()
  );

