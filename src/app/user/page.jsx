"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import "tippy.js/dist/tippy.css";
import "react-toastify/dist/ReactToastify.css";
import { loc, setLanguage } from "../utils";
import { PageLayout } from "../widgets";
import getUsername from "../utils/getUsername";

export default function Page() {
  const username = getUsername();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      },
    );
  }, []);
  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout
      title={loc("UserCenter")}
      showNavigation={false}
      className="user-page"
    >
      <div className="user-dashboard">
        <div className="dashboard-grid">
          <a href="./user/charts" className="dashboard-card">
            <div className="dashboard-icon">📊</div>
            <div className="dashboard-content">
              <h3 className="dashboard-title">{loc("ChartsManagement")}</h3>
              <p className="dashboard-description">{loc("ManageYourCharts")}</p>
            </div>
            <div className="dashboard-arrow">→</div>
          </a>

          <a href="./user/profile" className="dashboard-card">
            <div className="dashboard-icon">⚙️</div>
            <div className="dashboard-content">
              <h3 className="dashboard-title">{loc("AccountSetting")}</h3>
              <p className="dashboard-description">
                {loc("ModifyPersonalInfo")}
              </p>
            </div>
            <div className="dashboard-arrow">→</div>
          </a>

          <a href={"/space?id=" + username} className="dashboard-card">
            <div className="dashboard-icon">🏠</div>
            <div className="dashboard-content">
              <h3 className="dashboard-title">{loc("PersonalHomePage")}</h3>
              <p className="dashboard-description">{loc("ViewYourHomePage")}</p>
            </div>
            <div className="dashboard-arrow">→</div>
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
