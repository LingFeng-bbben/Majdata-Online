import { useState, useRef, useEffect, forwardRef } from 'react';
import React from "react";
import Tippy from "@tippyjs/react";
import useSWR from "swr";
import {apiroot3} from "../apiroot";
import {toast} from "react-toastify";

export default function TagManageWidget({songid}) {
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const buttonRef = useRef(null);
    const windowRef = useRef(null);

    return (
        <div>
            <TagManageButton
                ref={buttonRef}
                onClick={() => setIsWindowOpen(!isWindowOpen)}
            />
            {isWindowOpen && (
                <TagManageWindow
                    ref={windowRef}
                    onClose={() => setIsWindowOpen(false)}
                    buttonRef={buttonRef}
                    songid={songid}
                />
            )}
        </div>
    );
}

const TagManageButton = forwardRef(function TagManageButton({ onClick }, ref)
{
    return (
        <button
            ref={ref}
            onClick={onClick}
            className={window.location.pathname==="/user/charts" ? "" : "tag"}
            style={{
                zIndex: 1000,
                backgroundColor: 'green'
            }}
        >
            +
        </button>
    )
});

const TagManageWindow = forwardRef(function TagManageWindow({ onClose, buttonRef, songid }, ref)
{
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [newTag, setNewTag] = useState("");
    const [activeCategory, setActiveCategory] = useState('曲库来源');
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dragging) return;
            if (
                ref.current &&
                !ref.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, ref, buttonRef, dragging]);

    const handleMouseDown = (e) => {
        setDragging(true);
        const rect = ref.current.getBoundingClientRect();
        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setPosition({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y
                });
            }
        };

        const handleMouseUp = () => setDragging(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, offset]);

    const fetcher = (url) =>
        fetch(url, { mode: "cors", credentials: "include" }).then((res) =>
            res.json()
        );

    const { data, error, isLoading } = useSWR(
        apiroot3 + "/maichart/" + songid + "/summary",
        fetcher
    );

    useEffect(() => {
        if (data && data.tags) {
            setTags(data.tags);
        }
    }, [data]);

    const uploadTags = async () => {
        console.log("向", apiroot3 + "/maichart/" + songid + "/tags", "发", JSON.stringify(tags))
        const response = await fetch(apiroot3 + "/maichart/" + songid + "/tags", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tags),
            credentials: 'include'
        });

        if (!response.ok) {
            toast.error(response.statusText);
        } else {
            //TODO: 刷新页面，重载数据，应该可以热重载，之后研究
            window.location.reload();
        }

        return response;
    }

    if (error) return <div>failed to load</div>;
    if (isLoading) {
        return <div className="loading"></div>;
    }
    if (data === "" || data === undefined) return <div>failed to load</div>;


    const categories = {
        曲库来源: ["POPS", "BMS", "SEGA", "BEMANI", "Anime", "VOCALOID", "Vtuber", "Touhou", "OTOGE", "Game", "IDOL"],
        赛事: ["MMFC", "KOM", "点子王", "xmmcg", "拯救"],
        语种: ["Chinese", "Japanese", "Korean", "Western", "WorldMusic"],
        谱面要素: ["初代", "STD", "DX", "Fes", "变启动", "非常规要素", "BPM减半", "BPM加倍"],
        谱面难度: ["变速", "耐力", "爆发", "技巧", "星星", "键盘", "面条", "Touch", "发狂"],
        歌曲长度: ["FULL", ">5min", "<2min"],
        Neta类: ["观赏用", "舞蹈", "PV演出", "音频还原", "官Re", "练习用"],
        其他: ["R-18G", "脚图", "类早餐蛋", "送给我孩子的歌", "⚠️大象出现！", "伪猫", "小笼包", "自慰", "Easy Lv.1", "梗要素大量发生", "#dydy", "下饭", "地雷note", "xxlbiloveu"]
    };

    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: position.x + 'px',
                top: position.y + 'px',
                width: '400px',
                minHeight: '300px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                backgroundColor: 'black',
                zIndex: 1001,
                cursor: dragging ? 'grabbing' : 'default',
                border: "1px solid whitesmoke"
            }}
        >
            <div
                onMouseDown={handleMouseDown}
                style={{
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    cursor: 'grab',
                    userSelect: 'none'
                }}
            >
                Tags管理窗口
            </div>
            <div style={{ padding: '16px' }}>
                <div className="uploadMetaRow">
                    <div className="uploadMetaLabel">Tags:</div>
                    <div className="uploadMetaContent tagList">
                        {tags && tags.length > 0 ? (
                            tags.map((tag, index) => (
                                <Tippy content="删除标签" key={index}>
                                    <span
                                        className="tag"
                                        onClick={() => {
                                            const newTags = [...tags];
                                            newTags.splice(index, 1);
                                            setTags(newTags);
                                        }}
                                    >
                                        {tag}
                                    </span>
                                </Tippy>
                            ))
                        ) : (
                            <span style={{ color: "#999", fontStyle: "italic" }}>
                                暂无标签
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="输入标签"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        style={{ marginLeft: '4px', flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={() => {
                            const trimmed = newTag.trim();
                            if (trimmed !== "") {
                                setTags([...tags, trimmed]); // 添加标签
                                setNewTag("");               // 清空输入框
                            }
                        }}
                        style={{ padding: '6px 12px' }}
                    >
                        添加
                    </button>
                </div>
                <p>常用Tags</p>
                {/* tab bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {Object.keys(categories).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: activeCategory === cat ? '1px solid #007bff' : '1px solid #ccc',
                                backgroundColor: activeCategory === cat ? 'black' : 'black',
                                cursor: 'pointer'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="tagList" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {categories[activeCategory].filter(tag => !tags.includes(tag)).map((tag) => (
                        <span className="tag" key={tag} onClick={() => {
                            const newTags = [...tags];
                            newTags.push(tag);
                            setTags(newTags);
                        }}>{tag}</span>
                    ))}
                </div>
                <br/>
                <div className="hr-solid"/>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                    <button style={{ padding: '6px 12px', border: '1px solid whitesmoke', borderRadius: '5px' }} onClick={uploadTags}>
                        更新Tags
                    </button>
                </div>
            </div>
        </div>
    );
});