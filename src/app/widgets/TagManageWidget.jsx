import {useState, useRef, useEffect, forwardRef, useImperativeHandle} from 'react';
import React from "react";
import Tippy from "@tippyjs/react";
import useSWR from "swr";
import {apiroot3} from "../apiroot";
import {toast} from "react-toastify";
import {loc, sleep} from "../utils";

const TagManageWidget = forwardRef(function TagManageWidget({songid, newClassName = ''}, ref) {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const buttonRef = useRef(null);
  const windowRef = useRef(null);

  useImperativeHandle(ref, () => (
    {
      toggleWindow: () => setIsWindowOpen((prev) => !prev),
      openWindow: () => setIsWindowOpen(true),
      closeWindow: () => setIsWindowOpen(false),
    }
  ));

  return (
    <div className={`songLevel downloadButtonBox ${newClassName}`}>
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
});

export default TagManageWidget;


export function TagManageTagLauncher({onClick}) {
  return <TagManageTag onClick={onClick}/>;
}

const TagManageButton = forwardRef(function TagManageButton({onClick, newClassName}, ref) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`shareButton ${newClassName}`}
    >
      <svg
        className="downloadButton"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="-20 -20 512 512"
        width="24"
      >
        <path
          d="M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5L0 80C0 53.5 21.5 32 48 32l149.5 0c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
      </svg>
    </div>
  )
});

const TagManageTag = forwardRef(function TagManageTag({onClick}, ref) {
  return (
    <button
      ref={ref}
      onMouseDown={onClick}
      className="tag"
      style={{
        backgroundColor: "green",
      }}
    ><svg
        className="downloadButton"
        xmlns="http://www.w3.org/2000/svg"
        height="16"
        viewBox="0 -960 960 960"
        width="16"
      >
        <path
          d="M480-160v-80h120l180-240-180-240H160v200H80v-200q0-33 23.5-56.5T160-800h440q19 0 36 8.5t28 23.5l216 288-216 288q-11 15-28 23.5t-36 8.5H480Zm-10-320ZM200-120v-120H80v-80h120v-120h80v120h120v80H280v120h-80Z"/>
      </svg>
    </button>
  )
});

const TagManageWindow = forwardRef(function TagManageWindow({onClose, buttonRef, songid}, ref) {
  const [position, setPosition] = useState({x: window.innerWidth / 2 - 200, y: 100});
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [newTag, setNewTag] = useState("");
  const [activeCategory, setActiveCategory] = useState('曲库来源');
  const [tags, setTags] = useState([]);
  const isInPrivatePage = window.location.pathname === "/user/charts";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dragging) {
        return;
      }
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
    fetch(url, {mode: "cors", credentials: "include"}).then((res) =>
      res.json()
    );

  const {data, error, isLoading} = useSWR(
    apiroot3 + "/maichart/" + songid + "/summary",
    fetcher
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    if (isInPrivatePage) {
      if (data.tags !== undefined) {
        setTags(data.tags);
      }
      else {
        toast.error("没有Tags字段")
      }
    }
    else {
      if (data.publicTags !== undefined) {
        setTags(data.publicTags);
      }
      else {
        toast.error("没有publicTags字段")
      }
    }
    console.log(tags)
  }, [data]);

  const uploadTags = async () => {
    const uploading = toast.loading(loc("Uploading"), {
      hideProgressBar: true,
    });
    const response = await fetch(apiroot3 + "/maichart/" + songid + (
      isInPrivatePage ? "/tags" : "/publictags"
    ), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tags),
      credentials: 'include'
    });
    toast.done(uploading);

    if (!response.ok) {
      toast.error("好像上传失败惹……");
    }
    else {
      //TODO: 刷新页面，重载数据，应该可以热重载，之后研究
      toast.success("上传成功了喵");
      if (window.location.pathname !== "/user/charts") {
        await sleep(1000);
        window.location.reload();
      }
    }

    return response;
  }

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading) {
    return <div className="loading"></div>;
  }
  if (data === "" || data === undefined) {
    return <div>failed to load</div>;
  }


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
        textShadow: '0 0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        backgroundColor: 'black',
        zIndex: 1001,
        cursor: dragging ? 'grabbing' : 'default',
        border: "1px solid whitesmoke",
        fontSize: "1rem",
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
        {isInPrivatePage ? "作者Tags管理" : "玩家Tags管理"}
      </div>
      <div style={{padding: '16px'}}>
        <div className="uploadMetaRow">
          <div className="uploadMetaLabel">Tags:</div>
          <div className="uploadMetaContent tagList">
            {tags && tags.length > 0 ? (
              tags.map((tag, index) => (
                <Tippy content="删除标签" key={index}>
                                    <span
                                      className={isInPrivatePage ? "tag" : "tagPublic"}
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
               <span style={{color: "#999", fontStyle: "italic"}}>
                                {loc("NoTags")}
                            </span>
             )}
          </div>
        </div>
        <div style={{marginTop: '12px', display: 'flex', gap: '8px'}}>
          <input
            type="text"
            placeholder="自定标签"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            style={{marginLeft: '4px', flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc'}}
          />
          <button
            onClick={() => {
              const trimmed = newTag.trim();
              if (trimmed !== "") {
                setTags([...tags, trimmed]); // 添加标签
                setNewTag("");               // 清空输入框
              }
            }}
            style={{padding: '6px 12px'}}
          >
            添加
          </button>
        </div>
        <p>常用Tags</p>
        {/* tab bar */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px'}}>
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

        <div className="tagList" style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
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
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '12px'}}>
          <button style={{padding: '6px 12px', border: '1px solid whitesmoke', borderRadius: '5px'}}
                  onClick={uploadTags}>
            更新Tags
          </button>
        </div>
      </div>
    </div>
  );
});