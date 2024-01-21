"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserInfo from "../userinfo";
import { apiroot3 } from "../apiroot";
import useSWR from "swr";

export default function Page() {
    const [pages, setPages] = useState([0])
    const addPage = ()=>{
        setPages([...pages,pages.length]);
    }
    return (
      <>
        <div className="seprate"></div>
        <h1>
          <img
            className="xxlb"
            src="./salt.webp"
            onClick={() =>
              toast.error("不要点我 操你妈", {
                position: "top-center",
                autoClose: 500,
              })
            }
          ></img>
          Majdata.Net
        </h1>
        <div className="links">
          <div className="linkContent">
            <a href="./">返回</a>
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
          {/* <div className='linkContent'><a href='./contest'>MMFC 6th</a></div> */}
          <UserInfo apiroot={apiroot3} />
        </div>
        <CommentSender />
        {pages.map(((o) => 
            <CommentList key={o} page={o}/>
        ))}
        
        <div className="theList"><button
            className="linkContent"
            id="submitbutton"
            type="button"
            style={{width:"100px",margin:"auto"}}
            onClick={addPage}
          >
            下一页
          </button></div>
        
      </>
    );
  }

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  function getCookie(cname) {
    let name = cname + "=";
    if (typeof window !== "undefined") {
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
    }
    return "";
  }

  function CommentSender() {
    const [comment, SetCommnet] = useState("");
    const onSubmit = async () => {
      const formData = new FormData();
      if(comment==""){
        toast.error("说点什么吧？");
        return;
      }
        
      formData.set("token", getCookie("token"));
      formData.set("content", comment);
  
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton").disabled = true;
        document.getElementById("submitbutton").textContent = "请稍后";
      }
      const sending = toast.loading("正在dydy...");
      const response = await fetch(apiroot3 + "/dydy" , {
        method: "POST",
        body: formData,
      });
      toast.done(sending)
      if (response.status == 200) {
        toast.success("评论成功");
        if (typeof window !== "undefined") {
          document.getElementById("commentcontent").value = "";
          SetCommnet("")
        }
      } else if (response.status == 400) {
        toast.error("评论失败：登录了吗？");
      } else {
        toast.error("评论失败：登录了吗？");
      }
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton").disabled = false;
        document.getElementById("submitbutton").textContent = "发表";
      }
      
    };
    return (
      <>
        <div className="theList">
          <p className="inputHint">DYDY 公告板</p>
        </div>
        <div className="theList">
          <textarea
            id="commentcontent"
            className="userinput commentbox"
            type="text"
            onChange={() => SetCommnet(event.target.value)}
          />
          <button
            className="linkContent"
            id="submitbutton"
            type="button"
            onClick={onSubmit}
          >
            发表
          </button>
        </div>
      </>
    );
  }

  function CommentList({ page }) {
    const { data, error, isLoading } = useSWR(
      apiroot3 + "/dydy/" + page,
      fetcher,
      { refreshInterval: 3000 }
    );
    if (error) return <p>没啦</p>;
    if (isLoading) {
      return <div className="loading"></div>;
    }
    if (data == "" || data == undefined) return <p>没啦</p>;
    const objlist = data.map((o) => (
      <div key={o.Key}>
        <div className="CommentCard">
          <p className="CommentUser">{o.Key}</p>
          <p className="CommentContent">{o.Value}</p>
        </div>
      </div>
    ));
    return <div className="theList">{objlist}</div>;
  }