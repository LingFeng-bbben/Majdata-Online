"use client";
import React, { useEffect, useRef, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import md5 from "js-md5";
import { apiroot3 } from "../apiroot";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loc, setLanguage } from "../utils";
import { PageLayout } from "../widgets";
import * as retCode from "../apiretcode";

export default function Page() {
    const [ready, setReady] = useState(false);
    const isPosted = useRef(false);
    useEffect(() => {
        setLanguage(localStorage.getItem("language") || navigator.language).then(
            () => {
                setReady(true);
            },
        );
    }, []);
    useEffect(() => {
        if (ready && !isPosted.current) {
            PostOTP();
            isPosted.current = true;
        }
    }, [ready]);

    if (!ready) return <div className="loading"></div>;

    const navigationItems = [
        { href: "/", label: loc("HomePage") },
        { href: "./login", label: loc("Login"), featured: true },
        { href: "./register", label: loc("Register") },
    ];

    return (
        <PageLayout
            navigationItems={navigationItems}
            className="auth-page"
        >
            <Login />
        </PageLayout>
    );
}
async function PostOTP() {
    const params = new URLSearchParams(window.location.search);
    const otp = params.get("otp");
    if (otp !== null) {
        const verifyRsp = await fetch(apiroot3 + "/account/verify?otp=" + otp, {
            method: "GET",
            credentials: "include",
        });
        if (verifyRsp.status !== 200) {
            if (verifyRsp.status === 400) {
                toast.error("InvalidOTP")
            }
            else {
                toast.error("UnknownError")
            }
        }
        else {
            toast.success(loc("AccountActivated"));
        }
    }
}
function Login() {
    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        if (formData.get("username") === "") {
            toast.error(loc("NoUsername"));
            return;
        }
        if (formData.get("password") === "") {
            toast.error(loc("NoPasswd"));
            return;
        }
        formData.set("password", md5(formData.get("password")));
        const response = await fetch(apiroot3 + "/account/Login", {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        if (response.status !== 200) {
            const rsp = await response.json();
            switch (rsp.code) {
                case retCode.CODE_INVALID_CREDENTIALS:
                    toast.error(loc("WrongCredential"));
                    break;
                case retCode.CODE_LOGIN_FAILED_PENDING_VERIFCATION:
                    toast.error(loc("[Login]PendingVerifcation"));
                    break;
                case retCode.CODE_LOGIN_FAILED_USER_BANNED:
                    toast.error(loc("[Login]UserBanned"));
                    break;
                default:
                    toast.error(await response.text());
                    break;
            }
            return;
        }
        //document.cookie = "token=" + (await response.text()) + ";max-age=604800";
        if (document.referrer && document.referrer !== location.href) {
            history.back();
        } else {
            window.location.href = "/";
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">欢迎回来</h2>
                    <p className="auth-subtitle">登录您的账户以继续</p>
                </div>
                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">{loc("Username")}</label>
                        <input
                            className="form-input"
                            type="text"
                            name="username"
                            placeholder="请输入用户名"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{loc("Password")}</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            placeholder="请输入密码"
                            required
                        />
                    </div>
                    <button className="auth-button" type="submit">
                        <span className="auth-button-text">{loc("Login")}</span>
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        还没有账户？ <a href="./register" className="auth-link">立即注册</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
