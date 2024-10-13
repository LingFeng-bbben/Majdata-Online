"use client";
import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import useSWR from "swr";
import UserInfo from "./userinfo";
import { apiroot3 } from "./apiroot";
import JSZip from "jszip";
import axios from "axios";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./eventstyle.css";
import LazyLoad from "react-lazy-load";
import InteractCount from "./interact";

export default function Page() {
  const [source, target] = useSingleton();
  const [sortType, setSortType] = useState(0);
  const [isInitSorted, setIsInitSorted] = useState(false);
  const searchParams = useSearchParams();
  const initSearch = searchParams.get("s");
  const initSort = searchParams.get("sort");
  function saveScrollPosition() {
    if (typeof window !== "undefined") {
      var scrollY = window.scrollY || document.documentElement.scrollTop;

      localStorage.setItem("scrollPosition", scrollY);
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", saveScrollPosition);
  }
  function onListLoadScroll() {
    if (typeof window !== "undefined") {
      var savedScrollY = localStorage.getItem("scrollPosition") || 0;
      window.scrollTo(0, savedScrollY);
    }
  }
  if (!isInitSorted) {
    if (initSort == "likep") setSortType(1);
    if (initSort == "commp") setSortType(2);
    setIsInitSorted(true);
  }

  function onSortClick() {
    localStorage.setItem("scrollPosition", 0);
    setSortType(sortType + 1);
    if (sortType >= 2) setSortType(0);
    console.log(sortType);
  }
  const words = ["", "likep", "commp"];
  return (
    <>
      <div className="seprate"></div>
      <h1>
        <img
          className="xxlb"
          src="./salt.webp"
          onClick={() =>
            toast.error("不要点我 操你妈", {
              position: "top-center",
              autoClose: 500,
            })
          }
        ></img>
        Majdata.Net
      </h1>
      <div className="links">
        {initSearch ? (
          <div className="linkContent">
            <a href="./">返回</a>
          </div>
        ) : (
          <>
            <div
              className="linkContent"
              style={{ boxShadow: "0px 0px 3px gold" }}
            >
              <a href="./contest">MMFC10</a>
            </div>
            <div className="linkContent">
              <a href="./dydy">匿名板</a>
            </div>
            <div className="linkContent">
              <a href="./edit">编辑器</a>
            </div>
          </>
        )}

        {/* <div className='linkContent'><Link href='./contest'>MMFC 6th</Link></div> */}
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
        序
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
      <TheList
        tippy={target}
        initSearch={initSearch}
        onLoad={onListLoadScroll}
        sort={words[sortType]}
      />
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

function CoverPic({ id }) {
  let url = apiroot3 + `/Image/${id}`;
  let urlfull = apiroot3 + `/ImageFull/${id}`;
  return (
    <>
      <PhotoProvider
        bannerVisible={false}
        loadingElement={<div className="loading"></div>}
      >
        <PhotoView src={urlfull}>
          <img className="songImg" loading="lazy" src={url} alt="" />
        </PhotoView>
      </PhotoProvider>
      {/* <div className='songId'>{id}</div> */}
    </>
  );
}

function Levels({ levels, songid }) {
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] == null) {
      levels[i] = "-";
    }
  }

  return (
    <a href={"/song?id=" + songid}>
      <div
        className="songLevel"
        id="lv0"
        style={{ display: levels[0] == "-" ? "none" : "unset" }}
      >
        {levels[0]}
      </div>
      <div
        className="songLevel"
        id="lv1"
        style={{ display: levels[1] == "-" ? "none" : "unset" }}
      >
        {levels[1]}
      </div>
      <div
        className="songLevel"
        id="lv2"
        style={{ display: levels[2] == "-" ? "none" : "unset" }}
      >
        {levels[2]}
      </div>
      <div
        className="songLevel"
        id="lv3"
        style={{ display: levels[3] == "-" ? "none" : "unset" }}
      >
        {levels[3]}
      </div>
      <div
        className="songLevel"
        id="lv4"
        style={{ display: levels[4] == "-" ? "none" : "unset" }}
      >
        {levels[4]}
      </div>
      <div
        className="songLevel"
        id="lv5"
        style={{ display: levels[5] == "-" ? "none" : "unset" }}
      >
        {levels[5]}
      </div>
      <div
        className="songLevel"
        id="lv6"
        style={{ display: levels[6] == "-" ? "none" : "unset" }}
      >
        {levels[6]}
      </div>
    </a>
  );
}

