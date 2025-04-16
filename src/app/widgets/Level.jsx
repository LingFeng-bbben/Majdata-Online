"use client";

import React from "react";
import {makeLevelClickCallback} from "../utils/scrollAndCallback";

export default function Level({level, difficulty, songid, isPlayer}){
    const levelClickCallback = makeLevelClickCallback(songid, isPlayer);
    return(
        <div
            className="songLevel"
            id={`lv${level}`}
            style={{ display:  "unset" }}
            onClick={levelClickCallback}
        >
            {difficulty}
        </div>
    )
}