"use client";
import React, { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import useSWR from "swr";
import Majdata from "../majdata";
import UserInfo from "../userinfo";
import { apiroot3 } from "../apiroot";
import JSZip from "jszip";
import axios from "axios";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [source, target] = useSingleton();
  const searchParams = useSearchParams();
  const param = searchParams.get("id");
  return (
    <>
      <div
        className="bg"
        style={{ backgroundImage: `url(${apiroot3}/Image/${param})` }}
      ></div>
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
          <div
            onClick={() => {
              if (typeof window !== "undefined") {
                window.history.back();
              }
            }}
          >
            返回
          </div>
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

      <Majdata />
      <Tippy
        singleton={source}
        animation="fade"
        placement="top-start"
        interactive={true}
      />
      <SongInfo id={param} tippy={target} />
      <LikeSender songid={param} />
      <CommentSender songid={param} />
      <CommentList songid={param} />
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());
function SongInfo({ id, tippy }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/SongList/" + id,
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data == "" || data == undefined) return <div>failed to load</div>;

  async function fetchFile(url, fileName) {
    var t;
    try {
      t = toast.loading("Downloading " + fileName, { hideProgressBar: false });
      var response = await axios.get(url, {
        responseType: "blob",
        onDownloadProgress: function (progressEvent) {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            toast.update(t, { progress });
          }
        },
      });
      toast.done(t);
      return response.data;
    } catch (error) {
      toast.done(t);
      return undefined;
    } finally {
      toast.done(t);
    }
  }

  function downloadFile(url, fileName) {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadSong = (props) => async () => {
    const zip = new JSZip();
    //alert(props.id)
    zip.file(
      "track.mp3",
      await fetchFile(apiroot3 + "/Track/" + props.id, "track.mp3")
    );
    zip.file(
      "bg.jpg",
      await fetchFile(apiroot3 + "/ImageFull/" + props.id, "bg.jpg")
    );
    zip.file(
      "maidata.txt",
      await fetchFile(apiroot3 + "/Maidata/" + props.id, "maidata.txt")
    );
    const video = await fetchFile(apiroot3 + "/Video/" + props.id, "bg.mp4");
    if (video != undefined) {
      zip.file("bg.mp4", video);
    }

    zip.generateAsync({ type: "blob" }).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      toast.success(props.title + "下载成功");
      downloadFile(url, props.title + ".zip");
    });
  };
  const shareSong = (props) => async () => {
    await navigator.clipboard.writeText(
      "https://majdata.net/song?id=" + props.id
    );
    toast.success("已复制到剪贴板", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const o = data;
  return (
    <div className="theList">
      <div className="songCard">
        <CoverPic id={o.id} />
        <div className="songInfo">
          <Tippy content={o.title} singleton={tippy}>
            <div className="songTitle" id={o.id}>
              {o.title}
            </div>
          </Tippy>
          <Tippy content={o.artist} singleton={tippy}>
            <div className="songArtist">
              {o.artist == "" || o.artist == null ? "-" : o.artist}
            </div>
          </Tippy>
          <Tippy content={o.uploader + "@" + o.designer} singleton={tippy}>
            <div className="songDesigner">{o.uploader + "@" + o.designer}</div>
          </Tippy>

          <Levels levels={o.levels} songid={o.id} />
          <br />
          <div
            className="songLevel downloadButtonBox"
            onClick={shareSong({ id: o.id })}
          >
            <svg
              className="shareButton"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
            </svg>
          </div>
          <div
            className="songLevel downloadButtonBox"
            onClick={downloadSong({ id: o.id, title: o.title })}
          >
            <svg
              className="downloadButton"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="uploadDate">
        {new Date(o.timestamp * 1000).toLocaleString()}
      </div>
    </div>
  );
}

function CoverPic({ id }) {
  let url = apiroot3 + `/Image/${id}`;
  let urlfull = apiroot3 + `/ImageFull/${id}`;
  return (
    <>
      <PhotoProvider
        bannerVisible={false}
        loadingElement={<div className="loading"></div>}
      >
        <PhotoView src={urlfull}>
          <img className="songImg" loading="lazy" src={url} alt="" />
        </PhotoView>
      </PhotoProvider>
      {/* <div className='songid'>{id}</div> */}
    </>
  );
}

function Levels({ levels, songid }) {
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] == null) {
      levels[i] = "-";
    }
  }
  const scrollToTop = () => {
    let sTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (sTop > 0.1) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, sTop - sTop / 9);
    }
  };

  const levelClickCallback = (e) => {
    scrollToTop();
    window.unitySendMessage(
      "HandleJSMessages",
      "ReceiveMessage",
      "jsnmsl\n" + apiroot3 + "\n" + songid + "\n" + e.target.id
    );
  };
  return (
    <div>
      <div
        className="songLevel"
        id="lv0"
        style={{ display: levels[0] == "-" ? "none" : "unset" }}
        onClick={levelClickCallback}
      >
        {levels[0]}
      </div>
      <div
        className="songLevel"
        id="lv1"
        style={{ display: levels[1] == "-" ? "none" : "unset" }}
        onClick={levelClickCallback}
      >
        {levels[1]}
      </div>
      <div
        className="songLevel"
        id="lv2"
        style={{ display: levels[2] == "-" ? "none" : "unset" }}
        onClick={levelClickCallback}
      >
        {levels[2]}
      </div>
      <div
        className="songLevel"
        id="lv3"
        style={{ display: levels[3] == "-" ? "none" : "unset" }}
        onClick={levelClickCallback}
      >
        {levels[3]}
      </div>
      <div
        className="songLevel"
        id="lv4"
        style={{ display: levels[4] == "-" ? "none" : "unset" }}
        onClick={levelClickCallback}
      >
        {levels[4]}
      </div>
      <div
        className="songLevel"
        id="lv5"
        style={{ display: levels[5] == "-" ? "none" : "unset" }}
        onClick={levelClickCallback}
      >
        {levels[5]}
      </div>
      <div
        className="songLevel"
        id="lv6"
        style={{ display: levels[6] == "-" ? "none" : "unset" }}
        onClick={levelClickCallback}
      >
        {levels[6]}
      </div>
    </div>
  );
}

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

