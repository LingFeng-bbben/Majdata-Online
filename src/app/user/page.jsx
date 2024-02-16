"use client";
import { React } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
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

export default function Page() {
  const [source, target] = useSingleton();
  if(getCookie("token")==""){
    if (typeof window !== "undefined") {
    location.href="/login"
    }
    return (<p>请先登录</p>);
  }
  return (
    <>
      <div className="seprate"></div>
      <h1>
        <img
          className="xxlb"
          src="./salt.webp"
          onClick={() => alert("不要点我 操你妈")}
        ></img>
        Majdata.Net
      </h1>
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

//const fetcher = (...args) => fetch(...args).then((res) => res.json())

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

// function UserInfoDetail(){
//   const router = useRouter()
//   const token = getCookie('token')
//   if(token=='') router.push('./login')
//   const { data, error, isLoading } = useSWR(apiroot + "/User/Info/" + token, fetcher);
//   if(error) return <div className='linkContent'><a href='./login'>error</a></div>
//   if(isLoading) return <div className='linkContent'><a href='./login'>...</a></div>
//   return (<>
//     {/* <div>{data.Username}</div>
//     <div>{data.Email}</div> */}
//   </>
//   )
// }

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
  const router = useRouter();
  
  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const uploading = toast.loading("正在爆速上传...")
    formData.set("token", getCookie("token"));
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton").disabled = true;
      document.getElementById("submitbutton").textContent = "上传中啦等一会啦";
    }
    const response = await fetch(apiroot3 + "/Uploader/Chart", {
      method: "POST",
      body: formData,
    });
    toast.done(uploading);
    if (response.status != 200) {
      toast.error(await response.text(),{autoClose: false});
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton").textContent = "上传";
        document.getElementById("submitbutton").disabled = false;
      }
      return;
    }
    toast.success("上传成功");
    router.push("../");
  }
  return (
    <div className="theList">
      <form className="formbox" onSubmit={onSubmit}>
        <div className="inputHint">maidata</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">bg</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">track</div>
        <input className="userinput" type="file" name="formfiles" />
        <button className="linkContent" id="submitbutton" type="submit">
          上传
        </button>
      </form>
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
          <img className="songImg" src={url} alt="" />
        </PhotoView>
      </PhotoProvider>
      {/* <div className='songId'>{id}</div> */}
    </>
  );
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function getUsername() {
  const token = getCookie("token");
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/User/Info/" + token,
    fetcher
  );
  if (error) return "";
  if (isLoading) return "";
  return data.Username;
}

function TheList({ tippy }) {
  const { data, error, isLoading } = useSWR(apiroot3 + "/SongList", fetcher);
  var username = getUsername();
  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data == "" || data == undefined) return <div>failed to load</div>;

  data.sort((a, b) => {
    return b.Timestamp - a.Timestamp;
  });

  const dataf = data.filter((o) => o.Uploader == username);

  const list = dataf.map((o) => (
    <div key={o.Id}>
      <div className="songCard">
        <CoverPic id={o.Id} />
        <div className="songInfo">
          <Tippy content={o.Title} singleton={tippy}>
            <div className="songTitle" id={o.Id}>
              <a href={"/song?id=" + o.Id}>{o.Title}</a>
            </div>
          </Tippy>
          <Tippy content={o.Id} singleton={tippy}>
            <div className="songArtist">{o.Id}</div>
          </Tippy>
          <Tippy content={o.Uploader + "@" + o.Designer} singleton={tippy}>
            <div className="songDesigner">{o.Uploader + "@" + o.Designer}</div>
          </Tippy>
          <Delbutton songid={o.Id} />
          <InteractCount songid={o.Id} />
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
          formData.set("token", getCookie("token"));
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
