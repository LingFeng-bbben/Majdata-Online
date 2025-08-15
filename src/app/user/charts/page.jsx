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
  PageLayout,
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
  const navigationItems = [
    { href: "/user", label: loc("Back") }
  ];

  return (
    <PageLayout 
      title={loc("ChartsManagement")}
      navigationItems={navigationItems}
      className="user-charts-page"
      showNavigation={true}
    >

      {/* Upload Section */}
      <section className="upload-section">
        <div className="upload-container">
          <div className="upload-header">
            <h2 className="upload-title">{loc("UploadChart")}</h2>
            <div className="upload-notice">
              <div className="notice-content">
                <h3 className="notice-title">{loc("UploadNotice")}</h3>
                <ul className="notice-list">
                  <li>{loc("UploadNoticeTerms1")}</li>
                  <li>{loc("UploadNoticeTerms2")}</li>
                  <li>{loc("UploadNoticeTerms3")}</li>
                  <li>{loc("UploadNoticeTerms4")}</li>
                </ul>
              </div>
            </div>
          </div>
          <ChartUploader />
        </div>
      </section>

      {/* Charts Management Section */}
      <section className="charts-management-section">
        <div className="management-header">
          <h2 className="management-title">{loc("MyCharts")}</h2>
          <p className="management-subtitle">{loc("ManageAllYourCharts")}</p>
        </div>
        <SongList
          url={
            apiroot3 + "/maichart/list?search=uploader:" + encodeURIComponent(username)
          }
          isManage={true}
        />
      </section>
    </PageLayout>
  );
}
