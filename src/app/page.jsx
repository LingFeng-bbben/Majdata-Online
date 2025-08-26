"use client";
import React, { useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLanguage, loc } from "./utils";
import { LanguageSelector, MajdataLogo, UserInfo, SongList, AdComponent } from "./widgets";
import { apiroot3 } from "./apiroot";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Scrollbar, Navigation } from 'swiper/modules';

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      }
    );
  }, []);

  if (!ready) return <div className="loading"></div>;

  return (
    <>
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent" style={{ boxShadow: "0px 0px 3px gold" }}>
          <a href="./ranking">{loc("RankingList")}</a>
        </div>
        <div className="linkContent">
          <a href="./edit">{loc("ChartEditor")}</a>
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
        {loc("GoTop")}
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
      <Swiper
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        scrollbar={{
          hide: true,

        }}
        modules={[Autoplay, Scrollbar, Navigation]}
        style={{ maxWidth: "400px", display: "block", margin: "0 auto", borderRadius: "10px" }}
      >
        <SwiperSlide><a
          href="/space?id=哈基杯"
          className="theList"
        >
          <img
            src="/event6.jpg"
            alt=""
          />
        </a> </SwiperSlide>
        <SwiperSlide><a
          href="/space?id=MUFC"
          className="theList"
        >
          <img
            src="/event5.png"
            alt=""
          />
        </a> </SwiperSlide>
        <SwiperSlide><a
          href="/space?id=dilei"
          className="theList"
        >
          <img
            src="/event2.jpg"
            alt=""
          />
        </a> </SwiperSlide>
        <SwiperSlide><a
          href="/space?id=海鲜杯"
          className="theList"
        >
          <img
            src="/event3.jpg"
            alt=""
          />
        </a> </SwiperSlide>
        <SwiperSlide><a
          href="/space?id=TeamXmmcg"
          className="theList"
        >
          <img
            src="/event1.png"
            alt=""
          />
        </a> </SwiperSlide>
      </Swiper>


      <MainComp />
      <LanguageSelector />
      <DownloadTypeSelector />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7973799234411834" crossOrigin="anonymous"></script>
      <AdComponent />
      <a href="/minigame"><img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" /></a>
    </>
  );
}

function SearchBar({ onChange, initS, sortType, onSortChange }) {
  const sortOptions = [
    loc("UploadDate"),
    loc("LikeCount"),
    loc("CommentCount"),
    loc("PlayCount"),
  ];
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
          <option key={i} value={i}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MainComp() {
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
      <SearchBar
        onChange={(e) => debounced(e.target.value)}
        initS={Search}
        sortType={sortType}
        onSortChange={onSortChange}
      />

      <SongList
        url={
          apiroot3 +
          "/maichart/list?sort=" +
          sortWords[sortType] +
          "&page=" +
          page +
          "&search=" +
          encodeURIComponent(Search)
        }
        page={page}
        setMax={setMaxpage}
      />

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
            {loc("LastPage")}
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
            {loc("NextPage")}
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
          {loc("FrontPage")}
        </button>
      </div>
    </>
  );
}

function DownloadTypeSelector() {
  const [currentType, setCurrentType] = useState("zip")

  useEffect(() => {
    //get init type
    const type = localStorage.getItem("DownloadType")
    if (type != undefined)
      setCurrentType(type);
  })

  const handleChange = async (e) => {
    const newtype = e.target.value
    localStorage.setItem("DownloadType", newtype)
    setCurrentType(newtype)
  };


  return (
    <div
      style={{
        width: "fit-content",
        margin: "auto",
        marginTop: "2rem",
        zIndex: 9999,
        backgroundColor: "black",
        padding: "6px 10px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        fontSize: "14px",
        border: "1px solid whitesmoke"
      }}
    >
      <select
        value={currentType}
        onChange={handleChange}
        style={{
          background: "black",
          border: "none",
          fontSize: "inherit",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="zip">Default *.zip</option>
        <option value="adx">Astro *.adx</option>
      </select>
    </div>
  );
}