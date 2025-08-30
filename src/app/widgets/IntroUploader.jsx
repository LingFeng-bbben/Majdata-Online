import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown-dark.css";
import useSWR from "swr";
import { apiroot3 } from "../apiroot";
import { toast } from "react-toastify";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { loc } from "../utils";
import sleep from "../utils/sleep";
import getUsername from "../utils/getUsername";

export default function IntroUploader() {
  const [intro, setIntro] = useState("");
  const fetcher = (url) =>
    fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
      res.json()
    );
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/account/intro?username=" + encodeURIComponent(getUsername()),
    fetcher,
  );
  useEffect(() => {
    if (data && data.introduction) {
      setIntro(data.introduction);
    }
  }, [data]);
  if (error) {
    return undefined;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }

  async function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const content = formData.get("content");
    if (!content || content.trim() === "") {
      toast.error(loc("NoIntroTypedIn"));
      return;
    }
    const uploading = toast.loading(loc("Uploading"), {
      hideProgressBar: false,
    });
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton3").disabled = true;
      document.getElementById("submitbutton3").textContent = loc(
        "UploadingPlzWait",
      );
    }
    try {
      const response = await axios.post(apiroot3 + "/account/intro", formData, {
        onUploadProgress: function (progressEvent) {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            toast.update(uploading, { progress });
          }
        },
        withCredentials: true,
      });
      toast.done(uploading);
      toast.success(response.data);
      await sleep(2000);
      window.location.reload();
    } catch (e) {
      toast.done(uploading);
      toast.error(e.response.data, { autoClose: false });
      if (typeof window !== "undefined") {
        document.getElementById("submitbutton3").textContent = loc("Upload");
        document.getElementById("submitbutton3").disabled = false;
      }
      return;
    } finally {
      toast.done(uploading);
    }
  }

  return (
    <>
      <h2>{loc("SelfIntro")}{loc("MarkdownSupported")}</h2>
      <div className="theList">
        <form className="introbox" onSubmit={onSubmit}>
          <textarea
            className="userinput introbox-inner"
            name="content"
            id="IntroBox"
            defaultValue={data.introduction}
            onChange={(e) => setIntro(e.target.value)}
          >
          </textarea>

          <button
            className="pagingButton linkContent"
            id="submitbutton3"
            type="submit"
          >
            {loc("Upload")}
          </button>
        </form>
      </div>
      <h2>{loc("Preview")}</h2>
      <article className="markdown-body">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            ol(props) {
              const { ...rest } = props;
              return <ol type="1" {...rest} />;
            },
            ul(props) {
              const { ...rest } = props;
              return <ol style={{ listStyleType: "disc" }} {...rest} />;
            },
            img(props) {
              const { ...rest } = props;
              return <img style={{ margin: "auto" }} {...rest} />;
            },
          }}
        >
          {intro}
        </Markdown>
      </article>
      <div className={"hr-solid"}></div>
    </>
  );
}
