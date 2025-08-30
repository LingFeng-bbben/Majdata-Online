"use client";
import React from "react";
import { MakeLevelClickCallback } from "../utils";
import { renderLevel } from "../utils";

export default function SongDifficultyLevels({ levels, songid, isPlayer }) {
  // 处理空值
  const processedLevels = levels.map((level) => {
    if (level == null || level == "") {
      return "-";
    }
    return level;
  });

  const levelClickCallback = MakeLevelClickCallback(songid, isPlayer);

  // 难度名称映射 (对应getLevelName函数)
  const levelNames = [
    "Easy",
    "Basic",
    "Advanced",
    "Expert",
    "Master",
    "Re:Master",
    "UTAGE",
  ];

  // 难度颜色类名映射
  const levelColorClasses = [
    "level-easy", // lv0 - Easy
    "level-basic", // lv1 - Basic
    "level-advanced", // lv2 - Advanced
    "level-expert", // lv3 - Expert
    "level-master", // lv4 - Master
    "level-remaster", // lv5 - Re:Master
    "level-utage", // lv6 - UTAGE
  ];

  return (
    <div className="song-levels-container">
      {processedLevels.map((level, index) => {
        if (level === "-") return null;

        return (
          <div
            key={index}
            className={`song-level-chip ${levelColorClasses[index]} ${
              isPlayer ? "clickable" : ""
            }`}
            id={`lv${index}`}
            onClick={levelClickCallback}
            title={`${levelNames[index]} ${level}`}
          >
            <div className="level-name">{levelNames[index]}</div>
            <div className="level-value">{renderLevel(level)}</div>
          </div>
        );
      })}
    </div>
  );
}
