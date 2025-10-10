"use client";
import { Unity, useUnityContext } from "react-unity-webgl";
import React, { useEffect, useRef } from "react";
import { sleep } from "../utils";

export default function Majdata({ songid, apiroot, level }) {
  var buildUrl = "/WebGLBuild"; //replace with your CDN
  const hasLoadedRef = useRef(false);

  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext({
      loaderUrl: buildUrl + "/Build.loader.js",
      dataUrl: buildUrl + "/Build.data",
      frameworkUrl: buildUrl + "/Build.framework.js",
      codeUrl: buildUrl + "/Build.wasm",
    });
  //之前的问题是每次组件渲染都会load执行一次去发送初始难度（紫谱？）
  //现在只设置一次sendMessage
  
  // 只在Unity加载完成时设置全局的sendMessage函数
  useEffect(() => {
    if (isLoaded) {
      window.unitySendMessage = sendMessage;
    }
  }, [isLoaded, sendMessage]);

  // 只在首次加载完成时调用load()
  useEffect(() => {
    async function load() {
      const httpprefix = "https://" + location.host;
      var root = apiroot;
      if (!root.startsWith("http")) {
        root = httpprefix + root;
      }
      const maichart = root + "/maichart/" + songid;
      const maidata = maichart + "/chart";
      const track = maichart + "/track";
      const bg = maichart + "/image?fullImage=true";
      const mv = maichart + "/video";
      await sleep(500);
      if (songid !== undefined && apiroot !== undefined && level !== undefined) {
        sendMessage(
          "HandleJSMessages",
          "ReceiveMessage",
          `${maidata}\n${track}\n${bg}\n${mv}\n${level}`,
        );
      }
    }

    if (isLoaded && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      load();
    }
  }, [isLoaded, songid, apiroot, level, sendMessage]);

  return (
    <div className={"majViewPort majSticky"}>
      <Unity
        unityProvider={unityProvider}
        className="majCanvas"
        style={{ display: isLoaded ? "unset" : "none" }}
      />
      <div
        className="majPlaceHolder"
        style={{ display: isLoaded ? "none" : "block" }}
      >
        Loading Majdata {`${(loadingProgression * 100).toFixed(2)}% ..`}
      </div>
      {/* <button onClick={()=>sendMessage("HandleJSMessages","ReceiveMessage","aaa\n"+apiroot+"\n"+songid+"\nasdasdajdalskdj\n")}>nmsl</button> */}
    </div>
  );
}
