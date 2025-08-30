"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import "tippy.js/dist/tippy.css";
import "react-toastify/dist/ReactToastify.css";
import { loc, setLanguage } from "../../utils";
import { AvatarUploader, IntroUploader, PageLayout } from "../../widgets";

export default function Page() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      },
    );
  }, []);
  if (!ready) {
    return <div className="loading"></div>;
  }
  const navigationItems = [{ href: "/user", label: loc("Back") }];

  return (
    <PageLayout
      title={loc("AccountSetting")}
      navigationItems={navigationItems}
      className="user-profile-page"
      showNavigation={false}
    >
      {/* Profile Settings */}
      <div className="profile-settings">
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-card-header">
              <div className="setting-card-title">
                {loc("AvatarSettings")} ({loc("AvatarHint")})
              </div>
            </div>
            <div className="setting-card-content">
              <AvatarUploader />
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-card-header">
              <div className="setting-card-title">{loc("PersonalIntro")}</div>
            </div>
            <div className="setting-card-content">
              <IntroUploader />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
