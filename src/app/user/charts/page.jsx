"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import { apiroot3 } from "../../apiroot";
import "tippy.js/dist/tippy.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsername, loc, setLanguage } from "../../utils";
import {
  UserInfo,
  Logout,
  ChartUploader,
  SongList,
  MajdataLogo,
} from "../../widgets";

export default function Page() {
  const [ready, setReady] = useState(false);
  const username = getUsername();
  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      }
    );
  }, []);
  if (!ready) {
    return <div className="loading"></div>;
  }
  return (
    <>
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent">
          <a href="/user">{loc("Back")}</a>
        </div>
        <UserInfo />
        <Logout />
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
      <h1>{loc("UploadChart")}</h1>
      <div className="upload-notice">
        <p>
          {loc("UploadNoticeText")}
          <br />
          1. {loc("UploadNoticeTerms1")}
          <br />
          2. {loc("UploadNoticeTerms2")}
          <br />
          3. {loc("UploadNoticeTerms3")}
          <br />
          4. {loc("UploadNoticeTerms4")}
          <br />
        </p>
      </div>
      <ChartUploader />
      <h1>{loc("ChartsManagement")}</h1>
      <SongList
        url={
          apiroot3 + "/maichart/list?search=uploader:" + encodeURIComponent(username)
        }
        isManage={true}
      />
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}
