"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import "tippy.js/dist/tippy.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Logout,MajdataLogo,UserInfo} from "../widgets";

export default function Page() {
  return (
    <>
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent">
          <a href="../">返回</a>
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
      <div className="links">
        <div className="linkContent">
          <a href="./user/charts">谱面管理</a>
        </div>
        <div className="linkContent">
          <a href="./user/profile">个人设置</a>
        </div>
      </div>
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}


