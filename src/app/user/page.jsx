"use client";
import { React, use } from "react";
import "react-photo-view/dist/react-photo-view.css";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import UserInfo from "../userinfo";
import { apiroot3 } from "../apiroot";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import InteractCount from "../interact";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import TheHeader from "../header";
import CoverPic from "../cover";

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
        <UserInfo apiroot={apiroot3} />
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
      {/* <UserInfoDetail/> */}
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
        if (typeof window !== "undefined") {
          document.cookie = "token=";
          //TODO should be a request that disable the token
        }
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
    apiroot3 + "/maichart/list",
    fetcher
  );
  var username = getUsername();
  if(username == undefined) {
    location.href = "/login";
  }
  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data == "" || data == undefined) return <div>failed to load</div>;

  data.sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  const dataf = data.filter((o) => o.uploader == username);

  const list = dataf.map((o) => (
    <div key={o.Id}>
      <div className="songCard">
        <CoverPic id={o.id} />
        <div className="songInfo">
          <Tippy content={o.title} singleton={tippy}>
            <div className="songTitle" id={o.id}>
              <a href={"/song?id=" + o.id}>{o.title}</a>
            </div>
          </Tippy>
          <Tippy content={o.id} singleton={tippy}>
            <div className="songArtist">{o.Id}</div>
          </Tippy>
          <Tippy content={o.uploader + "@" + o.designer} singleton={tippy}>
            <div className="songDesigner">{o.uploader + "@" + o.designer}</div>
          </Tippy>
          <Delbutton songid={o.id} />
          <InteractCount songid={o.id} />
        </div>
      </div>
    </div>
  ));
  // 渲染数据
  return (
    <>
      <div className="theList">{list}</div>
    </>
  );
}

function Delbutton({ songid }) {
  return (
    <div
      className="songLevel"
      id="lv3"
      onClick={async () => {
        let ret = confirm("真的要删除吗(不可恢复)\n(没有任何机会)");
        if (ret) {
          const formData = new FormData();
          formData.set("songid", songid);
          const response = await fetch(apiroot3 + "/Uploader/Delete", {
            method: "POST",
            body: formData,
          });
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
