
'use client'
import { Unity, useUnityContext } from "react-unity-webgl";
import React from 'react';

export default function Majdata() {
    var buildUrl = "/WebGLBuild"; //replace with your CDN
  
    const { unityProvider, isLoaded, loadingProgression , sendMessage  } = useUnityContext({
      loaderUrl: buildUrl + "/Build.loader.js",
      dataUrl: buildUrl + "/Build.data",
      frameworkUrl: buildUrl + "/Build.framework.js",
      codeUrl: buildUrl + "/Build.wasm",
    });
  
    if(isLoaded){
      //alert("loaded");
      window.unitySendMessage = sendMessage
      
    }
    
    return (
        <div className={'majViewPort'}>
          <Unity unityProvider={unityProvider} className="majCanvas" style={{ display: isLoaded ? "unset" : "none" }}/>
          <div className='majPlaceHolder' style={{ display: isLoaded ? "none" : "block" }}>Loading Majdata {`${(loadingProgression * 100).toFixed(2)}% ..`}</div>
          {/* <button onClick={()=>sendMessage("HandleJSMessages","ReceiveMessage","aaa\n"+apiroot+"\n"+songid+"\nasdasdajdalskdj\n")}>nmsl</button> */}
        </div>
      );
    
  }