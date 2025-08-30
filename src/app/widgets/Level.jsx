"use client";

import React from "react";
import { MakeLevelClickCallback } from "../utils";

export default function Level({ level, difficulty, songid, isPlayer }) {
  const levelClickCallback = MakeLevelClickCallback(songid, isPlayer);
  return (
    <div
      className="songLevel"
      id={`lv${level}`}
      style={{ display: "unset" }}
      onClick={levelClickCallback}
    >
      {difficulty}
    </div>
  );
}
