"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import "tippy.js/dist/tippy.css";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getUsername from "../../utils/getUsername";
import {Logout,IntroUploader,MajdataLogo,AvatarUploader,UserInfo} from "../../widgets";

export default function Page() {
    return (
        <>
            <div className="seprate"></div>
            <MajdataLogo />
            <div className="links">
                <div className="linkContent">
                    <a href="/user">返回</a>
                </div>
                <UserInfo />
                <Logout />
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
            <h1>创作空间</h1>
            <div className="theList">
                <a className="linkContent" href={"/space?id=" + getUsername()}>点我前往个人主页</a>
            </div>
            <AvatarUploader />
            <IntroUploader />

            <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
        </>
    );
}
