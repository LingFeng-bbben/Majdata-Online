import {useRouter} from "next/navigation";
import {apiroot3} from "../apiroot";
import React from "react";
import {loc} from "../utils";

export default function Logout() {
    const router = useRouter();
    
    const handleLogout = async () => {
        try {
            // 调用服务器登出API
            await fetch(apiroot3 + "/account/Logout", {
                method: "POST",
                mode: "cors",
                credentials: "include",
            });
            
            // 清除本地Cookie作为备用措施
            document.cookie =
              "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            // 跳转到登录页面
            router.push("./login");
        } catch (error) {
            console.error("登出失败:", error);
            // 即使API调用失败，也清除本地状态并跳转
            document.cookie =
              "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("./login");
        }
    };
    
    return (
        <div className="linkContent" onClick={handleLogout}>
          {loc("Logout")}
        </div>
    );
}