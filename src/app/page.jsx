"use client";
import React, { useEffect, useState } from "react";
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
import TheHeader from "./header";
import CoverPic from "./cover";
import Levels from "./levels";

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
      <TheHeader toast={toast} />
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
    apiroot3 + "/maichart/list?sort=" + sort,
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
              o.designer?.toLowerCase().includes(value.toLowerCase()) ||
              o.uploader?.toLowerCase().includes(value.toLowerCase()) ||
              o.title?.toLowerCase().includes(value.toLowerCase()) ||
              o.artist?.toLowerCase().includes(value.toLowerCase()) ||
              o.levels.some((i) => i == value) ||
              o.id == value
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
      } else {
        if (lastSo) {
          url += "?sort=" + sort;
        }
      }
      window.history.pushState({}, 0, url);
    },
    // delay in ms
    500
  );
  useEffect(() => {
    if (isLoaded) {
      onLoad();
    }
  });
  if (error) return <div className="notReady">已闭店</div>;
  if (isLoading) {
    return (
      <>
        <SearchBar />
        <div className="loading"></div>
      </>
    );
  }
  if (data == "" || data == undefined)
    return <div className="notReady">空的</div>;

  debounced(sKey);

  if (filteredList == undefined) {
    return <SearchBar />;
  }

  async function fetchFile(url, fileName) {
    var t;
    try {
      t = toast.loading("Downloading " + fileName, { hideProgressBar: false });
      var response = await axios.get(url, {
        responseType: "blob",
        onDownloadProgress: function (progressEvent) {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            toast.update(t, { progress });
          }
        },
      });
      toast.done(t);
      return response.data;
    } catch (error) {
      toast.done(t);
      return undefined;
    } finally {
      toast.done(t);
    }
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

  const downloadSong = (props) => async () => {
    const zip = new JSZip();
    //alert(props.id)
    zip.file(
      "track.mp3",
      await fetchFile(apiroot3 + "/Track/" + props.id, "track.mp3")
    );
    zip.file(
      "bg.jpg",
      await fetchFile(apiroot3 + "/ImageFull/" + props.id, "bg.jpg")
    );
    zip.file(
      "maidata.txt",
      await fetchFile(apiroot3 + "/Maidata/" + props.id, "maidata.txt")
    );
    const video = await fetchFile(apiroot3 + "/Video/" + props.id, "bg.mp4");
    if (video != undefined) {
      zip.file("bg.mp4", video);
    }

    zip.generateAsync({ type: "blob" }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      toast.success(props.title + "下载成功");
      downloadFile(url, props.title + ".zip");
    });
  };

  // const shareSong = (props) => async () => {
  //   await navigator.clipboard.writeText(
  //     "https://majdata.net/song?id=" + props.id
  //   );
  //   toast.success("已复制到剪贴板", {
  //     position: "bottom-center",
  //     autoClose: 3000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   });
  // };

  const list = filteredList.map((o) => (
    <div key={o.Id}>
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

            <Levels levels={o.levels} songid={o.id} />
            <br />
            <div
              className="songLevel downloadButtonBox"
              onClick={downloadSong({ id: o.id, title: o.title })}
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
            <InteractCount songid={o.yd} />
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
