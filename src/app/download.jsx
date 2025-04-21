"use client";
import { apiroot3 } from "./apiroot";
import JSZip from "jszip";
import axios from "axios";

async function fetchFile(url, fileName, toast) {
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

export async function downloadSong(props) {
  const zip = new JSZip();

  const track = await fetchFile(
    apiroot3 + "/maichart/" + props.id + "/track",
    "track.mp3",
    props.toast
  );

  if(track == undefined) {
    props.toast.error(props.title + "下载失败");
    return;
  }

  const bg = await fetchFile(
    apiroot3 + "/maichart/" + props.id + "/image?fullImage=true",
    "bg",
    props.toast
  );

  if(bg == undefined) {
    props.toast.error(props.title + "下载失败");
    return;
  }

  const maidata = await fetchFile(
    apiroot3 + "/maichart/" + props.id + "/chart",
    "maidata",
    props.toast
  );

  if(maidata == undefined) {
    props.toast.error(props.title + "下载失败");
    return;
  }

  const video = await fetchFile(
    apiroot3 + "/maichart/" + props.id + "/video",
    "bg.mp4",
    props.toast
  );

  zip.file("track.mp3", track);
  zip.file("bg.jpg", bg);
  zip.file("maidata.txt", maidata);
  
  

  if (video != undefined) {
    zip.file("pv.mp4", video);
  }
  var downloadExtension = localStorage.getItem("DownloadType")
  if(downloadExtension == undefined) {
    downloadExtension = "zip"
  }

  zip.generateAsync({ type: "blob" }).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    props.toast.success(props.title + "下载成功");
    downloadFile(url, props.title + "." + downloadExtension);
  });
}
