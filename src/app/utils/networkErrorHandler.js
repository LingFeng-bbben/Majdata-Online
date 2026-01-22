import { loc } from "./getTranslatedString";

/**
 * 处理网络错误并返回本地化的错误消息
 * @param {Error} error - 网络错误对象
 * @returns {string} 本地化的错误消息
 */
export function handleNetworkError(error) {
  if (!error) {
    return loc("UnknownError") || "未知错误";
  }

  const errorMessage = error.message || error.toString();
  
  // 处理常见的网络错误
  if (errorMessage.includes("fail to create connection") || 
      errorMessage.includes("Failed to create connection") ||
      errorMessage.includes("NetworkError") ||
      errorMessage.includes("fetch failed")) {
    return loc("FailToCreateConnection") || "无法创建连接";
  }
  
  if (errorMessage.includes("connection refused") ||
      errorMessage.includes("ECONNREFUSED")) {
    return loc("ConnectionRefused") || "连接被拒绝";
  }
  
  if (errorMessage.includes("timeout") ||
      errorMessage.includes("ETIMEDOUT")) {
    return loc("RequestTimeout") || "请求超时";
  }
  
  if (errorMessage.includes("network") ||
      errorMessage.includes("NETWORK_ERROR")) {
    return loc("NetworkError") || "网络错误";
  }
  
  if (errorMessage.includes("dns") ||
      errorMessage.includes("ENOTFOUND")) {
    return loc("DNSLookupFailed") || "DNS查找失败";
  }
  
  if (errorMessage.includes("ssl") ||
      errorMessage.includes("certificate")) {
    return loc("SSLConnectionError") || "SSL连接错误";
  }
  
  if (errorMessage.includes("proxy")) {
    return loc("ProxyError") || "代理服务器错误";
  }
  
  if (errorMessage.includes("connection lost") ||
      errorMessage.includes("disconnect")) {
    return loc("NetworkConnectionLost") || "网络连接已断开";
  }
  
  // 处理HTTP状态码错误
  if (error.status) {
    switch (error.status) {
      case 400:
        return loc("ClientError") || "客户端错误";
      case 401:
        return loc("PleaseLogin") || "请先登录";
      case 403:
        return loc("NoPermission") || "没有权限";
      case 404:
        return loc("NotFound") || "资源不存在";
      case 500:
        return loc("ServerError") || "服务器错误";
      case 502:
      case 503:
      case 504:
        return loc("ServerError") || "服务器错误";
      default:
        return loc("UnknownError") || "未知错误";
    }
  }
  
  return loc("UnknownNetworkError") || "未知网络错误";
}

/**
 * 包装fetch请求，添加错误处理
 * @param {string} url - 请求URL
 * @param {Object} options - fetch选项
 * @returns {Promise} fetch Promise
 */
export async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      mode: "cors",
      credentials: "include",
      ...options
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }
    
    return response;
  } catch (error) {
    throw new Error(handleNetworkError(error));
  }
}

/**
 * 处理API响应错误
 * @param {Response} response - fetch响应对象
 * @returns {Promise} 处理后的响应
 */
export async function handleApiResponse(response) {
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    
    try {
      const errorData = await response.json();
      error.message = errorData.message || handleNetworkError(error);
    } catch (e) {
      error.message = handleNetworkError(error);
    }
    
    throw error;
  }
  
  return response;
}
