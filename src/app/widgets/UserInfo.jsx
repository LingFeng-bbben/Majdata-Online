"use client";
import React from "react";
import useSWR from "swr";
import { apiroot3 } from "../apiroot";
import {loc} from "../utils";

const fetcher = (url) =>
  fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
    res.json()
  );
export default function UserInfo() {
  const { data, error, isLoading } = useSWR(
    apiroot3 + "/account/info/",
    fetcher
  );
  if (error)
    return (
      <div className="linkContent">
        <a href="../login">{loc("Login")}</a>
      </div>
    );
  if (isLoading)
    return (
      <div className="linkContent">
        <a href="../login">...</a>
      </div>
    );
  console.log(data)
  if (data.Username === undefined)
    return (
      <div className="linkContent">
        <a href="../login">{loc("Login")}</a>
      </div>
    );
  return (
    <div className="linkContent">
      <a href="../user">
        <img
          className="smallIcon"
          src={apiroot3 + "/account/Icon?username=" + data.Username}
        />
        {data.Username}
      </a>
    </div>
  );
}
