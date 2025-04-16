"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import UserInfo from "../../widgets/UserInfo";
import "tippy.js/dist/tippy.css";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MajdataLogo from "../../widgets/MajdataLogo";
import AvatarUploader from "../../widgets/AvatarUploader";
import IntroUploader from "../../widgets/IntroUploader";
import getUsername from "../../utils/getUsername";
import Logout from "../../utils/logout";

export default function Page() {
    return (
        <>
            <div className="seprate"></div>
            <MajdataLogo />
            <div className="links">
                <div className="linkContent">
                    <a href="./">返回</a>
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
