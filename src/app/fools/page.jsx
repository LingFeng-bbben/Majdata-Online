"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { apiroot3 } from "../apiroot";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TheHeader from "../header";
import LazyLoad from "react-lazy-load";
import CoverPic from "../cover";
import useSWR from "swr";

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
      <TheHeader toast={toast} />
      <div className="links">
        <div className="linkContent">
          <a href="../">返回</a>
        </div>
      </div>
      <PhotoProvider
        bannerVisible={false}
        loadingElement={<div className="loading"></div>}
      >
        <div className="theList">
          <PhotoView src="/fools/SP7合集.png">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/SP7合集.png"
              alt=""
            />
          </PhotoView>
          <SongList search="6bbacd0b-61c6-49e7-81a0-575939b502c6" />
          <SongList search="19f9dac6-507b-4285-9d15-c96bba9b67c5" />
          <SongList search="dede3cba-a282-46f7-b1f2-5b06f1185375" />
          <SongList search="91610b7d-568f-4856-b560-ca82e6516ec9" />
          <PhotoView src="/fools/王耑.jpg">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/王耑.jpg"
              alt=""
            />
          </PhotoView>
          <SongList search="0401e48c-a570-47a3-ad6e-c76a27b2f723" />
          <PhotoView src="/fools/lushan合集.jpg">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/lushan合集.jpg"
              alt=""
            />
          </PhotoView>
          <SongList search="5aa5b00c-7d43-411c-9269-b49ea91e1f44" />
          <SongList search="ab98c05b-26aa-4a03-8255-4c6fa784a043" />
          <SongList search="99b4a92d-c5b9-4022-b956-538024541ca6" />
          <PhotoView src="/fools/你几把多长.png">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/你几把多长.png"
              alt=""
            />
          </PhotoView>
          <SongList search="a9f5b322-68cc-48e5-8877-4c982c0e94f1" />
          <PhotoView src="/fools/柠檬茶合集.jpg">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/柠檬茶合集.jpg"
              alt=""
            />
          </PhotoView>
          <SongList search="b51a7c3b-8c1c-4959-866b-90a136d8fcf1" />
          <SongList search="a875f6f4-ee29-46fe-b059-98d62d95be2d" />
          <SongList search="fa0c20cb-d4dc-4f17-88a2-762417a637bc" />
          <PhotoView src="/fools/火力种田王.jpg">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/火力种田王.jpg"
              alt=""
            />
          </PhotoView>
          <SongList search="03737382-350d-4740-88fe-6ab53c3a7039" />
          <PhotoView src="/fools/哈姆太郎.png">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/哈姆太郎.png"
              alt=""
            />
          </PhotoView>
          <SongList search="哈姆太郎" />
          <PhotoView src="/fools/200号.jpg">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/200号.jpg"
              alt=""
            />
          </PhotoView>
          <SongList search="c48b1530-4edd-406e-9dc6-bd7d07f532e3" />
          <PhotoView src="/fools/夜梨.jpg">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/夜梨.jpg"
              alt=""
            />
          </PhotoView>
          <SongList search="4690fb44-ff60-4cf1-aadb-0ad997c262b7" />
          <PhotoView src="/fools/reflectW.png">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/reflectW.png"
              alt=""
            />
          </PhotoView>
          <SongList search="8127dc4c-8682-427c-b7a3-f958e3503edb" />
          <PhotoView src="/fools/国家队.jpg">
            <img
              width="100%"
              className="songImg"
              loading="lazy"
              src="/fools/国家队.jpg"
              alt=""
            />
          </PhotoView>
          <SongList search="Random(" />
        </div>
      </PhotoProvider>
    </>
  );
}

const fetcher = async (...args) =>
  await fetch(...args).then(async (res) => res.json());

function SongList({ search }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/list?&page=0&search=" + encodeURIComponent(search),
    fetcher
  );
  if (error) return <div className="notReady">已闭店</div>;
  if (isLoading) {
    return (
      <>
        <div className="loading"></div>
      </>
    );
  }
  const list = data.map((o) => (
    <div key={o.id} id={o.id}>
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          <CoverPic id={o.id} />
          <div className="songInfo">
            <div className="songTitle" id={o.id}>
              <a href={"/song?id=" + o.id}>{o.title}</a>
            </div>

            <div className="songArtist">
              <a href={"/song?id=" + o.id}>
                {o.artist == "" || o.artist == null ? "-" : o.artist}
              </a>
            </div>

            <div className="songDesigner">
              <a href={"/song?id=" + o.Id}>{o.uploader + "@" + o.designer}</a>
            </div>

            <br />
          </div>
        </div>
      </LazyLoad>
    </div>
  ));
  return list;
}
