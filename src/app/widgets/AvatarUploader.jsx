import { toast } from "react-toastify";
import axios from "axios";
import { apiroot3 } from "../apiroot";
import React, { useCallback, useRef, useState } from "react";
import { getUsername, loc, sleep } from "../utils";

export default function AvatarUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // 直接调用getUsername作为hook
  const username = getUsername();

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error(loc("InvalidFileType"));
      setSelectedFile(null);
      setPreviewUrl(null);
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(loc("FileTooLarge"));
      setSelectedFile(null);
      setPreviewUrl(null);
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // 设置选中的文件
    setSelectedFile(file);

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error(loc("NoSelectedFile"));
      return;
    }

    console.log("开始上传头像", {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
    });

    setIsUploading(true);
    const formData = new FormData();
    formData.append("pic", selectedFile);

    const uploading = toast.loading(loc("Uploading"), {
      hideProgressBar: false,
    });

    try {
      console.log("发送请求到:", apiroot3 + "/account/Icon");
      const response = await axios.post(apiroot3 + "/account/Icon", formData, {
        onUploadProgress: function (progressEvent) {
          if (progressEvent.lengthComputable) {
            const progress = progressEvent.loaded / progressEvent.total;
            console.log("上传进度:", Math.round(progress * 100) + "%");
            toast.update(uploading, { progress });
          }
        },
        withCredentials: true,
      });

      console.log("上传成功", response);
      toast.done(uploading);
      toast.success(response.data);
      await sleep(2000);
      window.location.reload();
    } catch (e) {
      console.error("上传失败", e);
      console.error("错误详情:", {
        status: e.response?.status,
        statusText: e.response?.statusText,
        data: e.response?.data,
        message: e.message,
      });

      toast.done(uploading);

      let errorMessage = "上传失败";
      if (e.response?.data) {
        errorMessage = e.response.data;
      } else if (e.response?.status) {
        errorMessage =
          `上传失败 (${e.response.status}: ${e.response.statusText})`;
      } else if (e.message) {
        errorMessage = `上传失败: ${e.message}`;
      }

      toast.error(errorMessage, { autoClose: false });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile]);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 如果username还在加载中，返回加载状态
  if (!username) {
    return <div className="loading"></div>;
  }

  console.log("当前用户名:", username);

  const currentAvatarUrl = apiroot3 + "/account/Icon?username=" + username;
  const previewAvatarUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="avatar-uploader-container">
      <div className="avatar-display-section">
        <div className="current-avatar">
          <img
            className="avatar-image-large"
            src={currentAvatarUrl}
            alt={loc("CurrentAvatar")}
          />
          <div className="avatar-label">{loc("CurrentAvatar")}</div>
        </div>

        <div className="preview-section">
          <div className="preview-avatar">
            <img
              className="avatar-image-large preview"
              src={previewAvatarUrl}
              alt={loc("PreviewAvatar")}
            />
            <div className="avatar-label">{loc("PreviewAvatar")}</div>
          </div>
        </div>

        <div className="upload-controls">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input-hidden"
          />

          <div className="button-group">
            <button
              type="button"
              onClick={triggerFileSelect}
              className="upload-button select-file"
              disabled={isUploading}
            >
              {selectedFile ? loc("ChangeFile") : loc("SelectFile")}
            </button>

            <button
              type="button"
              onClick={handleUpload}
              className="upload-button upload-file"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? loc("UploadingPlzWait") : loc("Upload")}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="upload-button cancel-file"
              disabled={!selectedFile || isUploading}
            >
              {loc("Cancel")}
            </button>
          </div>

          {selectedFile && (
            <div className="file-info">
              <span className="file-name">
                {selectedFile.name}
              </span>
              <div className="file-size-row">
                <span className="file-size-label">{loc("FileSize")}</span>
                <span className="file-size">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
