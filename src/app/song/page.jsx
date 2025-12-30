/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { apiroot3 } from "../apiroot";
import Tippy, { useSingleton } from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { downloadSong } from "../download";
import { getComboState, getLevelName, loc, setLanguage } from "../utils";
import {
  CoverPic,
  Majdata,
  PageLayout,
  SongList,
  TagManageTagLauncher,
  TagManageWidget,
} from "../widgets";
import SongDifficultyLevels from "./SongDifficultyLevels";
import { FaComments } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Page() {
  const [source, target] = useSingleton();
  const [ready, setReady] = useState(false);

  const searchParams = useSearchParams();
  const param = searchParams.get("id");

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(
      () => {
        setReady(true);
      },
    );
  }, []);

  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout
      className="song-page"
      showBackToHome={true}
      showNavigation={false}
      useAmbientBackground={false}
    >
      {/* 自定义背景 - 覆盖PageLayout的默认背景 */}
      <div
        className="bg song-bg"
        style={{ backgroundImage: `url(${apiroot3}/maichart/${param}/image)` }}
      >
      </div>

      <Tippy
        singleton={source}
        animation="fade"
        placement="top-start"
        interactive={true}
      />
      <SongDetailsContainer id={param} tippy={target} />
      <MajdataView id={param} />
      <div className="hr-solid"></div>
      <ScoreList songid={param} />
      <div className="hr-solid"></div>
      <CommentSender songid={param} />
      <CommentList songid={param} />
      <div className="hr-solid"></div>
      <div className="theList">
        <div className="inputHint">{loc("Recommend")}</div>
      </div>
      <SongList
        url={apiroot3 + "/Recommend/get?chartId=" + encodeURIComponent(param)}
      />
    </PageLayout>
  );
}

const fetcher = (url) =>
  fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
    res.json()
  );

function SongDetailsContainer({ id, tippy }) {
  return (
    <div className="song-details-main-container">
      <SongInfo id={id} tippy={tippy} />
    </div>
  );
}

