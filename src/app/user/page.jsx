"use client";
import React, {useEffect, useState} from "react";
import "react-photo-view/dist/react-photo-view.css";
import "tippy.js/dist/tippy.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {loc, setLanguage} from "../utils";
import {Logout, MajdataLogo, UserInfo} from "../widgets";
import getUsername from "../utils/getUsername";

export default function Page() {
  const username = getUsername();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language")||navigator.language).then(() => {
      setReady(true);
    });
  }, []);
  if (!ready) return <div className="loading"></div>;

  return (
    <>
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent">
          <a href="/">{loc("HomePage")}</a>
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

      <a href="./user/charts">
        <div className="fancyDownloadButton">{loc("ChartsManagement")} </div>
      </a>

      <a href="./user/profile">
        <div className="fancyDownloadButton">{loc("AccountSetting")} </div>
      </a>

      <a href={"/space?id=" + username}>
        <div className="fancyDownloadButton">{loc("PersonalHomePage")} </div>
      </a>

      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}
