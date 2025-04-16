"use client";
import React from "react";
import "react-photo-view/dist/react-photo-view.css";
import useSWR from "swr";
import { apiroot3 } from "../../apiroot";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LazyLoad from "react-lazy-load";
import { getUsername } from "../../utils";
import {UserInfo, Logout, ChartUploader, CoverPic, MajdataLogo, InteractCount, TagManageWidget} from "../../widgets"

export default function Page() {
    const [source, target] = useSingleton();
    return (
        <>
            <div className="seprate"></div>
            <MajdataLogo />
            <div className="links">
                <div className="linkContent">
                    <a href="/user">返回</a>
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
            <ChartUploader />
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
            <UploadedChartsList tippy={target} />
            <img className="footerImage" loading="lazy" src={"/bee.webp"} alt="" />
        </>
    );
}

const fetcher = (url) =>
    fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
        res.json()
    );

function UploadedChartsList({ tippy }) {
    const { data, error, isLoading } = useSWR(
        apiroot3 +
        "/maichart/list?search=uploader:" +
        encodeURIComponent(getUsername()),
        fetcher
    );
    let username = getUsername();
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
                        <div className="songLevelNoShadow" style={{ background: "green" }}>
                            <TagManageWidget songid={o.id} /></div>
                        <br/>
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
