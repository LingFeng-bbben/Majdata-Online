"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "react-toastify";
import { apiroot3 } from "../../apiroot";
import { loc, setLanguage } from "../../utils";
import { PageLayout } from "../../widgets";
import "../../../styles/components/collectionDetail.css";

export default function CollectionDetail() {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('id');
  const [ready, setReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    visibility: "public"
  });

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  const fetcher = (url) =>
    fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
      res.json()
    );

  // 获取歌单详情和歌曲列表
  const { data: collectionData, error: collectionError, mutate: mutateCollection } = useSWR(
    ready && collectionId ? `${apiroot3}/collection/${collectionId}` : null,
    fetcher
  );

  const { data: songsData, error: songsError, mutate: mutateSongs } = useSWR(
    ready && collectionId ? `${apiroot3}/collection/${collectionId}/songList` : null,
    fetcher
  );

  // 获取当前用户信息
  const { data: userData } = useSWR(
    ready ? `${apiroot3}/account/info/` : null,
    fetcher
  );

  const isOwner = userData?.username === collectionData?.creator;

  const handleEditCollection = async () => {
    if (isLoadingAction) return;

    setIsLoadingAction(true);
    try {
      const response = await fetch(`${apiroot3}/collection/${collectionId}/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
        mode: "cors",
        credentials: "include",
      });

      if (response.ok) {
        toast.success(loc("CollectionUpdated") || "歌单更新成功");
        setIsEditing(false);
        mutateCollection();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || (loc("FailedToUpdateCollection") || "更新歌单失败"));
      }
    } catch (error) {
      toast.error(loc("FailedToUpdateCollection") || "更新歌单失败");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!confirm(loc("ConfirmRemoveSong") || "确定要移除这首歌曲吗？")) return;

    setIsLoadingAction(true);
    try {
      const response = await fetch(`${apiroot3}/collection/${collectionId}/del`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songId }),
        mode: "cors",
        credentials: "include",
      });

      if (response.ok) {
        toast.success(loc("SongRemovedFromCollection") || "歌曲已从歌单移除");
        mutateSongs();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || (loc("FailedToRemoveSong") || "移除歌曲失败"));
      }
    } catch (error) {
      toast.error(loc("FailedToRemoveSong") || "移除歌曲失败");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const startEdit = () => {
    setEditForm({
      name: collectionData.name || "",
      description: collectionData.description || "",
      visibility: collectionData.visibility || "public"
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: "",
      description: "",
      visibility: "public"
    });
  };

  if (!ready) return <div className="loading"></div>;

  if (!collectionId) {
    return (
      <PageLayout className="collection-detail-page">
        <div className="error-state">
          <p>{loc("InvalidCollectionId") || "无效的歌单ID"}</p>
          <a href="/collections" className="back-button">
            {loc("BackToCollections") || "返回歌单列表"}
          </a>
        </div>
      </PageLayout>
    );
  }

  if (collectionError || songsError) {
    return (
      <PageLayout className="collection-detail-page">
        <div className="error-state">
          <p>{loc("FailedToLoadCollection") || "加载歌单失败"}</p>
        </div>
      </PageLayout>
    );
  }

  if (!collectionData) {
    return (
      <PageLayout className="collection-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{loc("Loading") || "加载中..."}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="collection-detail-page">
      <div className="collection-detail-container">
        {/* 返回按钮 */}
        <div className="back-section">
          <a href="/collections" className="back-button">
            ← {loc("Back") || "返回"}
          </a>
        </div>

        {/* 歌单信息 */}
        <div className="collection-header">
          {isEditing && isOwner ? (
            <div className="edit-form">
              <input
                type="text"
                className="edit-input"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder={loc("CollectionTitle") || "歌单标题"}
              />
              <textarea
                className="edit-textarea"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder={loc("CollectionDescription") || "歌单描述"}
                rows={3}
              />
              <select
                className="edit-select"
                value={editForm.visibility}
                onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}
              >
                <option value="public">{loc("VisibilityPublic") || "公开"}</option>
                <option value="private">{loc("VisibilityPrivate") || "私人"}</option>
                <option value="unlisted">{loc("VisibilityUnlisted") || "不公开"}</option>
              </select>
              <div className="edit-actions">
                <button
                  className="btn-secondary"
                  onClick={cancelEdit}
                  disabled={isLoadingAction}
                >
                  {loc("Cancel") || "取消"}
                </button>
                <button
                  className="btn-primary"
                  onClick={handleEditCollection}
                  disabled={isLoadingAction}
                >
                  {isLoadingAction ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      {loc("Saving") || "保存中..."}
                    </>
                  ) : (
                    loc("Save") || "保存"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="collection-info">
                <h1 className="collection-title">{collectionData.name}</h1>
                <p className="collection-description">
                  {collectionData.description || (loc("NoDescription") || "暂无描述")}
                </p>
                <div className="collection-meta">
                  <div className="meta-item">
                    <span className="meta-label">{loc("CreatedBy") || "创建者"}:</span>
                    <span className="meta-value">{collectionData.creator || (loc("Unknown") || "未知")}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{loc("TotalSongs") || "歌曲数量"}:</span>
                    <span className="meta-value">{songsData?.songs?.length || 0}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{loc("CreatedTime") || "创建时间"}:</span>
                    <span className="meta-value">
                      {new Date(collectionData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{loc("LastModified") || "最后修改"}:</span>
                    <span className="meta-value">
                      {new Date(collectionData.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {isOwner && (
                <button
                  className="edit-button"
                  onClick={startEdit}
                >
                  {loc("EditCollection") || "编辑歌单"}
                </button>
              )}
            </>
          )}
        </div>

        {/* 歌曲列表 */}
        <div className="songs-section">
          <h2 className="section-title">
            {loc("Songs") || "歌曲"} ({songsData?.songs?.length || 0})
          </h2>
          
          {!songsData ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{loc("Loading") || "加载中..."}</p>
            </div>
          ) : !songsData.songs || songsData.songs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <h3>{loc("NoSongsInCollection") || "歌单中暂无歌曲"}</h3>
            </div>
          ) : (
            <div className="songs-list">
              {songsData.songs.map((song) => (
                <div key={song.id} className="song-item">
                  <div className="song-info">
                    <h3 className="song-title">{song.title}</h3>
                    <p className="song-artist">{song.artist}</p>
                    <p className="song-difficulty">
                      {song.difficulty && (
                        <span className={`difficulty-badge ${song.difficulty.toLowerCase()}`}>
                          {song.difficulty}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="song-actions">
                    <a
                      href={`/song?id=${song.id}`}
                      className="action-button view-button"
                    >
                      {loc("View") || "查看"}
                    </a>
                    {isOwner && (
                      <button
                        className="action-button remove-button"
                        onClick={() => handleRemoveSong(song.id)}
                        disabled={isLoadingAction}
                      >
                        {loc("RemoveFromCollection") || "移除"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
