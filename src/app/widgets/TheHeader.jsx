'use client'
import React from "react";

export default function TheHeader({toast}){
    return(      <h1>
        <img
          className="xxlb"
          src="./salt.webp"
          onClick={() =>
            toast.error("不要点我 操你妈", {
              position: "top-center",
              autoClose: 500,
            })
          }
        ></img>
        Majdata.Net
      </h1>)
}