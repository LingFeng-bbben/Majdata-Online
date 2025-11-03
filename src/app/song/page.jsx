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
      <MajdataView id={param} />
      <SongDetailsContainer id={param} tippy={target} />
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
      <div className="song-details-divider"></div>
      <LikeSender songid={id} />
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

  return (
    <div className="song-info-section">
      {/* 主歌曲信息卡片 */}
      <div className="song-main-card">
        <div className="song-cover-section">
          <CoverPic id={o.id} />
        </div>

        <div className="song-content-section">
          {/* 基本信息 */}
          <div className="song-basic-info">
            <Tippy
              content={loc("SearchForTitle") || "点击搜索该歌曲"}
              singleton={tippy}
            >
              <h1
                className="song-title-modern clickable-title"
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
              <div
                className="song-artist-modern clickable-artist"
                onClick={() => {
                  if (o.artist && o.artist !== "" && o.artist !== null) {
                    localStorage.setItem("search", o.artist);
                    window.location.href = "/";
                  }
                }}
              >
                {o.artist === "" || o.artist == null ? "-" : o.artist}
              </div>
            </Tippy>
            <Tippy content={o.uploader + "@" + o.designer} singleton={tippy}>
              <div className="song-designer-modern">
                <a href={"/space?id=" + o.uploader} className="designer-link">
                  <img
                    className="designer-avatar"
                    src={apiroot3 + "/account/Icon?username=" + o.uploader}
                    alt={o.uploader}
                  />
                  <span className="designer-text">
                    {o.uploader + "@" + o.designer}
                  </span>
                </a>
              </div>
            </Tippy>
          </div>

          {/* 难度等级 */}
          <div className="song-levels-section">
            <SongDifficultyLevels
              levels={o.levels}
              songid={o.id}
              isPlayer={true}
            />
          </div>

          {/* 操作按钮 */}
          <div className="song-actions-section">
            <button
              className="action-button share-button"
              onClick={shareSong({ id: o.id })}
              title={loc("Share")}
            >
              <svg
                className="action-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
              >
                <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
              </svg>
              <span className="action-text">{loc("Share") || "分享"}</span>
            </button>

            <button
              className="action-button download-button"
              onClick={OnDownloadClick({ id: o.id, title: o.title })}
              title={loc("Download")}
            >
              <svg
                className="action-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
              >
                <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
              </svg>
              <span className="action-text">{loc("Download") || "下载"}</span>
            </button>

            <div
              className="action-button tag-manage-button"
              onClick={() => tagButtonRef.current?.toggleWindow()}
            >
              <TagManageWidget ref={tagButtonRef} songid={o.id}>
              </TagManageWidget>
              <span className="action-text">{loc("Tags") || "标签"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 详细信息卡片 */}
      <div className="song-meta-card">
        <div className="meta-row">
          <span className="meta-label">{loc("UploadTime") || "上传时间"}:</span>
          <span className="meta-value">
            {(new Date(o.timestamp)).toLocaleString()}
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">ID:</span>
          <span className="meta-value meta-id">{o.id}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">HASH:</span>
          <span className="meta-value meta-hash">{o.hash}</span>
        </div>
        <div className="meta-row meta-tags-row">
          <span className="meta-label">{loc("Tags") || "标签"}:</span>
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
      <div className="interaction-layout">
        {/* 左侧：点赞点踩按钮 */}
        <div className="interaction-buttons">
          <button
            className="linkContentWithBorder modern-interaction-btn large-interaction-btn"
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
              <AiOutlineLoading3Quarters className="loading-icon-spin" style={{ width: "28px", height: "28px" }} />
            ) : (
              <svg
                className="commentIco"
                xmlns="http://www.w3.org/2000/svg"
                height="28"
                viewBox="0 -960 960 960"
                width="28"
                style={{ width: "28px", height: "28px" }}
              >
                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
              </svg>
            )}
            <span className="btn-count">{likecount}</span>
          </button>

          <button
            className="linkContentWithBorder modern-interaction-btn large-interaction-btn"
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
              <AiOutlineLoading3Quarters className="loading-icon-spin" style={{ width: "28px", height: "28px" }} />
            ) : (
              <svg
                className="commentIco"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                style={{ width: "28px", height: "28px" }}
              >
                <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
              </svg>
            )}
            <span className="btn-count">{dislikecount}</span>
          </button>
        </div>

        {/* 中间：分割线 */}
        <div className="interaction-divider"></div>

        {/* 右侧：点赞用户头像区域 */}
        <div className="liked-users-section">
          <h4 className="liked-users-title">{loc("LikedBy")}</h4>
          <div className="liked-users-grid">
            {data.likes && data.likes.length > 0
              ? (
                data.likes.map((username, index) => (
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
                ))
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
                  return <img style={{ maxWidth: "100%", height: "auto" }} {...rest} />;
                },
                a(props) {
                  const { ...rest } = props;
                  return <a target="_blank" rel="noopener noreferrer" {...rest} />;
                },
              }}
            >
              {value}
            </Markdown>
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
function MarkdownCommentContent({ content }) {
  // 首先处理@mention，将它们转换为特殊标记
  const processedContent = content.replace(/@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g, (match, username) => {
    return `[@${username}](/space?id=${username})`;
  });

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
          return <img style={{ maxWidth: "100%", height: "auto" }} {...rest} />;
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

// 解析评论内容，将 @用户名 转换为超链接（保留原函数作为备用）
function parseCommentContent(content) {
  // 优先匹配 "回复 @用户名：" 或 "Reply to @username:" 或 "返信先 @username:" 格式
  // 使用更灵活的正则，匹配任何文字 + @用户名 + 冒号的组合
  const replyMentionRegex = /^(.+?)\s+@([a-zA-Z0-9_\u4e00-\u9fa5]+)[：:]/;
  const replyMatch = content.match(replyMentionRegex);
  
  let startIndex = 0;
  const parts = [];
  
  // 如果是回复格式，先处理前缀
  if (replyMatch) {
    const prefix = replyMatch[1]; // "回复" 或 "Reply to" 等
    const username = replyMatch[2];
    const separator = replyMatch[0].slice(-1); // 获取冒号（中文或英文）
    
    parts.push(
      <span key="reply-prefix" className="comment-reply-prefix">
        {prefix}{' '}
      </span>
    );
    parts.push(
      <a
        key="reply-mention"
        href={`/space?id=${username}`}
        className="comment-mention"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        @{username}
      </a>
    );
    parts.push(
      <span key="reply-colon">{separator}</span>
    );
    startIndex = replyMatch[0].length;
  }
  
  // 继续处理剩余内容中的 @mention
  const mentionRegex = /@([a-zA-Z0-9_\u4e00-\u9fa5]+)/g;
  const remainingContent = content.substring(startIndex);
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(remainingContent)) !== null) {
    // 添加 @mention 之前的文本
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${startIndex + lastIndex}`}>
          {remainingContent.substring(lastIndex, match.index)}
        </span>
      );
    }

    // 添加 @mention 链接
    const username = match[1];
    parts.push(
      <a
        key={`mention-${startIndex + match.index}`}
        href={`/space?id=${username}`}
        className="comment-mention"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        @{username}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // 添加剩余的文本
  if (lastIndex < remainingContent.length) {
    parts.push(
      <span key={`text-${startIndex + lastIndex}`}>
        {remainingContent.substring(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : content;
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
        <MarkdownCommentContent content={comment.content} />
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
  const canDelete = currentUser && comment.sender === currentUser;
  const replies = comment.replies || [];
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
        <MarkdownCommentContent content={comment.content} />
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
  const [replyTargetId, setReplyTargetId] = useState(null);
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
      refreshInterval: replyTargetId ? 0 : 3000 // 回复输入时暂停自动刷新
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
    
    if (replyTargetId === topLevelCommentId && replyTargetUser === comment.sender) {
      // 再次点击同一评论，关闭输入框
      setReplyTargetId(null);
      setReplyTargetUser(null);
      setReplyContent("");
    } else {
      setReplyTargetId(topLevelCommentId);
      // 如果是回复子评论，记录被回复的用户名
      if (parentComment) {
        setReplyTargetUser(comment.sender);
      } else {
        setReplyTargetUser(null);
      }
      setReplyContent("");
      // 自动展开回复列表
      setExpandedComments(prev => new Set(prev).add(topLevelCommentId));
    }
  };

  const handleCancelReply = () => {
    setReplyTargetId(null);
    setReplyTargetUser(null);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (replyContent.trim() === "") {
      toast.error(loc("EmptyComment"));
      return;
    }

    // 如果是回复楼中楼，自动添加前缀
    let finalContent = replyContent;
    if (replyTargetUser) {
      finalContent = `${loc("ReplyTo")} @${replyTargetUser}：${replyContent}`;
    }

    const formData = new FormData();
    formData.set("type", "comment");
    formData.set("content", finalContent);
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
          <p>{loc("NoRecentRecords")}</p>
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
                isSubmittingReply={isSubmitting && replyTargetId === comment.id}
                isExpanded={isExpanded}
                onToggleReplies={() => handleToggleReplies(comment.id)}
                replyComposer={
                  replyTargetId === comment.id && (
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
