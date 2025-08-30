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
  const likecount = data.Likes.length;
  const dislikecount = data.DisLikeCount;
  let playcount = data.Plays;
  if (playcount === undefined) {
    playcount = 0;
  }
  const onSubmit = async (type) => {
    const formData = new FormData();
    formData.set("type", type);
    formData.set("content", type);
    var name = "";
    if (type == "like") {
      name = loc("LikeAction");
    } else {
      name = loc("DislikeAction");
    }
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
          data.IsLiked ? loc("CancelSuccess") : name + loc("Success"),
        );
      } else {
        toast.success(
          data.IsDisLiked ? loc("CancelSuccess") : name + loc("Success"),
        );
      }

      mutate();
    } else if (response.status === 400) {
      toast.error(name + loc("FailedLoginPrompt"));
    } else {
      toast.error(name + loc("FailedLoginPrompt"));
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
            style={{
              background: data.IsLiked
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "",
            }}
          >
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
            <span className="btn-count">{likecount}</span>
          </button>

          <button
            className="linkContentWithBorder modern-interaction-btn large-interaction-btn"
            id="submitbuttondislike"
            type="button"
            onClick={() => onSubmit("dislike")}
            style={{
              background: data.IsDisLiked
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "",
            }}
          >
            <svg
              className="commentIco"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              style={{ width: "28px", height: "28px" }}
            >
              <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
            </svg>
            <span className="btn-count">{dislikecount}</span>
          </button>
        </div>

        {/* 中间：分割线 */}
        <div className="interaction-divider"></div>

        {/* 右侧：点赞用户头像区域 */}
        <div className="liked-users-section">
          <h4 className="liked-users-title">{loc("LikedBy")}</h4>
          <div className="liked-users-grid">
            {data.Likes && data.Likes.length > 0
              ? (
                data.Likes.map((username, index) => (
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

function CommentSender({ songid }) {
  const [comment, SetComment] = useState("");
  const onSubmit = async () => {
    const formData = new FormData();
    if (comment === "") {
      toast.error(loc("EmptyComment"));
      return;
    }

    formData.set("type", "comment");
    formData.set("content", comment);

    if (typeof window !== "undefined") {
      document.getElementById("submitbutton").disabled = true;
      document.getElementById("submitbutton").textContent = loc("PleaseWait");
    }
    const sending = toast.loading(loc("Sending"));
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
      if (typeof window !== "undefined") {
        document.getElementById("commentcontent").value = "";
        SetComment("");
      }
    } else if (response.status === 400) {
      toast.error(loc("CommentFailedLoginPrompt"));
    } else {
      toast.error(loc("CommentFailedLoginPrompt"));
    }
    if (typeof window !== "undefined") {
      document.getElementById("submitbutton").disabled = false;
      document.getElementById("submitbutton").textContent = loc("Post");
    }
  };
  return (
    <div className="song-comment-sender">
      <div className="comment-sender-header">
        <h3 className="comment-sender-title">{loc("Comment")}</h3>
      </div>
      <div className="comment-input-section">
        <textarea
          id="commentcontent"
          className="userinput commentbox modern-textarea"
          placeholder={loc("CommentPlaceholder")}
          onChange={() => SetComment(event.target.value)}
          value={comment}
        />
        <div className="comment-actions">
          <button
            className="linkContentWithBorder modern-interaction-btn comment-submit-button"
            id="submitbutton"
            type="button"
            onClick={onSubmit}
            disabled={!comment.trim()}
          >
            {loc("Post")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentList({ songid }) {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/maichart/" + songid + "/interact",
    fetcher,
    { refreshInterval: 3000 },
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
  const commentList = data.Comments.reverse();
  console.log(commentList);
  const objlist = commentList.map((o) => (
    <div key={o[0]}>
      <div className="comment-card modern-comment-card">
        <div className="comment-header">
          <a href={"/space?id=" + o.Sender.Username} className="commenter-link">
            <img
              className="commenter-avatar"
              src={apiroot3 + "/account/Icon?username=" + o.Sender.Username}
              alt={o.Sender.Username}
            />
            <div className="commenter-info">
              <span className="commenter-username">{o.Sender.Username}</span>
              <span className="comment-timestamp">
                {new Date(o.Timestamp).toLocaleDateString()}
              </span>
            </div>
          </a>
        </div>
        <div className="comment-content">{o.Content}</div>
      </div>
    </div>
  ));
  return <div className="theList song-comment-list">{objlist}</div>;
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
            className={`score-accuracy ${
              comboState === "AP+" || comboState === "AP"
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