function SongInfo({ id, tippy }) {
  const tagButtonRef = useState();
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/" + id + "/summary",
    fetcher,
  );
  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>failed to load</div>;
  }

  const OnDownloadClick = (params) => async () => {
    await downloadSong({ id: params.id, title: params.title, toast: toast });
  };

  const shareSong = (props) => async () => {
    await navigator.clipboard.writeText(
      "https://majdata.net/song?id=" + props.id,
    );
    toast.success(loc("ClipboardSuccess"));
  };
  const o = data;
  const levels = Array.isArray(o.levels) ? o.levels : [];
  const isLevelValid = (level) => level !== "" && level != null;
  let heroLevelIndex = -1;
  if (isLevelValid(levels[5])) {
    heroLevelIndex = 5;
  } else if (isLevelValid(levels[4])) {
    heroLevelIndex = 4;
  } else {
    heroLevelIndex = levels.findLastIndex((level) => isLevelValid(level));
  }
  const heroLevelLabel =
    heroLevelIndex >= 0 ? getLevelName(heroLevelIndex) : "LEVEL";
  const heroLevelValue = isLevelValid(levels[heroLevelIndex])
    ? levels[heroLevelIndex]
    : "?";
  const heroBadgeTone =
    heroLevelIndex === 5 ? "hero-badge-remaster" : "hero-badge-master";

  return (
    <div className="song-info-section">
      <section className="hero-section grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 mb-10">
        <div className="flex justify-center items-start">
          <div className="hero-cover w-48 h-48 md:w-64 md:h-64">
            <CoverPic id={o.id} />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div style={{ marginTop: '20px', lineHeight: '5.5', textAlign: 'center' }}>
            <Tippy
              content={loc("SearchForTitle") || "点击搜索该歌曲"}
              singleton={tippy}
            >
              <h1
                className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md clickable-title text-center"
                id={o.id}
                onClick={() => {
                  if (o.title && o.title !== "" && o.title !== null) {
                    localStorage.setItem("search", o.title);
                    window.location.href = "/";
                  }
                }}
              >
                {o.title}
              </h1>
            </Tippy>

            <Tippy
              content={loc("SearchForArtist") || "点击搜索该艺术家"}
              singleton={tippy}
            >
              <div className="text-xl md:text-2xl text-white/80 font-medium text-center">
                <span
                  className="song-artist-modern clickable-artist"
                  onClick={() => {
                    if (o.artist && o.artist !== "" && o.artist !== null) {
                      localStorage.setItem("search", o.artist);
                      window.location.href = "/";
                    }
                  }}
                >
                  Artist: {o.artist === "" || o.artist == null ? "-" : o.artist}
                </span>
              </div>
            </Tippy>
          </div>

          <div className="difficulty-display-container">
            <h3 className="difficulty-display-title">
              All Difficulties
            </h3>
            <SongDifficultyLevels levels={o.levels} songid={o.id} isPlayer={true} />
          </div>
        </div>
      </section>

      <div className="content-grid grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:items-start">
        <aside className="flex flex-col gap-4 song-info-sidebar">
          <Tippy content={o.uploader + "@" + o.designer} singleton={tippy}>
            <div className="glass-panel p-5 rounded-2xl">
              <a href={"/space?id=" + o.uploader} className="designer-link">
                <img
                  className="designer-avatar"
                  src={apiroot3 + "/account/Icon?username=" + o.uploader}
                  alt={o.uploader}
                />
                <div className="designer-info">
                  <span className="designer-username">{o.uploader}</span>
                  <span className="designer-name">{o.designer}</span>
                </div>
              </a>
            </div>
          </Tippy>

          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-2">
            <button
              className="btn-glass w-full h-11 rounded-xl font-bold text-base shadow-lg transition-all border border-white/20"
              onClick={OnDownloadClick({ id: o.id, title: o.title })}
              title={loc("Download")}
            >
              <span className="inline-flex items-center gap-2 justify-center w-full">
                <svg
                  className="action-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                >
                  <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                </svg>
                <span>{loc("Download") || "下载"}</span>
              </span>
            </button>
            <button
              className="btn-glass w-full h-11 rounded-xl font-bold text-base shadow-lg transition-all border border-white/20"
              onClick={shareSong({ id: o.id })}
              title={loc("Share")}
            >
              <span className="inline-flex items-center gap-2 justify-center w-full">
                <svg
                  className="action-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 -960 960 960"
                  width="20"
                >
                  <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
                </svg>
                <span>{loc("Share") || "分享"}</span>
              </span>
            </button>
            <div style={{ display: "none" }}>
              <TagManageWidget ref={tagButtonRef} songid={o.id} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white/50 mb-3 uppercase tracking-wider">
              {loc("Tags") || "标签"}
            </h3>
            <div className="meta-tags-container">
              {(o.tags || o.publicTags) &&
                (o.tags.length > 0 || o.publicTags.length > 0)
                ? (
                  <>
                    {o.tags.map((tag, index) => (
                      <Tippy content={loc("SearchForTag")} key={index}>
                        <span
                          className="tag-chip tag-private"
                          onClick={() => {
                            localStorage.setItem("search", tag);
                            window.location.href = "/";
                          }}
                        >
                          {tag}
                        </span>
                      </Tippy>
                    ))}
                    {o.publicTags?.map((tag, index) => (
                      <Tippy content={loc("SearchForTag")} key={index}>
                        <span
                          className="tag-chip tag-public"
                          onClick={() => {
                            localStorage.setItem("search", "tag:" + tag);
                            window.location.href = "/";
                          }}
                        >
                          {tag}
                        </span>
                      </Tippy>
                    ))}
                  </>
                )
                : (
                  <span className="no-tags-text">
                    {loc("NoTags") || "暂无标签"}
                  </span>
                )}
              <TagManageTagLauncher
                onClick={() => {
                  tagButtonRef.current?.toggleWindow();
                }}
              />
            </div>
          </div>
        </aside>

        <main className="flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col">
            <div className="grid grid-cols-[100px_1fr] gap-y-4 text-sm">
              <span className="text-white/40">ID</span>
              <code className="font-mono bg-black/20 px-2 py-0.5 rounded text-white/80 w-fit">
                {o.id}
              </code>

              <span className="text-white/40">HASH</span>
              <code className="font-mono bg-black/20 px-2 py-0.5 rounded text-white/80 truncate w-full max-w-md">
                {o.hash}
              </code>

              <span className="text-white/40">{loc("UploadTime") || "上传时间"}</span>
              <span className="text-white/80">
                {(new Date(o.timestamp)).toLocaleString()}
              </span>
            </div>

            <div className="border-t border-white/10 my-4"></div>

            <LikeSender songid={o.id} />
          </div>
        </main>
      </div>
    </div>
  );
}

