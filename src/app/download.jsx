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
  zip.file(
    "track.mp3",
    await fetchFile(
      apiroot3 + "/maichart/" + props.id + "/track",
      "track.mp3",
      props.toast
    )
  );
  zip.file(
    "bg.jpg",
    await fetchFile(
      apiroot3 + "/maichart/" + props.id + "/image",
      "bg",
      props.toast
    )
  );
  zip.file(
    "maidata.txt",
    await fetchFile(
      apiroot3 + "/maichart/" + props.id + "/chart",
      "maidata",
      props.toast
    )
  );
  const video = await fetchFile(
    apiroot3 + "/maichart/" + props.id + "/video",
    "bg.mp4", props.toast
  );
  if (video != undefined) {
    zip.file("bg.mp4", video);
  }

  zip.generateAsync({ type: "blob" }).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    props.toast.success(props.title + "下载成功");
    downloadFile(url, props.title + ".zip");
  });
}
