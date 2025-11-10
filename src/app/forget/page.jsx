"use client";
import React, { useEffect, useState } from "react";
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
    useEffect(() => {
        setLanguage(localStorage.getItem("language") || navigator.language).then(
            () => {
                setReady(true);
            },
        );
    }, []);

    if (!ready) return <div className="loading"></div>;

    const navigationItems = [
        { href: "/", label: loc("HomePage") },
        { href: "./login", label: loc("Login"), featured: true },
        { href: "./register", label: loc("Register") },
    ];

    const params = new URLSearchParams(window.location.search);
    const otp = params.get("otp");
    return (
        <PageLayout
            navigationItems={navigationItems}
            className="auth-page"
        >
            {otp !== null?<ResetPassword otp={otp}/>:<FindAccount />}
            
        </PageLayout>
    );
}
function FindAccount() {
    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        if (formData.get("username") === "") {
            toast.error(loc("NoUsername"));
            return;
        }
        if (formData.get("email") === "") {
            toast.error(loc("InvalidEmail"));
            return;
        }
        const response = await fetch(apiroot3 + "/account/forget", {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        if (response.status !== 200) {
            const rsp = await response.json();
            switch (rsp.code) {
                case retCode.CODE_INVALID_VALUE:
                    toast.error("用户名或邮箱未填");
                    break;
                case retCode.CODE_NO_SUCH_ITEM:
                    toast.error("没有这个用户");
                    break;
                default:
                    toast.error(await response.text());
                    break;
            }
            return;
        }
        toast.success("重置邮件已发送",{autoClose:false})
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">找回密码</h2>
                    <p className="auth-subtitle">请输入注册时使用的用户名和邮箱</p>
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
                        <label className="form-label">{loc("E-Mail")}</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="请输入邮箱"
                            required
                        />
                    </div>
                    
                    <button className="auth-button" type="submit">
                        <span className="auth-button-text">{"发送验证邮件"}</span>
                    </button>
                </form>
                <div className="auth-footer">
                    {/* TODO: i18n here */}
                    <p>
                        又想起来了？
                        <a href="./login" className="auth-link">登录</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

function ResetPassword({otp}) {
    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        if (formData.get("newpassword") === "") {
            toast.error(loc("NoPasswd"));
            return;
        }
        if (formData.get("newpassword-2") === "") {
            toast.error(loc("NoPasswd"));
            return;
        }
        if(formData.get("newpassword") !== formData.get("newpassword-2")){
            toast.error(loc("PasswdNoMatch"));
            return;
        }
        formData.set("otp", otp)
        formData.set("newpassword", md5(formData.get("newpassword")));
        formData.delete("newpassword-2")
        const response = await fetch(apiroot3 + "/account/forget", {
            method: "PUT",
            body: formData,
            credentials: "include",
        });
        if (response.status !== 200) {
            const rsp = await response.json();
            switch (rsp.code) {
                case retCode.CODE_INVALID_VALUE:
                    toast.error("未填必填项目或者OTP过期");
                    break;
                default:
                    toast.error(await response.text());
                    break;
            }
            return;
        }
        toast.success("重置成功！",{autoClose:false})
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">重设密码</h2>
                    <p className="auth-subtitle">请输入新的密码</p>
                </div>
                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">{loc("Password")}</label>
                        <input
                            className="form-input"
                            type="password"
                            name="newpassword"
                            placeholder="请输入密码"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{loc("ConfirmPassword")}</label>
                        <input
                            className="form-input"
                            type="password"
                            name="newpassword-2"
                            placeholder="请再输入一次"
                            required
                        />
                    </div>
                    
                    <button className="auth-button" type="submit">
                        <span className="auth-button-text">{"重置密码"}</span>
                    </button>
                </form>
                <div className="auth-footer">
                    {/* TODO: i18n here */}
                    <p>
                        又想起来了？
                        <a href="./login" className="auth-link">登录</a>
                    </p>
                </div>
            </div>
        </div>
    );
}