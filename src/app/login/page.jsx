"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import md5 from "js-md5";
import { apiroot3 } from "../apiroot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MajdataLogo from "../widgets/MajdataLogo";

export default function Page() {
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
          <a href="../">返回</a>
        </div>
        <div className="linkContent">
          <a href="./login">登录</a>
        </div>
        <div className="linkContent">
          <a href="./register">注册</a>
        </div>
      </div>
      <Login />
    </>
  );
}

function Login() {
  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if(formData.get("username")==""){
      toast.error("请输入用户名");
      return;
    }
    if(formData.get("password")==""){
      toast.error("请输入密码");
      return;
    }
    formData.set("password", md5(formData.get("password")));
    const response = await fetch(apiroot3 + "/account/Login", {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    if (response.status != 200) {
      if(response.status ==404){
        toast.error("用户名或密码错误");
        return;
      }
      toast.error(await response.text());
      return;
    }
    //document.cookie = "token=" + (await response.text()) + ";max-age=604800";
    if (document.referrer && document.referrer !== location.href) {
      history.back();
    } else {
      window.location.href = "/";
    }
  }
  return (
    <div className="theList">
      <form className="formbox" onSubmit={onSubmit}>
        <div className="inputHint">用户名</div>
        <input className="userinput" type="text" name="username" />
        <div className="inputHint">密码</div>
        <input className="userinput" type="password" name="password" />
        <button className="linkContent" type="submit">
          确定
        </button>
      </form>
    </div>
  );
}
