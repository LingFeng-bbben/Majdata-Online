"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { apiroot3 } from "../apiroot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLanguage, loc } from "../utils";
import { SongList, MajdataLogo } from "../widgets";

export default function Page() {
  const [ready, setReady] = useState(false);
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
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent">
          <a href="../">{loc("Back")}</a>
        </div>
      </div>
      <div className="theList">
        <h1>~{loc("RecommendedCharts")}~</h1>
      </div>
      <div className="theList">{loc("RecommendedChartsHint")}</div>
      <div className="theList">
        <h2>~{loc("Play")}~</h2>
      </div>
      <SongList
        url={
          apiroot3 +
          "/maichart/list?&isRanking=true&sort=" +
          encodeURIComponent("scorep")
        }
        isRanking={true}
      />
      <div className="theList">
        <h2>~{loc("Like")}~</h2>
      </div>
      <SongList
        url={
          apiroot3 +
          "/maichart/list?&isRanking=true&sort=" +
          encodeURIComponent("likep")
        }
        isRanking={true}
      />
      <div className="theList">
        <h2>~{loc("Comment")}~</h2>
      </div>
      <SongList
        url={
          apiroot3 +
          "/maichart/list?&isRanking=true&sort=" +
          encodeURIComponent("commp")
        }
        isRanking={true}
      />
      <div className="theList">
        <h2>~{loc("Download")}~</h2>
      </div>
      <SongList
        url={
          apiroot3 +
          "/maichart/list?&isRanking=true&sort=" +
          encodeURIComponent("playp")
        }
        isRanking={true}
      />

      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}
