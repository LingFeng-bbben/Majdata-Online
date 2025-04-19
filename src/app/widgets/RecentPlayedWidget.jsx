import useSWR from "swr";
import {apiroot3} from "../apiroot";
import LazyLoad from "react-lazy-load";
import {Level, CoverPic } from "./";
import React from "react";
import {getComboState, loc} from "../utils";

export default function RecentPlayed({username}) {
    const fetcher = async (...args) =>
        await fetch(...args).then(async (res) => res.json());
    const {data, error, isLoading} = useSWR(
        apiroot3 + "/account/Recent?username=" + username,
        fetcher
    );
    console.log(apiroot3 + "/account/Recent?username=" + username)
    if (error) return <div className="notReady">{loc("ServerError")}</div>;
    if (isLoading) {
        return (
            <>
                <div className="loading"></div>
            </>
        );
    }
    if (data.length === 0) return <p>{loc("NoRecentRecords")}</p>;
    const list = data.map((o) => (
        <div key={o.chartId} id={o.chartId} className="songCardWrapper">
            <LazyLoad height={165} width={352} offset={300}>
                <div className="songCard">
                    <CoverPic id={o.chartId}/>
                    <div className="songInfo">
                        <div className="songTitle" id={o.chartId}>
                            <a href={"/song?id=" + o.chartId}>{o.title}</a>
                        </div>

                        <div className="songArtist">
                            <a href={"/song?id=" + o.chartId}>
                                {o.artist == "" || o.artist == null ? "-" : o.artist}
                            </a>
                        </div>

                        <div className="songDesigner">
                            <a href={"/space?id=" + o.uploader}>
                                <img
                                    className="smallIcon"
                                    src={apiroot3 + "/account/Icon?username=" + o.uploader}
                                    alt={o.uploader}
                                />
                                {o.designer}
                            </a>
                        </div>
                        <Level
                                level={o.level}
                                difficulty={o.difficulty}
                                songid={o.chartId}
                                isPlayer={false}
                            />
                        <div className="songAcc" style={{color: "yellow"}}>{o.acc.toFixed(4)}</div>
                        <br/>
                        <div className="songAcc">{getComboState(o.comboState)}</div>
                    </div>
                </div>
            </LazyLoad>
        </div>
    ));

    return <div className="songCardContainer">{list}</div>;
}
