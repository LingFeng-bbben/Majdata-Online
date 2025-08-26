"use client";
import React, {useEffect, useState} from "react";
import "react-photo-view/dist/react-photo-view.css";
import md5 from "js-md5";
import { useRouter } from "next/navigation";
import { apiroot3 } from "../apiroot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {setLanguage, loc} from "../utils";
import {LanguageSelector, MajdataLogo} from "../widgets";

export default function Page() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setLanguage(localStorage.getItem("language")||navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return <div className="loading"></div>;
  return (
    <>
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
      <div className="seprate"></div>
      <MajdataLogo />
      <div className="links">
        <div className="linkContent">
          <a href="/">{loc("HomePage")}</a>
        </div>
        <div className="linkContent">
          <a href="./login">{loc("Login")}</a>
        </div>
        <div className="linkContent">
          <a href="./register">{loc("Register")}</a>
        </div>
      </div>

      <Register />
      <LanguageSelector />
    </>
  );
}

function Register() {
  const router = useRouter();
  async function onSubmit(event) {
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
      if (response.status === 400) {
        const data = await response.json()
        toast.error(data.message);
        return;
      }
      toast.error(await response.text());
      return;
    } else {
      router.push("/login");
    }

    // Handle response if necessary
    //const data = await response.json()
    // ...
  }
  return (
    <div className="theList">
      <form className="formbox" onSubmit={onSubmit}>
        <div className="inputHint">{loc("Username")}</div>
        <input className="userinput" type="text" name="username" />
        <div className="inputHint">{loc("Password")}</div>
        <input className="userinput" type="password" name="password" />
        <div className="inputHint">{loc("ConfirmPassword")}</div>
        <input className="userinput" type="password" name="password2" />
        <div className="inputHint">{loc("E-Mail")}</div>
        <input className="userinput" type="email" name="email" />
        <div className="inputHint">{loc("Invite Code")}</div>
        <input className="userinput" type="text" name="invitecode" />
        <button className="linkContent" type="submit">
          {loc("Register")}
        </button>
      </form>
    </div>
  );
}
