import {useRouter} from "next/navigation";
import {apiroot3} from "../apiroot";
import React from "react";
import {loc} from "../utils";

export default function Logout() {
    const router = useRouter();
    return (
        <div
            className="linkContent"
            onClick={() => {
                fetch(apiroot3 + "/account/Logout", {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                });
                router.push("./login");
            }}
        >
          {loc("Logout")}
        </div>
    );
}