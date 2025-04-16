"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import md5 from "js-md5";
import { useRouter } from "next/navigation";
import { apiroot3 } from "../apiroot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MajdataLogo from "../widgets/MajdataLogo";

export default function Page() {
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
          <a href="../">返回</a>
        </div>
        <div className="linkContent">
          <a href="./login">登录</a>
        </div>
        <div className="linkContent">
          <a href="./register">注册</a>
        </div>
      </div>

      <Register />
    </>
  );
}

function Register() {
  const router = useRouter();
  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (formData.get("password") != formData.get("password2")) {
      toast.error("密码不一致");
      return;
    }
    formData.set("password", md5(formData.get("password")));
    const response = await fetch(apiroot3 + "/account/Register", {
      method: "POST",
      body: formData,
    });
    if (response.status != 200) {
      if (response.status == 400) {
        toast.error("缺少必填项目");
        return;
      }
      toast.error("response.text()");
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
        <div className="inputHint">用户名</div>
        <input className="userinput" type="text" name="username" />
        <div className="inputHint">密码</div>
        <input className="userinput" type="password" name="password" />
        <div className="inputHint">确认密码</div>
        <input className="userinput" type="password" name="password2" />
        <div className="inputHint">邮箱</div>
        <input className="userinput" type="email" name="email" />
        <div className="inputHint">邀请码</div>
        <input className="userinput" type="text" name="invitecode" />
        <button className="linkContent" type="submit">
          确定
        </button>
      </form>
    </div>
  );
}
