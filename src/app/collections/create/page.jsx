"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiroot3 } from "../../apiroot";
import { loc, setLanguage } from "../../utils";
import { PageLayout } from "../../widgets";
import "../../../styles/components/collectionCreate.css";

export default function CreateCollection() {
  const [ready, setReady] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
    tags: [],
    coverImage: ""
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setLanguage(localStorage.getItem("language") || navigator.language).then(() => {
      setReady(true);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(loc("CollectionNameRequired") || "歌单名称不能为空");
      return false;
    }
    if (formData.name.length > 100) {
      toast.error(loc("CollectionNameTooLong") || "歌单名称不能超过100个字符");
      return false;
    }
    if (formData.description.length > 500) {
      toast.error(loc("CollectionDescriptionTooLong") || "歌单描述不能超过500个字符");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      console.log('Submitting form data:', formData);
      
      let response;
      const requestData = {
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility,
        tags: formData.tags
      };

      response = await fetch(`${apiroot3}/collection/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        mode: "cors",
        credentials: "include",
      });
      console.log("API Response status:", response.status);

      if (response && response.ok) {
        let result = {};
        try {
          result = await response.json();
        } catch (error) {
          console.warn("Create collection response is not JSON:", error);
        }
        console.log('Collection created successfully:', result);
        toast.success(loc("CollectionCreated") || "歌单创建成功");

        const resolveCreatedId = async (payload) => {
          const candidates = [
            payload?.collection?.id,
            payload?.collectionId,
            payload?.data?.id,
            payload?.data?._id,
            payload?._id,
            payload?.id,
          ].filter(Boolean);

          for (const id of candidates) {
            try {
              const verifyResponse = await fetch(`${apiroot3}/collection/${id}`, {
                mode: "cors",
                credentials: "include",
              });
              if (verifyResponse.ok) {
                return id;
              }
            } catch (error) {
              console.warn("Verify created collection failed:", error);
            }
          }

          try {
            const userResponse = await fetch(`${apiroot3}/account/info/`, {
              mode: "cors",
              credentials: "include",
            });
            const userInfo = await userResponse.json();
            const username = userInfo?.username;
            if (!username) return null;

            const listResponse = await fetch(
              `${apiroot3}/collection/list?search=username:${encodeURIComponent(username)}`,
              { mode: "cors", credentials: "include" }
            );
            const listData = await listResponse.json();
            const collections = listData?.collections || [];
            const matched = collections
              .filter((item) => item?.name === formData.name)
              .sort((a, b) => new Date(b?.createdAt || b?.updatedAt || 0) - new Date(a?.createdAt || a?.updatedAt || 0));

            return matched[0]?.id || null;
          } catch (error) {
            console.warn("Resolve collection id from list failed:", error);
            return null;
          }
        };

        const createdId = await resolveCreatedId(result);
        if (createdId) {
          window.location.href = `/collections/detail?id=${createdId}`;
        } else {
          window.location.href = "/collections/manage";
        }
      } else {
        const errorText = response ? await response.text() : 'No response';
        console.error('API Error:', errorText);
        console.error('Response status:', response?.status);
        
        // 尝试解析JSON错误
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        toast.error(errorData.message || (loc("FailedToCreateCollection") || "创建歌单失败"));
      }
    } catch (error) {
      console.error('Create collection error:', error);
      toast.error(loc("FailedToCreateCollection") || "创建歌单失败");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/collections";
  };

  if (!ready) return <div className="loading"></div>;

  return (
    <PageLayout className="collection-create-page">
      <div className="collection-create-container">
        {/* 页面标题 */}
        <div className="page-header">
          <h1 className="page-title">{loc("CreateCollection") || "创建歌单"}</h1>
          <p className="page-subtitle">创建您的专属歌单，收藏喜欢的谱面作品</p>
        </div>

        {/* 返回按钮 */}
        <div className="back-section">
          <a href="/collections" className="back-button">
            ← {loc("Back") || "返回"}
          </a>
        </div>

        {/* 创建表单 */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-section">
            <h2 className="section-title">{loc("BasicInfo") || "基本信息"}</h2>
            
            {/* 歌单名称 */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                {loc("CollectionName") || "歌单名称"} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder={loc("CollectionNamePlaceholder") || "给您的歌单起个名字"}
                maxLength={100}
                required
              />
              <div className="form-hint">
                {formData.name.length}/100 {loc("Characters") || "字符"}
              </div>
            </div>

            {/* 歌单描述 */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                {loc("CollectionDescription") || "歌单描述"}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder={loc("CollectionDescriptionPlaceholder") || "描述一下这个歌单的内容和风格"}
                rows={4}
                maxLength={500}
              />
              <div className="form-hint">
                {formData.description.length}/500 {loc("Characters") || "字符"}
              </div>
            </div>

            {/* 可见性设置 */}
            <div className="form-group">
              <label htmlFor="visibility" className="form-label">
                {loc("Visibility") || "可见性"}
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="public">{loc("VisibilityPublic") || "公开"}</option>
                <option value="private">{loc("VisibilityPrivate") || "私人"}</option>
                <option value="unlisted">{loc("VisibilityUnlisted") || "不公开"}</option>
              </select>
              <div className="form-hint">
                {formData.visibility === "public" && (loc("VisibilityPublicDesc") || "所有人都可以看到这个歌单")}
                {formData.visibility === "private" && (loc("VisibilityPrivateDesc") || "只有您可以看到这个歌单")}
                {formData.visibility === "unlisted" && (loc("VisibilityUnlistedDesc") || "知道链接的人可以访问")}
              </div>
            </div>
          </div>

            <div className="form-section">
            <h2 className="section-title">{loc("Tags") || "标签"}</h2>
            
            {/* 标签输入 */}
            <div className="form-group">
              <label className="form-label">
                {loc("AddTags") || "添加标签"}
              </label>
              <div className="tag-input-wrapper">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="tag-input"
                  placeholder={loc("TagPlaceholder") || "输入标签后按回车添加"}
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="add-tag-button"
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                >
                  {loc("Add") || "添加"}
                </button>
              </div>
              <div className="form-hint">
                {loc("MaxTagsHint") || `最多添加10个标签，每个标签不超过20个字符`} ({formData.tags.length}/10)
              </div>
            </div>

            {/* 已添加的标签 */}
            {formData.tags.length > 0 && (
              <div className="form-group">
                <label className="form-label">{loc("CurrentTags") || "当前标签"}</label>
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-tag"
                        aria-label={loc("RemoveTag") || "移除标签"}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={isCreating}
              >
                {loc("Cancel") || "取消"}
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isCreating || !formData.name.trim()}
              >
                {isCreating ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    {loc("Creating") || "创建中..."}
                  </>
                ) : (
                  loc("CreateCollection") || "创建歌单"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 提示信息 */}
        <div className="tips-section">
          <h3>{loc("Tips") || "小贴士"}</h3>
          <ul>
            <li>{loc("Tip1") || "一个好的歌单名称和描述可以帮助其他用户更好地了解您的内容"}</li>
            <li>{loc("Tip2") || "合理使用标签可以让您的歌单更容易被发现"}</li>
            <li>{loc("Tip3") || "创建后您可以随时编辑歌单信息和添加歌曲"}</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