function MajdataView({ id }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/" + id + "/summary",
    fetcher,
  );
  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>failed to load</div>;
  }

  const o = data;
  const firstNonEmptyIndex = o.levels.findLastIndex((level) => level !== "");

  return (
    <div className="majdata-container">
      <Majdata
        songid={o.id}
        apiroot={apiroot3}
        level={"lv" + firstNonEmptyIndex}
      />
    </div>
  );
}

function LikeSender({ songid }) {
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(
    apiroot3 + "/maichart/" + songid + "/interact",
    fetcher,
  );
  if (error) {
    return <div>..?</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>failed to load</div>;
  }
  const likecount = data.likes.length;
  const dislikecount = data.disLikeCount;
  let playcount = data.plays;
  if (playcount === undefined) {
    playcount = 0;
  }
  const onSubmit = async (type) => {
    // 防止重复点击
    if (type === "like" && isLikeLoading) return;
    if (type === "dislike" && isDislikeLoading) return;

    const formData = new FormData();
    formData.set("type", type);
    formData.set("content", type);
    var name = "";
    if (type == "like") {
      name = loc("LikeAction");
      setIsLikeLoading(true);
    } else {
      name = loc("DislikeAction");
      setIsDislikeLoading(true);
    }

    try {
      const response = await fetch(
        apiroot3 + "/maichart/" + songid + "/interact",
        {
          method: "POST",
          body: formData,
          mode: "cors",
          credentials: "include",
        },
      );
      if (response.status === 200) {
        if (type == "like") {
          toast.success(
            data.isLiked ? loc("CancelSuccess") : name + loc("Success"),
          );
        } else {
          toast.success(
            data.isDisLiked ? loc("CancelSuccess") : name + loc("Success"),
          );
        }

        mutate();
      } else if (response.status === 400) {
        toast.error(name + loc("FailedLoginPrompt"));
      } else {
        toast.error(name + loc("FailedLoginPrompt"));
      }
    } catch (error) {
      toast.error(name + loc("FailedLoginPrompt"));
    } finally {
      if (type === "like") {
        setIsLikeLoading(false);
      } else {
        setIsDislikeLoading(false);
      }
    }
  };
  return (
    <div className="song-interaction-section">
      <div className="interaction-layout-new">
        {/* 顶部标题和点赞按钮 */}
        <div className="liked-users-header">
          <h4 className="liked-users-title">{loc("LikedBy")}</h4>
          <div className="interaction-buttons-inline">
            <button
              className="linkContentWithBorder modern-interaction-btn compact-interaction-btn"
              id="submitbuttonlike"
              type="button"
              onClick={() => onSubmit("like")}
              disabled={isLikeLoading || isDislikeLoading}
              style={{
                background: data.isLiked
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "",
                opacity: isLikeLoading || isDislikeLoading ? 0.6 : 1,
                cursor: isLikeLoading || isDislikeLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLikeLoading ? (
                <AiOutlineLoading3Quarters className="loading-icon-spin" style={{ width: "16px", height: "16px" }} />
              ) : (
                <svg
                  className="commentIco"
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  viewBox="0 -960 960 960"
                  width="16"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                </svg>
              )}
              <span className="btn-count">{likecount}</span>
            </button>

            <button
              className="linkContentWithBorder modern-interaction-btn compact-interaction-btn"
              id="submitbuttondislike"
              type="button"
              onClick={() => onSubmit("dislike")}
              disabled={isLikeLoading || isDislikeLoading}
              style={{
                background: data.isDisLiked
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "",
                opacity: isLikeLoading || isDislikeLoading ? 0.6 : 1,
                cursor: isLikeLoading || isDislikeLoading ? "not-allowed" : "pointer",
              }}
            >
              {isDislikeLoading ? (
                <AiOutlineLoading3Quarters className="loading-icon-spin" style={{ width: "16px", height: "16px" }} />
              ) : (
                <svg
                  className="commentIco"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
                </svg>
              )}
              <span className="btn-count">{dislikecount}</span>
            </button>
          </div>
        </div>

        {/* 点赞用户头像区域 */}
        <div className="liked-users-section-new">
          <div className="liked-users-grid">
            {data.likes && data.likes.length > 0
              ? (
                <>
                  {data.likes.slice(0, 40).map((username, index) => (
                    <a
                      key={username}
                      href={"/space?id=" + username}
                      className="liked-user-avatar"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <img
                        className="user-avatar-img"
                        src={apiroot3 + "/account/Icon?username=" + username}
                        alt={username}
                        title={username}
                      />
                    </a>
                  ))}
                  {data.likes.length > 40 && (
                    <div className="liked-user-avatar" style={{ animationDelay: `${40 * 0.1}s` }}>
                      <div className="more-likes" title={`还有 ${data.likes.length - 40} 位用户点赞`}>
                        +{data.likes.length - 40}
                      </div>
                    </div>
                  )}
                </>
              )
              : (
                <div className="no-likes-placeholder">
                  <div className="placeholder-icon">👍</div>
                  <p className="placeholder-text">{loc("BeFirstToLike")}</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

// CommentComposer - 统一的评论输入组件
function CommentComposer({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  autoFocus = false,
  isReply = false,
  isSubmitting = false,
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className={`comment-composer ${isReply ? "comment-composer-reply" : ""}`}>
      <textarea
        className="userinput commentbox modern-textarea"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        autoFocus={autoFocus}
        disabled={isSubmitting}
      />

      <div className="comment-preview-toggle">
        <button
          className="preview-toggle-btn"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? loc("HidePreview") : loc("ShowPreview")}
        </button>
      </div>

      {showPreview && (
        <div className="markdown-preview comment-preview">
          {value.trim() ? (
            <MarkdownCommentContent content={value} />
          ) : (
            <div className="preview-placeholder">{loc("PreviewPlaceholder")}</div>
          )}
        </div>
      )}

      <div className="comment-actions">
        <button
          className="linkContentWithBorder modern-interaction-btn comment-action-btn"
          type="button"
          onClick={onSubmit}
          disabled={!value.trim() || isSubmitting}
          style={{
            opacity: (!value.trim() || isSubmitting) ? 0.6 : 1,
            cursor: (!value.trim() || isSubmitting) ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? (
            <>
              <AiOutlineLoading3Quarters className="loading-icon-spin" style={{ width: "16px", height: "16px", marginRight: "4px" }} />
              {loc("PleaseWait")}
            </>
          ) : (
            loc("Post")
          )}
        </button>
        {isReply && onCancel && (
          <button
            className="linkContentWithBorder modern-interaction-btn comment-action-btn cancel-btn"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {loc("CancelReply")}
          </button>
        )}
      </div>
    </div>
  );
}

function CommentSender({ songid }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWR(
    apiroot3 + "/maichart/" + songid + "/interact",
  );

  const onSubmit = async () => {
    if (comment.trim() === "") {
      toast.error(loc("EmptyComment"));
      return;
    }

    const formData = new FormData();
    formData.set("type", "comment");
    formData.set("content", comment);

    setIsSubmitting(true);
    const sending = toast.loading(loc("Sending"));

    try {
      const response = await fetch(
        apiroot3 + "/maichart/" + songid + "/interact",
        {
          method: "POST",
          body: formData,
          mode: "cors",
          credentials: "include",
        },
      );

      toast.done(sending);

      if (response.status === 200) {
        toast.success(loc("CommentSuccess"));
        setComment("");
        mutate();
      } else if (response.status === 400) {
        toast.error(loc("CommentFailedLoginPrompt"));
      } else {
        toast.error(loc("CommentFailedLoginPrompt"));
      }
    } catch (error) {
      toast.done(sending);
      toast.error(loc("CommentFailedLoginPrompt"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="song-comment-sender">
      <div className="comment-sender-header">
        <h3 className="comment-sender-title">{loc("Comment")}</h3>
      </div>
      <div className="comment-input-section">
        <CommentComposer
          value={comment}
          onChange={setComment}
          onSubmit={onSubmit}
          placeholder={loc("CommentPlaceholder")}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

// MarkdownCommentContent - 渲染包含@mention的markdown内容
function MarkdownCommentContent({ content, comment }) {
  // 首先处理@mention，将它们转换为特殊标记
  let processedContent = "";
  if (comment) {
    if (comment.contentBody) {
      processedContent = comment.contentPrefix + comment.contentBody.replace(/@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g, (match, username) => {
        return `[@${username}](/space?id=${encodeURIComponent(username)})`;
      });
    }
    else {
      processedContent = comment.content.replace(/@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g, (match, username) => {
        return `[@${username}](/space?id=${encodeURIComponent(username)})`;
      });
    }
  }
  else {
    processedContent = content.replace(/@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g, (match, username) => {
      return `[@${username}](/space?id=${encodeURIComponent(username)})`;
    });
  }
  //console.log(processedContent)
  return (
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
          return <img style={{ width: "200px", height: "auto" }} {...rest} />;
        },
        a(props) {
          const { href, children, ...rest } = props;
          // 检查是否是@mention链接
          if (href && href.startsWith('/space?id=') && children && typeof children[0] === 'string' && children[0].startsWith('@')) {
            return (
              <a
                href={href}
                className="comment-mention"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                {...rest}
              >
                {children}
              </a>
            );
          }
          // 普通链接在新窗口打开
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...rest}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {processedContent}
    </Markdown>
  );
}


// CommentCard - 单条评论卡片（仅用于子回复）
function CommentCard({
  comment,
  currentUser,
  onReply,
  onDelete,
  isPending,
  isReply = false,
  onToggleReplies,
  isRepliesExpanded,
  replyCount,
}) {
  const canDelete = currentUser && comment.sender === currentUser;
  // 检查当前评论是否正在被操作
  const isCommentPending = isPending === comment.id;

  return (
    <div className={`comment-card modern-comment-card ${isReply ? "comment-card--reply" : ""}`}>
      <div className="comment-header">
        <a href={"/space?id=" + comment.sender} className="commenter-link">
          <img
            className="commenter-avatar"
            src={apiroot3 + "/account/Icon?username=" + comment.sender}
            alt={comment.sender}
          />
          <div className="commenter-info">
            <span className="commenter-username">{comment.sender}</span>
            <span className="comment-timestamp">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
        </a>
      </div>
      <div className="comment-content">
        <MarkdownCommentContent content={comment.content} comment={comment} />
      </div>
      <div className="comment-footer">
        {onReply && (
          <button
            className="comment-footer-btn comment-icon-btn"
            onClick={() => onReply(comment)}
            disabled={isCommentPending}
            title={loc("Reply")}
            style={{
              opacity: isCommentPending ? 0.6 : 1,
              cursor: isCommentPending ? "not-allowed" : "pointer",
            }}
          >
            {isCommentPending ? (
              <AiOutlineLoading3Quarters className="loading-icon-spin" />
            ) : (
              <FaComments />
            )}
          </button>
        )}
        {canDelete && onDelete && (
          <button
            className="comment-footer-btn delete-btn comment-icon-btn"
            onClick={() => onDelete(comment)}
            disabled={isCommentPending}
            title={loc("DeleteComment")}
            style={{
              opacity: isCommentPending ? 0.6 : 1,
              cursor: isCommentPending ? "not-allowed" : "pointer",
            }}
          >
            {isCommentPending ? (
              <AiOutlineLoading3Quarters className="loading-icon-spin" />
            ) : (
              <AiFillDelete />
            )}
          </button>
        )}
        {!isReply && replyCount > 0 && (
          <button
            className="comment-footer-btn expand-btn"
            onClick={onToggleReplies}
            disabled={isCommentPending}
            style={{
              opacity: isCommentPending ? 0.6 : 1,
              cursor: isCommentPending ? "not-allowed" : "pointer",
            }}
          >
            {isRepliesExpanded ? `收起 ${replyCount} 条回复` : `展开 ${replyCount} 条回复`}
          </button>
        )}
      </div>
    </div>
  );
}

// CommentThread - 完整的评论线程（包含源评论和所有回复）
function CommentThread({
  comment,
  currentUser,
  onReply,
  onDelete,
  isPending,
  isSubmittingReply,
  isExpanded,
  onToggleReplies,
  replyComposer,
}) {

  function flattenComments(comments, parentComment) {
    const result = [];
    if (!comments) {
      return result;
    }
    const stack = [...comments];

    while (stack.length > 0) {
      const orig = stack.pop();
      const item = { ...orig };
      result.push(item);

      if (item.replies && item.replies.length > 0) {
        for (let i = item.replies.length - 1; i >= 0; i--) {
          const origReply = item.replies[i];
          let replyComment = { ...origReply };
          replyComment.replyTo = item.id;
          stack.push(replyComment);
        }
      }
      item.replies = undefined;
    }
    for (let i = 0; i < result.length; i++) {
      let comment = result[i];
      if (!comment.replyTo) {
        comment.replies = undefined;
        comment.replyTo = parentComment.id;
        comment.contentPrefix = "";
        comment.contentBody = comment.content;
      }
      else {
        const target = result.find(c => c.id === comment.replyTo);
        const origContent = comment.content;
        comment.contentPrefix = `${loc("ReplyTo")} [@${target.sender}](/space?id=${encodeURIComponent(target.sender)}): `;
        comment.contentBody = origContent
        comment.content = comment.contentPrefix + comment.contentBody;
      }
    }

    return result.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  const canDelete = currentUser && comment.sender === currentUser;
  const replies = flattenComments(comment.replies, comment.id);
  // 检查当前评论是否正在被操作（删除或提交回复）
  const isCommentPending = isPending === comment.id || isSubmittingReply;

  return (
    <div className="comment-card modern-comment-card">
      {/* 源评论头部 */}
      <div className="comment-header">
        <a href={"/space?id=" + comment.sender} className="commenter-link">
          <img
            className="commenter-avatar"
            src={apiroot3 + "/account/Icon?username=" + comment.sender}
            alt={comment.sender}
          />
          <div className="commenter-info">
            <span className="commenter-username">{comment.sender}</span>
            <span className="comment-timestamp">
              {new Date(comment.timestamp).toLocaleDateString()}
            </span>
          </div>
        </a>
      </div>

      {/* 源评论内容 */}
      <div className="comment-content">
        <MarkdownCommentContent content={comment.content} comment={comment} />
      </div>

      {/* 源评论操作按钮 */}
      <div className="comment-footer">
        <button
          className="comment-footer-btn comment-icon-btn"
          onClick={() => onReply(comment)}
          disabled={isCommentPending}
          title={loc("Reply")}
          style={{
            opacity: isCommentPending ? 0.6 : 1,
            cursor: isCommentPending ? "not-allowed" : "pointer",
          }}
        >
          {isCommentPending ? (
            <AiOutlineLoading3Quarters className="loading-icon-spin" />
          ) : (
            <FaComments />
          )}
        </button>
        {canDelete && (
          <button
            className="comment-footer-btn delete-btn comment-icon-btn"
            onClick={() => onDelete(comment)}
            disabled={isCommentPending}
            title={loc("DeleteComment")}
            style={{
              opacity: isCommentPending ? 0.6 : 1,
              cursor: isCommentPending ? "not-allowed" : "pointer",
            }}
          >
            {isCommentPending ? (
              <AiOutlineLoading3Quarters className="loading-icon-spin" />
            ) : (
              <AiFillDelete />
            )}
          </button>
        )}
        {replies.length > 0 && (
          <button
            className="comment-footer-btn expand-btn"
            onClick={onToggleReplies}
            disabled={isCommentPending}
            style={{
              opacity: isCommentPending ? 0.6 : 1,
              cursor: isCommentPending ? "not-allowed" : "pointer",
            }}
          >
            {isExpanded ? `收起 ${replies.length} 条回复` : `展开 ${replies.length} 条回复`}
          </button>
        )}
      </div>

      {/* 回复输入框 */}
      {replyComposer}

      {/* 子回复列表 */}
      {isExpanded && replies.length > 0 && (
        <div className="comment-reply-list">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={(replyComment) => onReply(replyComment, comment)}
              onDelete={onDelete}
              isPending={isPending}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}


function CommentList({ songid }) {
  //表示回复对象
  const [replyTargetId, setReplyTargetId] = useState(null);
  //表示当前应该展开的回复
  const [replyThreadId, setReplyThreadId] = useState(null);
  const [replyTargetUser, setReplyTargetUser] = useState(null); // 被回复的用户名
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());

  // 获取当前用户信息
  useEffect(() => {
    fetch(apiroot3 + "/account/info/", {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.username) {
          setCurrentUser(data.username);
        }
      })
      .catch(() => {
        // 用户未登录或获取失败
        setCurrentUser(null);
      });
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    apiroot3 + "/maichart/" + songid + "/interact",
    fetcher,
    {
      refreshInterval: replyThreadId ? 0 : 3000 // 回复输入时暂停自动刷新
    },
  );

  const handleToggleReplies = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleReply = (comment, parentComment = null) => {
    // 找到顶层评论的 ID
    const topLevelCommentId = parentComment ? parentComment.id : comment.id;

    if (replyThreadId === topLevelCommentId && replyTargetUser === comment.sender) {
      // 再次点击同一评论，关闭输入框
      setReplyTargetId(null);
      setReplyThreadId(null);
      setReplyTargetUser(null);
      setReplyContent("");
    } else {
      //设置打开哪个帖子的回复框
      setReplyThreadId(topLevelCommentId);
      // 如果是回复子评论，记录被回复的用户名
      if (parentComment) {
        setReplyTargetUser(comment.sender);
        setReplyTargetId(comment.id);
        //console.log(comment.id)
      } else {
        setReplyTargetUser(null);
        setReplyTargetId(topLevelCommentId);
        console.log(comment.id)
      }
      setReplyContent("");
      // 自动展开回复列表
      setExpandedComments(prev => new Set(prev).add(topLevelCommentId));
    }
  };

  const handleCancelReply = () => {
    setReplyTargetId(null);
    setReplyThreadId(null);
    setReplyTargetUser(null);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (replyContent.trim() === "") {
      toast.error(loc("EmptyComment"));
      return;
    }

    // 如果是回复楼中楼，自动添加前缀
    // let finalContent = replyContent;
    // if (replyTargetUser) {
    //   finalContent = `${loc("ReplyTo")} @${replyTargetUser}：${replyContent}\n`;
    // }

    const formData = new FormData();
    formData.set("type", "comment");
    formData.set("content", replyContent);
    formData.set("replyTo", replyTargetId);

    setIsSubmitting(true);
    const sending = toast.loading(loc("Sending"));

    try {
      const response = await fetch(
        apiroot3 + "/maichart/" + songid + "/interact",
        {
          method: "POST",
          body: formData,
          mode: "cors",
          credentials: "include",
        },
      );

      toast.done(sending);

      if (response.status === 200) {
        toast.success(loc("ReplySuccess"));
        setReplyContent("");
        setReplyThreadId(null);
        setReplyTargetId(null);
        setReplyTargetUser(null);
        mutate();
      } else if (response.status === 400) {
        toast.error(loc("CommentFailedLoginPrompt"));
      } else {
        toast.error(loc("CommentFailedLoginPrompt"));
      }
    } catch (error) {
      toast.done(sending);
      toast.error(loc("CommentFailedLoginPrompt"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (comment) => {
    if (!window.confirm(loc("DeleteCommentConfirm"))) {
      return;
    }

    const formData = new FormData();
    formData.set("type", "comment");
    formData.set("commentId", comment.id);

    setPendingAction(comment.id);

    try {
      const response = await fetch(
        apiroot3 + "/maichart/" + songid + "/interact",
        {
          method: "DELETE",
          body: formData,
          mode: "cors",
          credentials: "include",
        },
      );

      if (response.status === 200) {
        toast.success(loc("DeleteSuccess"));
        mutate();
      } else if (response.status === 400) {
        toast.error(loc("DeleteFailed") + ": " + loc("FailedLoginPrompt"));
      } else {
        toast.error(loc("DeleteFailed"));
      }
    } catch (error) {
      toast.error(loc("DeleteFailed"));
    } finally {
      setPendingAction(null);
    }
  };

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>failed to load</div>;
  }

  // 处理评论数据 - 确保使用新的树形结构
  const comments = Array.isArray(data.comments) ? data.comments : [];

  return (
    <div className="theList song-comment-list">
      {comments.length === 0 ? (
        <div className="no-comments-placeholder">
          <p>{loc("NoComments")}</p>
        </div>
      ) : (
        comments.map((comment) => {
          const isExpanded = expandedComments.has(comment.id);

          return (
            <div key={comment.id} className="comment-thread-container">
              <CommentThread
                comment={comment}
                currentUser={currentUser}
                onReply={handleReply}
                onDelete={handleDelete}
                isPending={pendingAction}
                isSubmittingReply={isSubmitting && replyThreadId === comment.id}
                isExpanded={isExpanded}
                onToggleReplies={() => handleToggleReplies(comment.id)}
                replyComposer={
                  replyThreadId === comment.id && (
                    <div className="reply-composer-wrapper">
                      <CommentComposer
                        value={replyContent}
                        onChange={setReplyContent}
                        onSubmit={handleSubmitReply}
                        onCancel={handleCancelReply}
                        placeholder={
                          replyTargetUser
                            ? `${loc("ReplyTo")} @${replyTargetUser}`
                            : loc("ReplyPlaceholder")
                        }
                        autoFocus={true}
                        isReply={true}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )
                }
              />
            </div>
          );
        })
      )}
    </div>
  );
}

function ScoreList({ songid }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/" + songid + "/score",
    fetcher,
    { refreshInterval: 30000 },
  );
  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>failed to load</div>;
  }
  const scoreList = data.scores;
  console.log(scoreList);
  const objlist = scoreList.map((p, index) =>
    p.length !== 0 ? ScoreListLevel(p, index) : <></>
  );
  return (
    <div className="song-score-list">
      <div className="theList">
        <h2 className="ranking-main-title">{loc("RankingList")}</h2>
      </div>
      <div className="theList">{objlist}</div>
    </div>
  );
}

function ScoreListLevel(scores, level) {
  return (
    <div>
      <p>{getLevelName(level)}</p>{" "}
      {scores.map((o, index) => scoreCard(o, index))}
    </div>
  );
}

function scoreCard(score, index) {
  // 判断成绩等级，添加对应的荧光效果类
  const comboState = getComboState(score.comboState);
  let cardClass = "score-card modern-score-card";

  // 调试信息
  // console.log(`Score ${index + 1}: comboState=${comboState}, raw=${score.comboState}`);

  if (comboState === "AP+" || comboState === "AP") {
    cardClass += " score-card-ap";
    // console.log(`Applied AP glow for ${score.player.username}`);
  } else if (comboState === "FC+" || comboState === "FC") {
    cardClass += " score-card-fc";
    // console.log(`Applied FC glow for ${score.player.username}`);
  }

  // console.log(`Final cardClass for ${score.player.username}: ${cardClass}`);

  // 获取显示文本，如果没有特殊标识则显示"Clear"
  // 如果分数小于80%则显示"Failed"
  let displayText;
  if (score.acc < 80) {
    displayText = "Failed";
  } else if (comboState && comboState !== "") {
    displayText = comboState;
  } else {
    displayText = "Clear";
  }

  return (
    <div key={score}>
      <div className={cardClass}>
        <div className="score-rank-display">
          <span className={`rank-number ${index < 3 ? "top-three" : ""}`}>
            #{index + 1}
          </span>
        </div>
        <div className="score-player-info">
          <a
            href={"/space?id=" + score.player.username}
            className="player-link"
          >
            <img
              className="player-avatar"
              src={apiroot3 + "/account/Icon?username=" + score.player.username}
              alt={score.player.username}
            />
            <div className="player-details">
              <span className="player-username">{score.player.username}</span>
            </div>
          </a>
        </div>
        <div className="score-results">
          <div
            className={`score-accuracy ${comboState === "AP+" || comboState === "AP"
              ? "score-accuracy-ap"
              : comboState === "FC+" || comboState === "FC"
                ? "score-accuracy-fc"
                : ""
              }`}
          >
            {score.acc.toFixed(4)}%
          </div>
          <div className="score-combo">{displayText}</div>
        </div>
      </div>
    </div>
  );
}

