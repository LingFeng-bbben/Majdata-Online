"use client";
import React from "react";
import {MakeLevelClickCallback} from "../utils";

export default function Levels({ levels, songid, isPlayer }) {
    for (let i = 0; i < levels.length; i++) {
      if (levels[i] == null || levels[i] == "") {
        levels[i] = "-";
      }
    }
    const levelClickCallback = MakeLevelClickCallback(songid, isPlayer);

    return (
        <div>
          <div
            className="songLevel"
            id="lv0"
            style={{ display: levels[0] == "-" ? "none" : "unset" }}
            onClick={levelClickCallback}
          >
            {levels[0]}
          </div>
          <div
            className="songLevel"
            id="lv1"
            style={{ display: levels[1] == "-" ? "none" : "unset" }}
            onClick={levelClickCallback}
          >
            {levels[1]}
          </div>
          <div
            className="songLevel"
            id="lv2"
            style={{ display: levels[2] == "-" ? "none" : "unset" }}
            onClick={levelClickCallback}
          >
            {levels[2]}
          </div>
          <div
            className="songLevel"
            id="lv3"
            style={{ display: levels[3] == "-" ? "none" : "unset" }}
            onClick={levelClickCallback}
          >
            {levels[3]}
          </div>
          <div
            className="songLevel"
            id="lv4"
            style={{ display: levels[4] == "-" ? "none" : "unset" }}
            onClick={levelClickCallback}
          >
            {levels[4]}
          </div>
          <div
            className="songLevel"
            id="lv5"
            style={{ display: levels[5] == "-" ? "none" : "unset" }}
            onClick={levelClickCallback}
          >
            {levels[5]}
          </div>
          <div
            className="songLevel"
            id="lv6"
            style={{ display: levels[6] == "-" ? "none" : "unset" }}
            onClick={levelClickCallback}
          >
            {levels[6]}
          </div>
        </div>
      );
  }