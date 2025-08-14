"use client";
import React, {useEffect, useState} from "react";
import "react-photo-view/dist/react-photo-view.css";
import md5 from "js-md5";
import { apiroot3 } from "../apiroot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {setLanguage, loc} from "../utils";
import {PageLayout} from "../widgets";

export default function Page() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language")||navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return <div className="loading"></div>;
  
  const navigationItems = [
    { href: "/", label: loc("HomePage") },
    { href: "./login", label: loc("Login"), featured: true },
    { href: "./register", label: loc("Register") }
  ];

  return (
    <PageLayout 
      title={loc("Login")}
      navigationItems={navigationItems}
      className="auth-page"
    >
      <Login />
    </PageLayout>
  );
}

function Login() {
  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if(formData.get("username")===""){
      toast.error(loc("NoUsername"));
      return;
    }
    if(formData.get("password")===""){
      toast.error(loc("NoPasswd"));
      return;
    }
    formData.set("password", md5(formData.get("password")));
    const response = await fetch(apiroot3 + "/account/Login", {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    if (response.status !== 200) {
      if(response.status === 404){
        toast.error(loc("WrongCredential"));
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">欢迎回来</h2>
          <p className="auth-subtitle">登录您的账户以继续</p>
        </div>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">{loc("Username")}</label>
            <input 
              className="form-input" 
              type="text" 
              name="username" 
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{loc("Password")}</label>
            <input 
              className="form-input" 
              type="password" 
              name="password" 
              placeholder="请输入密码"
              required
            />
          </div>
          <button className="auth-button" type="submit">
            <span className="auth-button-text">{loc("Login")}</span>
          </button>
        </form>
        <div className="auth-footer">
          <p>还没有账户？ <a href="./register" className="auth-link">立即注册</a></p>
        </div>
      </div>
    </div>
  );
}