function LikeSender({ songid }) {
  const { data, error, isLoading, mutate } = useSWR(
    apiroot3 + "/Interact/" + songid,
    fetcher
  );
  if (error) return <div>..?</div>;
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data == "" || data == undefined) return <div>failed to load</div>;
  const likecount = data.LikeList.length;
  var playcount = data.PlayCount;
  if (playcount == undefined) {
    playcount = 0;
  }
  const onSubmit = async () => {
    const formData = new FormData();
    formData.set("token", getCookie("token"));
    formData.set("type", "like");
    formData.set("content", "like");
    const response = await fetch(apiroot3 + "/Interact/" + songid, {
      method: "POST",
      body: formData,
    });
    if (response.status == 200) {
      toast.success("点赞成功");
      mutate();
    } else if (response.status == 400) {
      toast.error("点赞失败：登录了吗？");
    } else {
      toast.error("点赞失败：登录了吗？");
    }
  };
  return (
    <>
      <div className="theList">
        <button
          className="linkContent"
          id="submitbuttonlike"
          type="button"
          onClick={onSubmit}
        >
          <svg
            className="commentIco"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            style={{ width: "24px", height: "24px" }}
          >
            <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
          </svg>
        </button>
        <p>{likecount}</p>
        <svg
          className="commentIco"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          style={{ width: "24px", height: "24px", margin: "15px" }}
        >
          <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
        <p>{playcount}</p>
      </div>
      <div className="theList">
        {data.LikeList.map((o) => (
          <p key={o}>{o}</p>
        ))}
      </div>
    </>
  );
}

function CommentSender({ songid }) {
  const [comment, SetCommnet] = useState("");
  const onSubmit = async () => {
    const formData = new FormData();
    if (comment == "") {
      toast.error("说点什么吧？");
      return;
    }

    formData.set("token", getCookie("token"));
    formData.set("type", "comment");
    formData.set("content", comment);

    if (typeof window !== "undefined") {
      document.getElementById("submitbutton").disabled = true;
      document.getElementById("submitbutton").textContent = "请稍后";
    }
    const sending = toast.loading("正在邮件轰炸...");
    const response = await fetch(apiroot3 + "/Interact/" + songid, {
      method: "POST",
      body: formData,
    });
    toast.done(sending);
    if (response.status == 200) {
      toast.success("评论成功");
      if (typeof window !== "undefined") {
        document.getElementById("commentcontent").value = "";
        SetCommnet("");
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
        <p className="inputHint">评论</p>
      </div>
      <div className="theList">
        <textarea
          id="commentcontent"
          className="userinput commentbox"
          type="text"
          onChange={() => SetCommnet(event.target.value)}
        />
      </div>
      <div className="theList">
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

function CommentList({ songid }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/Interact/" + songid,
    fetcher,
    { refreshInterval: 3000 }
  );
  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data == "" || data == undefined) return <div>failed to load</div>;
  const commentList = Object.entries(data.CommentsList).reverse();
  console.log(commentList);
  const objlist = commentList.map((o) => (
    <div key={o[0]}>
      <div className="CommentCard">
        <p className="CommentUser">{o[0]}</p>
        <p className="CommentContent">{o[1]}</p>
      </div>
    </div>
  ));
  return <div className="theList">{objlist}</div>;
}
