import { apiroot3 } from "../apiroot";

/**
 * 统一的登出处理函数
 * @param {Function} onSuccess - 登出成功后的回调函数
 * @param {Function} onError - 登出失败后的回调函数 (可选)
 */
export async function handleLogout(onSuccess, onError) {
    try {
        // 调用服务器登出API
        await fetch(apiroot3 + "/account/Logout", {
            method: "POST",
            mode: "cors",
            credentials: "include",
        });
        
        // 清除本地Cookie作为备用措施
        clearAuthCookies();
        
        // 执行成功回调
        if (onSuccess) {
            onSuccess();
        }
    } catch (error) {
        console.error("登出失败:", error);
        
        // 即使API调用失败，也清除本地状态
        clearAuthCookies();
        
        // 执行错误回调，如果没有提供则使用默认行为
        if (onError) {
            onError(error);
        } else if (onSuccess) {
            // 如果没有错误处理函数，但有成功回调，仍然执行成功回调
            onSuccess();
        }
    }
}

/**
 * 清除认证相关的Cookie
 */
function clearAuthCookies() {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
