'use client'
import React from "react";
import { toast } from "react-toastify";
import {loc} from "../utils";

export default function MajdataLogo(){
    return(<h1>
        <img
          className="xxlb"
          src="../../../salt.webp"
          onClick={() =>
            toast.error(loc("FUCKYOU"), {
              position: "top-center",
              autoClose: 500,
            })
          } alt="xxlb"></img>
        Majdata.Net
    </h1>)
}