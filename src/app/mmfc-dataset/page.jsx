"use client";
import React, { useEffect, useState } from "react";
import { setLanguage, loc } from "../utils";
import { PageLayout } from "../widgets";
import "@/styles/pages/mmfcDataset.css";

export default function MMFCDatasetPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      }
    );
  }, []);

  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout
      title="MMFC资料集"
      className="mmfc-dataset-page"
      showBackToHome={true}
      showNavigation={false}
    >
      <div className="mmfc-dataset-container">
        <header className="mmfc-dataset-header">
          <p className="mmfc-dataset-description">
            这里汇总了历届MMFC比赛的相关信息和数据
          </p>
        </header>

        <div className="mmfc-dataset-content">
          <div className="iframe-container">
            <iframe
              src="https://docs.qq.com/sheet/DVG92WXZPTURNa25N"
              className="tencent-doc-iframe"
              title="MMFC资料集"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="iframe-tip">
            <p>提示：可以使用Ctrl+鼠标滚轮或双指缩放来调整文档显示大小</p>
            <p className="iframe-link">
              <a 
                href="https://docs.qq.com/sheet/DVG92WXZPTURNa25N" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                点击打开原地址
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

