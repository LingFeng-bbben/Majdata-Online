"use client";
import { Unity, useUnityContext } from "react-unity-webgl";
import React from "react";
import { sleep } from "../utils";

export default function Majdata({ songid, apiroot, level }) {
  var buildUrl = "/WebGLBuild"; //replace with your CDN

  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext({
      loaderUrl: buildUrl + "/Build.loader.js",
      dataUrl: buildUrl + "/Build.data",
      frameworkUrl: buildUrl + "/Build.framework.js",
      codeUrl: buildUrl + "/Build.wasm",
    });

  if (isLoaded) {
    window.unitySendMessage = sendMessage;
    load()
  }

  async function load() {
    const maichart = apiroot + "/maichart/" + songid;
    const maidata = maichart + "/chart";
    const track = maichart + "/track";
    const bg = maichart + "/image?fullImage=true";
    const mv = maichart + "/video";
    await sleep(500)
    if (songid !== undefined && apiroot !== undefined && level !== undefined) {
      sendMessage(
        "HandleJSMessages",
        "ReceiveMessage",
        `${maidata}\n${track}\n${bg}\n${mv}\n${level}`
      )
    }
  }

  return (
    <div className={"majViewPort"}>
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
