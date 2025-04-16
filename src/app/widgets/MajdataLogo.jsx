'use client'
import React from "react";
import { toast } from "react-toastify";

export default function MajdataLogo(){
    return(<h1>
        <img
          className="xxlb"
          src="../../../salt.webp"
          onClick={() =>
            toast.error("不要点我 操你妈", {
              position: "top-center",
              autoClose: 500,
            })
          } alt="xxlb"></img>
        Majdata.Net
    </h1>)
}