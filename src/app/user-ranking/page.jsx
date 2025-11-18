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
      title={"肝帝榜"}
      navigationItems={navigationItems}
      className="ranking-page"
    >
      <div className="ranking-intro">
        <p className="ranking-description">{"总达成率榜之谁是自制谱鉴赏老资历？"}</p>
      </div>

      <div className="ranking-sections">
        <ScoreCount uploader={""} page={0} pageSize={100} />
      </div>
    </PageLayout>
  );
}

