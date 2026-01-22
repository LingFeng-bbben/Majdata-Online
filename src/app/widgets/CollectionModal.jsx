"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiroot3 } from "../apiroot";
import { loc, handleNetworkError, safeFetch } from "../utils";

export default function CollectionModal({ isOpen, onClose, songId, songTitle }) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUserInfo();
    }
  }, [isOpen]);

  const fetchUserInfo = async () => {
    try {
      const userResponse = await safeFetch(`${apiroot3}/account/info/`);
      
      const userData = await userResponse.json();
      setUsername(userData.username);
      await fetchCollections(userData.username);
    } catch (error) {
      toast.error(handleNetworkError(error));
    }
  };

  const fetchCollections = async (username) => {
    setIsLoading(true);
    try {
      const response = await safeFetch(`${apiroot3}/collection/list?search=username:${username}`);
      
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      toast.error(handleNetworkError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection) {
      toast.error(loc("PleaseSelectCollection") || "请选择一个歌单");
      return;
    }

    setIsAdding(true);
    try {
      // 尝试多种可能的API格式
      let response;
      let apiUrl = `${apiroot3}/collection/${selectedCollection}/add`;
      
      // 首先尝试标准格式
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songId: songId,
          chart_id: songId, // 备用字段名
        }),
        mode: "cors",
        credentials: "include",
      });

      // 如果第一个格式失败，尝试其他格式
      if (!response.ok) {
        // 尝试表单格式
        const formData = new FormData();
        formData.append('songId', songId);
        formData.append('chart_id', songId);
        
        response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
          mode: "cors",
          credentials: "include",
        });
      }

      if (response.ok) {
        toast.success(loc("SongAddedToCollection") || "已添加到歌单");
        onClose();
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // 尝试解析JSON错误
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        toast.error(errorData.message || (loc("FailedToAddToCollection") || "添加到歌单失败"));
      }
    } catch (error) {
      console.error('Add to collection error:', error);
      toast.error(handleNetworkError(error));
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="collection-modal-overlay">
      <div className="collection-modal">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <span className="star-icon">⭐</span>
            <h3 className="modal-title">{loc("AddToCollection") || "收藏到歌单"}</h3>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <p className="song-info">
            {loc("Song")}: {songTitle}
          </p>
          
          <div className="form-group">
            <label className="form-label">{loc("SelectCollection") || "选择歌单"}:</label>
            {isLoading ? (
              <div className="loading">{loc("Loading") || "加载中..."}</div>
            ) : (
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="form-select"
              >
                <option value="">{loc("PleaseSelectCollection") || "请选择歌单"}</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name} ({collection.songCount || 0} {loc("Songs") || "首歌曲"})
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {collections.length === 0 && !isLoading && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-text">{loc("NoCollectionsFound") || "暂无歌单"}</p>
              <button 
                className="btn-secondary"
                onClick={() => window.location.href = "/collections/create"}
              >
                {loc("CreateCollection") || "创建歌单"}
              </button>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-secondary" 
            onClick={onClose}
            disabled={isAdding}
          >
            {loc("Cancel") || "取消"}
          </button>
          <button 
            className="btn-primary" 
            onClick={handleAddToCollection}
            disabled={!selectedCollection || isAdding || isLoading}
          >
            {isAdding ? (
              <>
                <span className="loading-spinner"></span>
                {loc("Adding") || "添加中..."}
              </>
            ) : (
              loc("Confirm") || "确定"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
