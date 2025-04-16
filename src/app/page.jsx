"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import UserInfo from "./widgets/UserInfo";
import { apiroot3 } from "./apiroot";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./eventstyle.css";
import LazyLoad from "react-lazy-load";
import InteractCount from "./widgets/InteractCount";
import TheHeader from "./widgets/TheHeader";
import CoverPic from "./widgets/CoverPic";
import Levels from "./widgets/Levels";
import { downloadSong } from "./download";

export default function Page() {
  const [source, target] = useSingleton();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);
  return (
    <>
      <div className="seprate"></div>
      <TheHeader />
      <div className="links">
        <div
          className="linkContent"
          // style={{ boxShadow: "0px 0px 3px gold" }}
        >
          <a href="./contest">MMFC11</a>
        </div>
        <div className="linkContent" style={{ boxShadow: "0px 0px 3px gold" }}>
          <a href="./ranking">排行榜</a>
        </div>
        <div className="linkContent">
          <a href="./edit">编辑器</a>
        </div>
        <UserInfo />
      </div>
      <div
        className="topButton"
        onClick={() => {
          if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        顶
      </div>
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
        <a href="./space?id=TeamXmmcg" className="theList" style={{ maxWidth: "400px", display: "block", margin: "0 auto" }}>
            <img src="/xmmcg/title.png" alt="" style={{ width: "100%", height: "auto" }} />
        </a>
      <MainComp tippy={target} />
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

function SearchBar({ onChange, initS, sortType, onSortChange }) {
    const sortOptions = ["序", "赞", "评", "播"];
    return (
        <div className="searchDiv">
            <input
                type="text"
                className="searchInput"
                placeholder={initS === "" ? "Search" : initS}
                onChange={onChange}
                onClick={onChange}
            />
            <select
                value={sortType}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onSortChange(val);
                }}
                className="sortSelect"
            >
                {sortOptions.map((label, i) => (
                    <option key={i} value={i}>{label}</option>
                ))}
            </select>
        </div>
    );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

function MainComp({ tippy }) {
  const [Search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(0);
  const [maxpage, setMaxpage] = useState(999999);
  const [sortType, setSortType] = useState(0);

  useEffect(() => {
    if (!isLoaded) {
      const a = localStorage.getItem("search");
      const b = localStorage.getItem("lastclickpage");
      const s = localStorage.getItem("sort");
      setSearch(a ? a : "");
      setPage(parseInt(b ? b : 0));
      setIsLoaded(true);
      setSortType(s ? parseInt(s) : 0);
    }
  }, [isLoaded]);

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setSearch(value);
      setPage(0);
      setMaxpage(9999999999999);
      localStorage.setItem("search", value);
      localStorage.setItem("lastclickpage", 0);
    },
    // delay in ms
    500
  );

    const onSortChange = (val) => {
        setSortType(val);
        localStorage.setItem("sort", val);
        setPage(0);
        localStorage.setItem("lastclickpage", 0);
    };

    const sortWords = ["", "likep", "commp", "playp"];

  // 渲染数据
  return (
    <>
      <SearchBar onChange={(e) => debounced(e.target.value)} initS={Search} sortType={sortType} onSortChange={onSortChange} />
      <div className="theList">
        <SongList
          key={page}
          tippy={tippy}
          sort={sortWords[sortType]}
          search={Search}
          page={page}
          setMax={setMaxpage}
        />
      </div>
      <div className="theList">
        {page - 1 >= 0 ? (
          <button
            className="pagingButton linkContent"
            id="submitbutton"
            type="button"
            style={{ width: "100px", margin: "auto" }}
            onClick={() => {
              setPage(page - 1);
              window.scrollTo(0, 200);
            }}
          >
            上一页
          </button>
        ) : (
          <div style={{ width: "100px", margin: "auto" }}></div>
        )}

        <input
          type="number"
          value={page}
          className="searchInput"
          style={{ width: "100px" }}
          onChange={(event) => {
            if (event.target.value !== "")
              setPage(parseInt(event.target.value));
            else setPage(0);
          }}
          min="0"
          step="1"
        />
        {page < maxpage ? (
          <button
            className="pagingButton linkContent"
            id="submitbutton"
            type="button"
            style={{ width: "100px", margin: "auto" }}
            onClick={() => {
              setPage(page + 1);
              window.scrollTo(0, 200);
            }}
          >
            下一页
          </button>
        ) : (
          <div style={{ width: "100px", margin: "auto" }}></div>
        )}
      </div>
      <div className="theList">
        <button
          className="linkContent"
          id="submitbutton"
          type="button"
          style={{ width: "100px", margin: "auto" }}
          onClick={() => {
            setPage(0);
            window.scrollTo(0, 200);
          }}
        >
          回首页
        </button>
      </div>
    </>
  );
}

function SongList({ tippy, sort, search, page, setMax }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 +
      "/maichart/list?sort=" +
      sort +
      "&page=" +
      page +
      "&search=" +
      encodeURIComponent(search),
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
    await downloadSong({ id: params.id, title: params.title, toast: toast });
  };
  const SavePosition = ({ id, page }) => {
    localStorage.setItem("lastclickid", id);
    localStorage.setItem("lastclickpage", page);
  };
  if (data.length < 30) setMax(page);
  const list = data.map((o) => (
    <div
      key={o.id}
      id={o.id}
      onClick={() => SavePosition({ id: o.id, page: page })}
    >
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
                <a href={"/space?id=" + o.uploader}>
                  <img
                    className="smallIcon"
                    src={apiroot3 + "/account/Icon?username=" + o.uploader}
                  />
                  {o.uploader + "@" + o.designer}
                </a>
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