function SearchBar({ onChange, initS }) {
  return (
    <div className="searchDiv">
      <input
        type="text"
        className="searchInput"
        placeholder={!initS ? "Search" : initS}
        onChange={onChange}
      />
    </div>
  );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

function TheList({ tippy, initSearch, onLoad, sort }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/SongList?sort=" + sort,
    fetcher
  );
  const [filteredList, setFilteredList] = new useState(data);
  const [isLoaded, setIsLoaded] = new useState(false);
  const [sKey, setSKey] = new useState(initSearch);
  const [lastS, setLastS] = new useState("");
  const [lastSo, setLastSo] = new useState(sort);
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      let url = "/";
      if (value != lastS || sort != lastSo) {
        if (value && value != "") {
          let dataf = data.filter(
            (o) =>
              o.Designer?.toLowerCase().includes(value.toLowerCase()) ||
              o.Uploader?.toLowerCase().includes(value.toLowerCase()) ||
              o.Title?.toLowerCase().includes(value.toLowerCase()) ||
              o.Artist?.toLowerCase().includes(value.toLowerCase()) ||
              o.Levels.some((i) => i == value) ||
              o.Id == value
          );
          setFilteredList(dataf);
          setLastS(value);
        } else {
          setFilteredList(data);
          setLastS("");
        }
        setLastSo(sort);
        setIsLoaded(true);
      }

      if (lastS) {
        url += "?s=" + lastS;
        if (lastSo) {
          url += "&sort=" + sort;
        }
      }else{
      if (lastSo) {
        url += "?sort=" + sort;
      }}
      window.history.pushState({}, 0, url);
    },
    // delay in ms
    500
  );
  useEffect(() => {
    console.log("effect");
    if (isLoaded) {
      //console.log('onload')
      onLoad();
    }
  });
  if (error) return <div className='notReady'>已闭店</div>;
  if (isLoading) {
    return (
      <>
        <SearchBar />
        <div className="loading"></div>
      </>
    );
  }
  if (data == "" || data == undefined) return <div>failed to load: data is empty</div>;

  debounced(sKey);

  if (filteredList == undefined) {
    return <SearchBar />;
  }

  async function fetchFile(url) {
    const response = await axios.get(url, { responseType: "blob" });
    return response.data;
  }

  function downloadFile(url, fileName) {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadSong = (props) => () => {
    const zip = new JSZip();
    //alert(props.id)
    zip.file("track.mp3", fetchFile(apiroot3 + "/Track/" + props.id));
    zip.file("bg.jpg", fetchFile(apiroot3 + "/ImageFull/" + props.id));
    zip.file("maidata.txt", fetchFile(apiroot3 + "/Maidata/" + props.id));

    zip.generateAsync({ type: "blob" }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      downloadFile(url, props.title);
    });
  };

  const shareSong = (props) => async () => {
    await navigator.clipboard.writeText(
      "https://majdata.net/song?id=" + props.id
    );
    toast.success("已复制到剪贴板", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const list = filteredList.map((o) => (
    <div key={o.Id}>
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          <CoverPic id={o.Id} />
          <div className="songInfo">
            <Tippy content={o.Title} singleton={tippy}>
              <div className="songTitle" id={o.Id}>
                <a href={"/song?id=" + o.Id}>{o.Title}</a>
              </div>
            </Tippy>
            <Tippy content={o.Artist} singleton={tippy}>
              <div className="songArtist">
                <a href={"/song?id=" + o.Id}>
                  {o.Artist == "" || o.Artist == null ? "-" : o.Artist}
                </a>
              </div>
            </Tippy>
            <Tippy content={o.Uploader + "@" + o.Designer} singleton={tippy}>
              <div className="songDesigner">
                <a href={"/song?id=" + o.Id}>{o.Uploader + "@" + o.Designer}</a>
              </div>
            </Tippy>

            <Levels levels={o.Levels} songid={o.Id} />
            <br />
            <div
              className="songLevel downloadButtonBox"
              onClick={shareSong({ id: o.Id })}
            >
              <svg
                className="shareButton"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
              </svg>
            </div>
            <div
              className="songLevel downloadButtonBox"
              onClick={downloadSong({ id: o.Id, title: o.Title })}
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
            <InteractCount songid={o.Id} />
          </div>
        </div>
      </LazyLoad>
    </div>
  ));

  // 渲染数据
  return (
    <>
      <SearchBar
        onChange={(e) => {
          setSKey(e.target.value);
          localStorage.setItem("scrollPosition", 0);
        }}
        initS={initSearch}
      />
      <div className="theList">{list}</div>
    </>
  );
}
