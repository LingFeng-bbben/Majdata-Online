import {toast} from "react-toastify";
import axios from "axios";
import {apiroot3} from "../apiroot";
import React from "react";
import {sleep, getUsername, loc} from "../utils";

export default function AvatarUploader() {
  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("pic");

    if (!file || file.size === 0) {
      toast.error(loc("NoSelectedFile"));
      return;
    }
    const uploading = toast.loading(loc("Uploading"), {
      hideProgressBar: false,
    });
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton2").disabled = true;
      document.getElementById("submitbutton2").textContent = loc("UploadingPlzWait");
    }
    try {
      const response = await axios.post(apiroot3 + "/account/Icon", formData, {
        onUploadProgress: function (progressEvent) {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            toast.update(uploading, {progress});
          }
        },
        withCredentials: true,
      });
      toast.done(uploading);
      toast.success(response.data);
      await sleep(2000);
      window.location.reload();
    }
    catch (e) {
      toast.done(uploading);
      toast.error(e.response.data, {autoClose: false});
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton2").textContent = loc("Upload");
        document.getElementById("submitbutton2").disabled = false;
      }
      return;
    }
    finally {
      toast.done(uploading);
    }
  }

  return (
    <>
      <div className="theList">
        <img
          className="bigIcon"
          src={apiroot3 + "/account/Icon?username=" + getUsername()}
          alt=""/>
        <form className="formbox" onSubmit={onSubmit}>
          <div className="inputHint">{loc("AvatarHint")}</div>
          <input className="userinput" type="file" name="pic"/>
          <button className="pagingButton linkContent" id="submitbutton2" type="submit">
            {loc("Upload")}
          </button>
        </form>
      </div>
      <div className="hr-solid"></div>
    </>
  );
}