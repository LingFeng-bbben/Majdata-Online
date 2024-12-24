"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import UserInfo from "./userinfo";
import { apiroot3 } from "./apiroot";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./eventstyle.css";
import LazyLoad from "react-lazy-load";
import InteractCount from "./interact";
import TheHeader from "./header";
import CoverPic from "./cover";
import Levels from "./levels";
import { downloadSong } from "./download";

export default function Page() {
  const [source, target] = useSingleton();
  const [sortType, setSortType] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      const a = localStorage.getItem("sort")
      setIsLoaded(true)
      setSortType(a ? a : 0)
    }
  })
  function onSortClick() {
    localStorage.setItem("scrollPosition", 0);
    var type = parseInt(sortType);
    type += 1

    if (sortType >= 3) type = 0
    localStorage.setItem("sort", type);
    setSortType(type)
    console.log(type)
  }
  const words = ["", "likep", "commp", "playp"];
  const cwords = ["序", "赞", "评", "播"];
  return (
    <>
      <div className="seprate"></div>
      <TheHeader toast={toast} />
      <div className="links">
        <div
          className="linkContent"
          style={{ boxShadow: "0px 0px 3px gold" }}
        >
          <a href="./contest">MMFC10</a>
        </div>
        <div className="linkContent">
          <a href="./edit">编辑器</a>
        </div>
        <UserInfo apiroot={apiroot3} />
      </div>
      <div
        className="topButton"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
          }
        }}
      >
        顶
      </div>
      <div className="topButton sortButton" onClick={onSortClick}>
        {cwords[sortType]}
      </div>
      {/* <EventLogo /> */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Tippy
        singleton={source}
        animation="fade"
        placement="top-start"
        interactive={true}
      />
      <MainComp
        tippy={target}
        sort={words[sortType]}
      />
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

function SearchBar({ onChange, initS }) {
  return (
    <div className="searchDiv">
      <input
        type="text"
        className="searchInput"
        placeholder={initS == "" ? "Search" : initS}
        onChange={onChange}
        onClick={onChange}
      />
    </div>
  );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

function MainComp({ tippy, sort }) {
  const [Search, setSearch] = new useState("");
  const [isLoaded, setIsLoaded] = new useState(false);
  const [page, setPage] = useState(0);
  const [maxpage, setMaxpage] = useState(999999);
  useEffect(() => {
    if (!isLoaded) {
      const a = localStorage.getItem("search")
      setSearch(a ? a : "")
      const b = localStorage.getItem("lastclickpage");
      setPage(parseInt( b ? b : 0))
      setIsLoaded(true)
    }
  })
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setSearch(value)
      setPage(0)
      setMaxpage(9999999999999)
      localStorage.setItem("search", value);
      localStorage.setItem("lastclickpage", 0);
    },
    // delay in ms
    500
  );

  // 渲染数据
  return (
    <>
      <SearchBar
        onChange={(e) => debounced(e.target.value)}
        initS={Search}
      />
      <div className="theList">

        <SongList key={page}
          tippy={tippy}
          sort={sort}
          search={Search}
          page={page}
          setMax={setMaxpage} />

      </div>
      <div className="theList">
        {page - 1 >= 0 ? <button
          className="linkContent"
          id="submitbutton"
          type="button"
          style={{ width: "100px", margin: "auto" }}
          onClick={() => { setPage(page - 1); window.scrollTo(0, 200) }}
        >
          上一页
        </button> : <div style={{ width: "100px", margin: "auto" }}></div>}

        <h4>{page}</h4>
        {page < maxpage ? <button
          className="linkContent"
          id="submitbutton"
          type="button"
          style={{ width: "100px", margin: "auto" }}
          onClick={() => { setPage(page + 1); window.scrollTo(0, 200) }}
        >
          下一页
        </button> : <div style={{ width: "100px", margin: "auto" }}></div>}


      </div>

    </>
  );
}

function SongList({ tippy, sort, search, page, setMax }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/list?sort=" + sort  + "&page=" + page + "&search=" + encodeURIComponent(search),
    fetcher
  );
  if (error) return <div className="notReady">已闭店</div>;
  if (isLoading) {
    return (
      <>
        <div className="loading"></div>
      </>
    );
  }
  const OnDownloadClick = (params) => async () => {
    await downloadSong({ id: params.id, title: params.title, toast: toast })
  }
  const SavePosition = ({ id, page }) => {
    localStorage.setItem("lastclickid", id);
    localStorage.setItem("lastclickpage", page);
  }
  if (data.length < 30) setMax(page);
  const list = data.map((o) => (
    <div key={o.id} id={o.id} onClick={() => SavePosition({ id: o.id, page: page })}>
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          <CoverPic id={o.id} />
          <div className="songInfo">
            <Tippy content={o.title} singleton={tippy}>
              <div className="songTitle" id={o.id}>
                <a href={"/song?id=" + o.id}>{o.title}</a>
              </div>
            </Tippy>
            <Tippy content={o.artist} singleton={tippy}>
              <div className="songArtist">
                <a href={"/song?id=" + o.id}>
                  {o.artist == "" || o.artist == null ? "-" : o.artist}
                </a>
              </div>
            </Tippy>
            <Tippy content={o.uploader + "@" + o.designer} singleton={tippy}>
              <div className="songDesigner">
                <a href={"/song?id=" + o.Id}>{o.uploader + "@" + o.designer}</a>
              </div>
            </Tippy>

            <Levels levels={o.levels} songid={o.id} isPlayer={false} />
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
  return list;
}