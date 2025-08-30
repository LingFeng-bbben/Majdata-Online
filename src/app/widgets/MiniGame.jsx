"use client";
import { Unity, useUnityContext } from "react-unity-webgl";
import React from "react";

export default function MiniGame() {
  var buildUrl = "/MiniGame"; //replace with your CDN

  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: buildUrl + "/H5.loader.js",
    dataUrl: buildUrl + "/H5.data",
    frameworkUrl: buildUrl + "/H5.framework.js",
    codeUrl: buildUrl + "/H5.wasm",
  });

  return (
    <div className={"miniGameViewPort"}>
      <Unity
        unityProvider={unityProvider}
        className="majCanvas"
        style={{ display: isLoaded ? "unset" : "none" }}
      />
      <div
        className="majPlaceHolder"
        style={{ display: isLoaded ? "none" : "block" }}
      >
        Loading MiniGame {`${(loadingProgression * 100).toFixed(2)}% ..`}
      </div>
      {/* <button onClick={()=>sendMessage("HandleJSMessages","ReceiveMessage","aaa\n"+apiroot+"\n"+songid+"\nasdasdajdalskdj\n")}>nmsl</button> */}
    </div>
  );
}
