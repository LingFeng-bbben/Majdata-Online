"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import "tippy.js/dist/tippy.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Logout, MajdataLogo, UserInfo } from "../widgets";
import getUsername from "../utils/getUsername";

export default function Page() {
  return (
    <>
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent">
          <a href="/">主页</a>
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
        <div className="fancyDownloadButton">谱面管理 </div>
      </a>

      <a href="./user/profile">
        <div className="fancyDownloadButton">个人设置 </div>
      </a>

      <a href={"/space?id=" + getUsername()}>
        <div className="fancyDownloadButton">个人主页 </div>
      </a>

      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}
