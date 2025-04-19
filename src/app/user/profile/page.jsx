"use client";
import React, {useEffect, useState} from "react";
import "react-photo-view/dist/react-photo-view.css";
import "tippy.js/dist/tippy.css";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {loc, setLanguage} from "../../utils";
import getUsername from "../../utils/getUsername";
import {Logout, IntroUploader, MajdataLogo, AvatarUploader, UserInfo, LanguageSelector} from "../../widgets";

export default function Page() {
  const username = getUsername();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(() => {
      setReady(true);
    });
  }, []);
  if (!ready) {
    return <div>Loading Localizations...</div>;
  }
  return (
    <>
      <LanguageSelector/>
      <div className="seprate"></div>
      <MajdataLogo/>
      <div className="links">
        <div className="linkContent">
          <a href="/user">{loc("Back")}</a>
        </div>
        <UserInfo/>
        <Logout/>
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
      <h1>{loc("AccountSetting")}</h1>
      <div className="theList">
        <a className="linkContent" href={"/space?id=" + username}>{loc("Goto")} {loc("PersonalHomePage")}</a>
      </div>
      <AvatarUploader/>
      <IntroUploader/>

      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt=""/>
    </>
  );
}
