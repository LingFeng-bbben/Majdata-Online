"use client";
import React from "react";
import useSWR from "swr";
import { apiroot3 } from "../apiroot";

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

export default function InteractCount({ songid }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/" + songid + "/interactsum",
    fetcher
  );
  if (error) return <div></div>;
  if (isLoading) {
    return <div>..</div>;
  }
  if (data === "" || data === undefined) return <div>?</div>;
  const commentcount = data.Comments;
  const likecount = data.Likes;
  var playcount = data.Plays;
  if(playcount >1000){
    playcount = (playcount/1000).toFixed(1) + "k";
  }
  return (
    <div>
      <div className="commentBox downloadButtonBox commentNumber">
        {playcount}
      </div>
      <div className="commentBox downloadButtonBox">
        <svg
          className="commentIco"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          style={
            likecount >= 5
              ? { background: "gold", borderRadius: "5px", fill: "black" }
              : { background: "transparent" }
          }
        >
          <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
        </svg>
      </div>
      <div className="commentBox downloadButtonBox commentNumber">
        {likecount}
      </div>
      <div className="commentBox downloadButtonBox">
        <svg
          className="commentIco"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
          style={
            commentcount >= 5
              ? { background: "gold", borderRadius: "5px", fill: "black" }
              : { background: "transparent" }
          }
        >
          <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
        </svg>
      </div>
      <div className="commentBox downloadButtonBox commentNumber">
        {commentcount}
      </div>
      
    </div>
  );
}
