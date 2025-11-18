"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";

import "react-toastify/dist/ReactToastify.css";
import { loc, setLanguage } from "../utils";
import { PageLayout, ScoreCount } from "../widgets";


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

  const navigationItems = [{ href: "/", label: loc("Back") }];

  return (
    <PageLayout
      title={loc("UserRankingTitle")}
      navigationItems={navigationItems}
      className="ranking-page"
    >
      <div className="ranking-intro">
        <p className="ranking-description">{loc("UserRankingDescription")}</p>
      </div>

      <div className="ranking-sections">
        <ScoreCount uploader={""} page={0} pageSize={100} />
      </div>
    </PageLayout>
  );
}

