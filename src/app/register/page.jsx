"use client";
import React, { useEffect, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import md5 from "js-md5";
//import { useRouter } from "next/navigation";
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
        { href: "./login", label: loc("Login") },
        { href: "./register", label: loc("Register"), featured: true },
    ];

    return (
        <PageLayout
            navigationItems={navigationItems}
            className="auth-page"
        >
            <Register />
        </PageLayout>
    );
}

function Register() {
    //const router = useRouter();
    const [isPosting, setIsPosting] = useState(false);
    async function onSubmit(event) {
        setIsPosting(true)
        try {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            if (formData.get("password") !== formData.get("password2")) {
                toast.error(loc("PasswdNoMatch"));
                return;
            }
            formData.set("password", md5(formData.get("password")));
            const response = await fetch(apiroot3 + "/account/Register", {
                method: "POST",
                body: formData,
            });
            if (response.status !== 200) {
                const rsp = await response.json();
                if (response.status === 400) {
                    switch (rsp.code) {
                        case retCode.CODE_INVALID_INVITE_CODE:
                            toast.error(loc("InvalidInviteCode"));
                            break;
                        case retCode.CODE_INVALID_VALUE:
                            toast.error(loc("InvalidUsernameOrPassword"));
                            break;
                        case retCode.CODE_INVALID_EMAIL_ADDRESS:
                            toast.error(loc("InvalidEmail"));
                            break;
                        case retCode.CODE_USERNAME_ALREADY_EXISTS:
                            toast.error(loc("UsernameExists"));
                            break;
                        case retCode.CODE_EMAIL_ALREADY_EXISTS:
                            toast.error(loc("EmailExists"));
                            break;
                        default:
                            toast.error(loc("VerificationFailed")+rsp.message);
                            break;
                    }
                    return;
                }
                toast.error(await response.text());
                return;
            } else {
                toast.success(loc("[Register]EmailSent"),{autoClose:false});
                //router.push("/login");
            }

            // Handle response if necessary
            //const data = await response.json()
            // ...
        }
        finally {
            setIsPosting(false)
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">{loc("CreateAccount")}</h2>
                    <p className="auth-subtitle">{loc("RegisterSubtitle")}</p>
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
                        <label className="form-label">{loc("Password")}</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            placeholder={loc("EnterPassword")}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{loc("ConfirmPassword")}</label>
                        <input
                            className="form-input"
                            type="password"
                            name="password2"
                            placeholder={loc("ReEnterPassword")}
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
                    <div className="form-group">
                        <script
                            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                            async
                            defer
                        ></script>  
                    <div className="cf-turnstile" data-sitekey="0x4AAAAAACAEyA1EhHmEDS0o"></div>
                    </div>
                    <button className="auth-button" type="submit" disabled={isPosting}>
                        <span className="auth-button-text">{loc("Register")}</span>
                    </button>
                </form>
                <div className="auth-footer">
                    <p>
                        {loc("AlreadyHaveAccount")} <a href="./login" className="auth-link">{loc("LoginNow")}</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
