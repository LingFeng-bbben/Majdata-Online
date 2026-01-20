"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { apiroot3 } from "../../apiroot";
import { loc, setLanguage } from "../../utils";
import { PageLayout } from "../../widgets";
import "../../../styles/components/collectionManage.css";

export default function CollectionManage() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("my-collections");
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  const fetcher = (url) =>
    fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
      res.json()
    );

  // 获取用户信息
  const { data: userData } = useSWR(
    ready ? `${apiroot3}/account/info/` : null,
    fetcher
  );

  // 获取自建歌单
  const { data: myCollectionsData, error: myCollectionsError, mutate: mutateMyCollections } = useSWR(
    ready && userData?.username ? `${apiroot3}/collection/list?search=username:${userData.username}` : null,
    fetcher
  );

  // 获取收藏的歌单
  const { data: favoriteCollectionsData, error: favoriteCollectionsError, mutate: mutateFavoriteCollections } = useSWR(
    ready ? `${apiroot3}/accounts/myfavcollections/` : null,
    fetcher
  );

  const handleDeleteCollection = async (collectionId) => {
    if (!confirm(loc("ConfirmDeleteCollection") || "确定要删除这个歌单吗？此操作不可撤销。")) return;

    setIsLoadingAction(true);
    try {
      const response = await fetch(`${apiroot3}/collection/${collectionId}`, {
        method: "DELETE",
        mode: "cors",
        credentials: "include",
      });

      if (response.ok) {
        toast.success(loc("CollectionDeleted") || "歌单删除成功");
        mutateMyCollections();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || (loc("FailedToDeleteCollection") || "删除歌单失败"));
      }
    } catch (error) {
      toast.error(loc("FailedToDeleteCollection") || "删除歌单失败");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleUnfavoriteCollection = async (collectionId) => {
    if (!confirm(loc("ConfirmUnfavoriteCollection") || "确定要取消收藏这个歌单吗？")) return;

    setIsLoadingAction(true);
    try {
      const response = await fetch(`${apiroot3}/accounts/myfavcollections/del?id=${collectionId}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });

      if (response.ok) {
        toast.success(loc("CollectionUnfavorited") || "已取消收藏");
        mutateFavoriteCollections();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || (loc("FailedToUnfavoriteCollection") || "取消收藏失败"));
      }
    } catch (error) {
      toast.error(loc("FailedToUnfavoriteCollection") || "取消收藏失败");
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout className="collection-manage-page">
      <div className="collection-manage-container">
        {/* 页面标题 */}
        <div className="page-header">
          <h1 className="page-title">{loc("MyCollections") || "我的歌单管理"}</h1>
          <p className="page-subtitle">{loc("ManageCollectionsDesc") || "管理您创建和收藏的歌单"}</p>
        </div>

        {/* 导航按钮 */}
        <div className="quick-nav">
          <a href="/collections" className="nav-button secondary-nav">
            {loc("CollectionMarket") || "歌单市场"}
          </a>
          <a href="/collections/create" className="nav-button primary-nav">
            {loc("CreateCollection") || "创建歌单"}
          </a>
        </div>

        {/* 标签页 */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "my-collections" ? "active" : ""}`}
              onClick={() => setActiveTab("my-collections")}
            >
              {loc("MyCreatedCollections") || "我创建的歌单"} ({myCollectionsData?.collections?.length || 0})
            </button>
            <button
              className={`tab-button ${activeTab === "favorite-collections" ? "active" : ""}`}
              onClick={() => setActiveTab("favorite-collections")}
            >
              {loc("MyFavoriteCollections") || "我收藏的歌单"} ({favoriteCollectionsData?.collections?.length || 0})
            </button>
          </div>

          {/* 我创建的歌单 */}
          {activeTab === "my-collections" && (
            <div className="tab-content">
              {myCollectionsError ? (
                <div className="error-state">
                  <p>{loc("FailedToLoadCollections") || "加载歌单失败"}</p>
                </div>
              ) : !myCollectionsData ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>{loc("Loading") || "加载中..."}</p>
                </div>
              ) : !myCollectionsData.collections || myCollectionsData.collections.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>{loc("NoCreatedCollections") || "您还没有创建任何歌单"}</h3>
                  <p>{loc("CreateYourFirstCollection") || "创建您的第一个歌单来收藏喜欢的歌曲吧"}</p>
                  <a href="/collections/create" className="btn-primary">
                    {loc("CreateFirstCollection") || "创建第一个歌单"}
                  </a>
                </div>
              ) : (
                <div className="collections-grid">
                  {myCollectionsData.collections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      type="my-collection"
                      onDelete={handleDeleteCollection}
                      isLoadingAction={isLoadingAction}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 我收藏的歌单 */}
          {activeTab === "favorite-collections" && (
            <div className="tab-content">
              {favoriteCollectionsError ? (
                <div className="error-state">
                  <p>{loc("FailedToLoadCollections") || "加载歌单失败"}</p>
                </div>
              ) : !favoriteCollectionsData ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>{loc("Loading") || "加载中..."}</p>
                </div>
              ) : !favoriteCollectionsData.collections || favoriteCollectionsData.collections.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⭐</div>
                  <h3>{loc("NoFavoriteCollections") || "您还没有收藏任何歌单"}</h3>
                  <p>{loc("ExploreAndFavorite") || "去歌单市场发现并收藏您喜欢的歌单吧"}</p>
                  <a href="/collections" className="btn-primary">
                    {loc("ExploreCollections") || "浏览歌单市场"}
                  </a>
                </div>
              ) : (
                <div className="collections-grid">
                  {favoriteCollectionsData.collections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      type="favorite-collection"
                      onUnfavorite={handleUnfavoriteCollection}
                      isLoadingAction={isLoadingAction}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

// 歌单卡片组件
function CollectionCard({ collection, type, onDelete, onUnfavorite, isLoadingAction }) {
  return (
    <div className={`collection-card ${type}`}>
      {/* 歌单封面 */}
      <div className="collection-cover">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="cover-image"
          />
        ) : (
          <div className="default-cover">
            <svg
              className="default-icon"
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              viewBox="0 -960 960 960"
              width="48"
            >
              <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720Zm0 240ZM240-480Zm480 280Z" />
            </svg>
          </div>
        )}
        <div className="card-type-badge">
          {type === "my-collection" ? (loc("Created") || "创建") : (loc("Favorited") || "收藏")}
        </div>
      </div>

      {/* 歌单信息 */}
      <div className="collection-info">
        <h3 className="collection-name">{collection.name}</h3>
        <p className="collection-description">
          {collection.description || (loc("NoDescription") || "暂无描述")}
        </p>
        
        <div className="collection-meta">
          <div className="meta-item">
            <span className="meta-label">
              {type === "my-collection" ? (loc("Owner") || "拥有者") : (loc("CreatedBy") || "创建者")}:
            </span>
            <span className="meta-value">{collection.creator || (loc("Unknown") || "未知")}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{loc("TotalSongs") || "歌曲数量"}:</span>
            <span className="meta-value">{collection.songCount || 0}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">{loc("CreatedTime") || "创建时间"}:</span>
            <span className="meta-value">
              {new Date(collection.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* 标签 */}
        {collection.tags && collection.tags.length > 0 && (
          <div className="collection-tags">
            {collection.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="collection-tag">
                {tag}
              </span>
            ))}
            {collection.tags.length > 3 && (
              <span className="collection-tag more-tags">
                +{collection.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="collection-actions">
        <a
          href={`/collections/${collection.id}`}
          className="action-button view-button"
        >
          {loc("ViewDetails") || "查看详情"}
        </a>
        {type === "my-collection" ? (
          <button
            className="action-button delete-button"
            onClick={() => onDelete(collection.id)}
            disabled={isLoadingAction}
          >
            {isLoadingAction ? (
              <>
                <div className="loading-spinner-small"></div>
                {loc("Deleting") || "删除中..."}
              </>
            ) : (
              loc("Delete") || "删除"
            )}
          </button>
        ) : (
          <button
            className="action-button unfavorite-button"
            onClick={() => onUnfavorite(collection.id)}
            disabled={isLoadingAction}
          >
            {isLoadingAction ? (
              <>
                <div className="loading-spinner-small"></div>
                {loc("Unfavoriting") || "取消中..."}
              </>
            ) : (
              loc("Unfavorite") || "取消收藏"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
