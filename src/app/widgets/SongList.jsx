"use client";
import React from "react";
import useSWR from "swr";
import { loc } from "../utils";
import { CoverPic, InteractCount, Levels, TagManageWidget } from "../widgets";
import { downloadSong } from "../download";
import LazyLoad from "react-lazy-load";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { apiroot3 } from "../apiroot";
import { toast } from "react-toastify";

export default function SongList({ url, setMax, page, isRanking, isManage }) {
  const { data, error, isLoading } = useSWR(url, fetcher,{revalidateOnFocus: false});
  console.log(url);
  if (error) return <div className="notReady">{loc("ServerError")}</div>;
  if (isLoading) {
    return (
      <>
        <div className="loading"></div>
      </>
    );
  }
  const OnDownloadClick = (params) => async () => {
    await downloadSong({ id: params.id, title: params.title, toast: toast });
  };
  const SavePosition = ({ id, page }) => {
    if (page == null) return;
    localStorage.setItem("lastclickid", id);
    localStorage.setItem("lastclickpage", page);
  };
  if (data.length < 30) {
    if (page != null && setMax != null) setMax(page);
  }
  if (data == "" || data == undefined) {
    return <div className="notReady">空的</div>;
  }
  const list = data.map((o, index) => (
    <div
      key={o.id}
      id={o.id}
      onClick={() => SavePosition({ id: o.id, page: page })}
      className="songCardWrapper"
    >
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          {isRanking ? (
            <CoverPic id={o.id} display={"No." + (index + 1)} />
          ) : (
            <CoverPic id={o.id} />
          )}

          <div className="songInfo">
            <Tippy content={o.title}>
              <div className="songTitle" id={o.id}>
                <a href={"/song?id=" + o.id}>{o.title}</a>
              </div>
            </Tippy>
            <Tippy content={o.artist}>
              <div className="songArtist">
                <a href={"/song?id=" + o.id}>
                  {o.artist == "" || o.artist == null ? "-" : o.artist}
                </a>
              </div>
            </Tippy>
            <Tippy content={o.uploader + "@" + o.designer}>
              <div className="songDesigner">
                <a href={"/space?id=" + o.uploader}>
                  <img
                    className="smallIcon"
                    src={apiroot3 + "/account/Icon?username=" + o.uploader}
                  />
                  {o.uploader + "@" + o.designer}
                </a>
              </div>
            </Tippy>
            {isManage ? (
              <>
                {" "}
                <Delbutton songid={o.id} />
                <TagManageWidget
                  newClassName="songLevelMarginTop"
                  songid={o.id}
                />
              </>
            ) : (
              <Levels levels={o.levels} songid={o.id} isPlayer={false} />
            )}

            <br />
            <div
              className="songLevel downloadButtonBox"
              onClick={OnDownloadClick({ id: o.id, title: o.title })}
            >
              <svg
                className="downloadButton"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </svg>
            </div>
            <InteractCount songid={o.id} />
          </div>
        </div>
      </LazyLoad>
    </div>
  ));
  return <div className="songCardContainer">{list}</div>;
}

const fetcher = (url) =>
  fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
    res.json()
  );

function Delbutton({ songid }) {
  return (
    <div
      className="songLevel"
      onClick={async () => {
        let ret = confirm("真的要删除吗(不可恢复)\n(没有任何机会)");
        if (ret) {
          const response = await fetch(
            apiroot3 + "/maichart/delete?chartId=" + songid,
            {
              method: "POST",
              mode: "cors",
              credentials: "include",
            }
          );
          if (response.status !== 200) {
            alert(await response.text());
            return;
          }
          alert("删除成功");
          if (typeof window !== "undefined") {
            location.reload();
          }
        }
      }}
    >
      <svg
        className="downloadButton shareButton"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        width="24"
        viewBox="-30 -30 512 512"
      >
        <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
      </svg>
    </div>
  );
}
