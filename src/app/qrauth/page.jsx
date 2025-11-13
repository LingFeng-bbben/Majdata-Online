"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import useSWR from "swr";
import { apiroot3 } from "../apiroot";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loc, setLanguage } from "../utils";
import { PageLayout } from "../widgets";
import * as retCode from "../apiretcode";

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

  const navigationItems = [
    { href: "/", label: loc("HomePage") },
    { href: "./login", label: loc("Login"), featured: true },
    { href: "./register", label: loc("Register") },
  ];

  const params = new URLSearchParams(window.location.search);
  const authid = params.get("auth-id");

  return (
    <PageLayout navigationItems={navigationItems} className="auth-page">
      <PermitLogin authId={authid} />
    </PageLayout>
  );
}

const fetcher = async (url) => {
  const res = await fetch(url, { mode: "cors", credentials: "include" });

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

function PermitLogin({ authId }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/machine/auth/info?auth-id=" + authId,
    fetcher
  );
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  if (isLoggedIn)
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">{"✅登录成功"}</h2>
          </div>
        </div>
      </div>
    );
  if (isLoading) return <div className="loading"></div>;
  if (error)
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">{"❌二维码无效❌"}</h2>
            <p className="auth-subtitle">{"尝试刷新二维码"}</p>
          </div>
        </div>
      </div>
    );
  async function onSubmit(event) {
    event.preventDefault();

    const response = await fetch(
      apiroot3 + "/machine/auth/permit?auth-id=" + authId,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (response.status !== 200) {
      if (response.status == 204) toast.error("已批准过了");
      const rsp = await response.json();
      switch (rsp.code) {
        case retCode.CODE_NOT_LOGGED_IN:
          toast.error("请先登录");
          window.location.href = "/login";
          break;
        case retCode.CODE_PERMISSION_DENIED:
          toast.error("权限不足");
          break;
        case retCode.CODE_ERROR:
          toast.error("没有这个二维码");
          break;
        default:
          toast.error("请重试");
          toast.error(await response.text());
          break;
      }
      return;
    }
    setIsLoggedIn(true);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">{"确认登录吗？"}</h2>
          <p className="auth-subtitle">{"请检查以下机台信息"}</p>
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">{"机台信息"}</label>
            <p>{data.granteeInfo.name}</p>
            <p>{data.granteeInfo.description}</p>
          </div>

          <div className="form-group">
            <label className="form-label">{"登录地点"}</label>
            <p>{data.granteeInfo.place}</p>
            <p>{data.granteeInfo.remoteIP}</p>
          </div>

          <button className="auth-button" onClick={onSubmit}>
            <span className="auth-button-text">{"确认登录"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
