import { toast } from "react-toastify";
import axios from "axios";
import { apiroot3 } from "../apiroot";
import { loc } from "../utils";
import sleep from "../utils/sleep";
import React from "react";

export default function ChartUploader() {
  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const filesNecessary = formData.getAll("formfiles");

    const fileChecks = [
      { file: filesNecessary[0], name: "maidata.txt" },
      { file: filesNecessary[1], name: "bg.png/bg.jpg" },
      { file: filesNecessary[2], name: "track" },
    ];

    let missedFiles = [];

    for (const { file, name } of fileChecks) {
      if (!file || file.name === "" || file.size === 0) {
        missedFiles.push(name);
      }
    }

    if (missedFiles.length > 0) {
      for (const file of missedFiles) {
        toast.error(loc("NoFileSelected") + file);
      }
      return;
    }

    const uploading = toast.loading(loc("Uploading"), {
      hideProgressBar: false,
    });
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton").disabled = true;
      document.getElementById("submitbutton").textContent = loc(
        "UploadingPlzWait",
      );
    }
    try {
      const response = await axios.post(
        apiroot3 + "/maichart/upload",
        formData,
        {
          onUploadProgress: function (progressEvent) {
            if (progressEvent.lengthComputable) {
              const progress = progressEvent.loaded / progressEvent.total;
              toast.update(uploading, { progress });
            }
          },
          withCredentials: true,
        },
      );
      toast.done(uploading);
      toast.success(response.data);
      await sleep(2000);
      window.location.reload();
    } catch (e) {
      toast.done(uploading);
      toast.error(e.response.data, { autoClose: false });
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton").textContent = loc("Upload");
        document.getElementById("submitbutton").disabled = false;
      }
      return;
    } finally {
      toast.done(uploading);
    }
  }
  return (
    <div className="theList">
      <form className="formbox" onSubmit={onSubmit}>
        <div className="inputHint">maidata</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">bg.png/bg.jpg</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">track</div>
        <input className="userinput" type="file" name="formfiles" />
        <div className="inputHint">{loc("BGVideoHint")}</div>
        <input className="userinput" type="file" name="formfiles" />
        <button className="linkContent" id="submitbutton" type="submit">
          {loc("Upload")}
        </button>
      </form>
    </div>
  );
}
