"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import UserInfo from "../widgets/UserInfo";
import { apiroot3 } from "../apiroot";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import InteractCount from "../widgets/InteractCount";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import TheHeader from "../widgets/TheHeader";
import CoverPic from "../widgets/CoverPic";
import LazyLoad from "react-lazy-load";

export default function Page() {
  const [source, target] = useSingleton();
  return (
    <>
      <div className="seprate"></div>
      <TheHeader toast={toast} />
      <div className="links">
        <div className="linkContent">
          <a href="../">返回</a>
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
      <IconUploader />
      <IntroUploader username={getUsername()} />
      <h1>谱面上传</h1>
      <p>在这里上传你的谱面。点击上传即代表你承认以下事项：</p>
      <p>1. 上传的谱面是你自己写的或合作写的，又或是谱面原作者同意上传</p>
      <p>2. 此谱面可以公开，自由下载</p>
      <p>3. 公开这张谱面不会侵害第三方权益</p>
      <p>
        4. 这张谱面至少可以被一种编辑器读取：majdata/maipad/astrodx/simai 等
      </p>
      <p>
        一些tips：如果谱面太长请标上[FULL], 如果是宴谱/观赏谱请写入Original难度
      </p>
      <Uploader />
      <Tippy
        singleton={source}
        animation="fade"
        placement="top-start"
        interactive={true}
      />
      <h1>谱面管理</h1>
      <p>
        点击x删除谱面哟
      </p>
      <TheList tippy={target} />
      <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
    </>
  );
}

function Logout() {
  const router = useRouter();
  return (
    <div
      className="linkContent"
      onClick={() => {
        fetch(apiroot3 + "/account/Logout", {
          method: "POST",
          mode: "cors",
          credentials: "include",
        });
        router.push("./login");
      }}
    >
      登出
    </div>
  );
}

function Uploader() {
  //const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const filesNecessary = formData.getAll("formfiles");

    const fileChecks = [
      { file: filesNecessary[0], name: "maidata.txt" },
      { file: filesNecessary[1], name: "bg.png/bg.jpg" },
      { file: filesNecessary[2], name: "track" },
    ];

    let missedFiles = [];

    for (const { file, name } of fileChecks) {
      if (!file || file.name === "" || file.size === 0) {
        missedFiles.push(name);
      }
    }

    if (missedFiles.length > 0) {
      for (const file of missedFiles) {
        toast.error("没有选中" + file)
      }
      return;
    }

    const uploading = toast.loading("正在爆速上传...", {
      hideProgressBar: false,
    });
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton").disabled = true;
      document.getElementById("submitbutton").textContent = "上传中啦等一会啦";
    }
    try {
      const response = await axios.post(
        apiroot3 + "/maichart/upload",
        formData,
        {
          onUploadProgress: function (progressEvent) {
            if (progressEvent.lengthComputable) {
              const progress = progressEvent.loaded / progressEvent.total;
              toast.update(uploading, { progress });
            }
          },
          withCredentials: true,
        }
      );
      toast.done(uploading);
      toast.success(response.data);
      await sleep(2000);
      window.location.reload();
    } catch (e) {
      toast.done(uploading);
      toast.error(e.response.data, { autoClose: false });
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton").textContent = "上传";
        document.getElementById("submitbutton").disabled = false;
      }
      return;
    } finally {
      toast.done(uploading);
    }

    // router.push("../");
  }
  return (
    <div className="theList">
      <form className="formbox" onSubmit={onSubmit}>
        <div className="inputHint">maidata</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">bg.png/bg.jpg</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">track</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">bg.mp4/pv.mp4(可选,限20M内)</div>
        <input className="userinput" type="file" name="formfiles" />
        <button className="linkContent" id="submitbutton" type="submit">
          上传
        </button>
      </form>
    </div>
  );
}

