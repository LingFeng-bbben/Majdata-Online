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
                    toast.error(loc("UserNameOrEmailEmpty"));
                    break;
                case retCode.CODE_NO_SUCH_ITEM:
                    toast.error(loc("NoSuchUser"));
                    break;
                default:
                    toast.error(await response.text());
                    break;
            }
            return;
        }
        toast.success(loc("ResetEmailSent"),{autoClose:false})
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">{loc("ForgetPasswordTitle")}</h2>
                    <p className="auth-subtitle">{loc("ForgetPasswordSubtitle")}</p>
                </div>
                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">{loc("Username")}</label>
                        <input
                            className="form-input"
                            type="text"
                            name="username"
                            placeholder={loc("EnterUsername")}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{loc("E-Mail")}</label>
                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder={loc("EnterEmail")}
                            required
                        />
                    </div>
                    
                    <button className="auth-button" type="submit">
                        <span className="auth-button-text">{loc("SendVerificationEmail")}</span>
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        {loc("RememberPassword")}
                        <a href="./login" className="auth-link">{loc("Login")}</a>
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
                    toast.error(loc("OTPExpiredOrEmpty"));
                    break;
                default:
                    toast.error(await response.text());
                    break;
            }
            return;
        }
        toast.success(loc("ResetPasswordSuccess"),{autoClose:false})
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">{loc("ResetPasswordTitle")}</h2>
                    <p className="auth-subtitle">{loc("ResetPasswordSubtitle")}</p>
                </div>
                <form className="auth-form" onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">{loc("Password")}</label>
                        <input
                            className="form-input"
                            type="password"
                            name="newpassword"
                            placeholder={loc("EnterPassword")}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{loc("ConfirmPassword")}</label>
                        <input
                            className="form-input"
                            type="password"
                            name="newpassword-2"
                            placeholder={loc("ReEnterPassword")}
                            required
                        />
                    </div>
                    
                    <button className="auth-button" type="submit">
                        <span className="auth-button-text">{loc("ResetPasswordButton")}</span>
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        {loc("RememberPassword")}
                        <a href="./login" className="auth-link">{loc("Login")}</a>
                    </p>
                </div>
            </div>
        </div>
    );
}