function IconUploader() {
  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("pic");

    if (!file || file.size === 0) {
      toast.error("你还没有选择文件哦！");
      return;
    }
    const uploading = toast.loading("正在爆速上传...", {
      hideProgressBar: false,
    });
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton2").disabled = true;
      document.getElementById("submitbutton2").textContent = "上传中啦等一会啦";
    }
    try {
      const response = await axios.post(apiroot3 + "/account/Icon", formData, {
        onUploadProgress: function (progressEvent) {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            toast.update(uploading, { progress });
          }
        },
        withCredentials: true,
      });
      toast.done(uploading);
      toast.success(response.data);
      await sleep(2000);
      window.location.reload();
    } catch (e) {
      toast.done(uploading);
      toast.error(e.response.data, { autoClose: false });
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton2").textContent = "上传";
        document.getElementById("submitbutton2").disabled = false;
      }
      return;
    } finally {
      toast.done(uploading);
    }
  }
  return (
    <div className="theList">
      <img
        className="bigIcon"
        src={apiroot3 + "/account/Icon?username=" + getUsername()}
       alt=""/>
      <form className="formbox" onSubmit={onSubmit}>
        <div className="inputHint">头像 (5M之内)</div>
        <input className="userinput" type="file" name="pic" />
        <button className="linkContent" id="submitbutton2" type="submit">
          上传
        </button>
      </form>
    </div>
  );
}

function IntroUploader({ username }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/account/intro?username=" + encodeURIComponent(username),
    fetcher
  );

  if (error) {
    return undefined;
  }
  if (isLoading) return <div className="loading"></div>;

  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const content = formData.get("content");
    if (!content || content.trim() === "") {
      toast.error("你还没有填写自我介绍哦");
      return;
    }
    const uploading = toast.loading("正在爆速上传...", {
      hideProgressBar: false,
    });
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton3").disabled = true;
      document.getElementById("submitbutton3").textContent = "上传中啦等一会啦";
    }
    try {
      const response = await axios.post(apiroot3 + "/account/intro", formData, {
        onUploadProgress: function (progressEvent) {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            toast.update(uploading, { progress });
          }
        },
        withCredentials: true,
      });
      toast.done(uploading);
      toast.success(response.data);
      await sleep(2000);
      window.location.reload();
    } catch (e) {
      toast.done(uploading);
      toast.error(e.response.data, { autoClose: false });
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton3").textContent = "上传";
        document.getElementById("submitbutton3").disabled = false;
      }
      return;
    } finally {
      toast.done(uploading);
    }
  }

  return (
    <div className="theList">
      <form className="introbox" onSubmit={onSubmit}>
        <div className="inputHint">自我介绍 (支持Markdown)</div>
        <textarea
          className="userinput introbox-inner"
          name="content"
          id="IntroBox"
          defaultValue={data.introduction}
        >
        </textarea>

        <button className="linkContent" id="submitbutton3" type="submit">
          上传
        </button>
      </form>
    </div>
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetcher = (url) =>
  fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
    res.json()
  );

function getUsername() {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/account/info/",
    fetcher
  );
  if (error) {
    return undefined;
  }
  if (isLoading) return "";
  return data.Username;
}

function TheList({ tippy }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 +
      "/maichart/list?search=uploader:" +
      encodeURIComponent(getUsername()),
    fetcher
  );
  var username = getUsername();
  if (username == undefined) {
    if (typeof window !== "undefined") location.href = "/login";
  }
  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data == "" || data == undefined)
    return <div className="notReady">空的哟，先上传一些吧！</div>;

  const list = data.map((o) => (
    <div key={o.id}>
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          <CoverPic id={o.id} />
          <div className="songInfo">
            <Tippy content={o.title} singleton={tippy}>
              <div className="songTitle" id={o.id}>
                <a href={"/song?id=" + o.id}>{o.title}</a>
              </div>
            </Tippy>
            <Tippy content={o.id} singleton={tippy}>
              <div className="songArtist">{o.id}</div>
            </Tippy>
            <Tippy content={o.uploader + "@" + o.designer} singleton={tippy}>
              <div className="songDesigner">
                {o.uploader + "@" + o.designer}
              </div>
            </Tippy>
            <Delbutton songid={o.id} />
            <br />
            <div className="commentBox downloadButtonBox">
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
            <InteractCount songid={o.id} />
          </div>
        </div>
      </LazyLoad>
    </div>
  ));
  // 渲染数据
  return <div className="theList">{list}</div>;
}

function Delbutton({ songid }) {
  return (
    <div
      className="songLevel"
      id="lv3"
      onClick={async () => {
        let ret = confirm("真的要删除吗(不可恢复)\n(没有任何机会)");
        if (ret) {
          const response = await fetch(
            apiroot3 + "/maichart/delete?chartId=" + songid,
            {
              method: "POST",
              mode: "cors",
              credentials: "include",
            }
          );
          if (response.status != 200) {
            alert(await response.text());
            return;
          }
          alert("删除成功");
          if (typeof window !== "undefined") location.reload();
        }
      }}
    >
      X
    </div>
  );
}
