'use client'
import React, { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import useSWR from 'swr';
import Majdata from '../majdata'
import { apiroot1 } from '../apiroot';
import Tippy, { useSingleton } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import LazyLoad from "react-lazy-load";

export default function Page() {
  const [source, target] = useSingleton();
  return (
    <>
      <div className='bg'></div>
      <div className='seprate'></div>
      <h1><img className="xxlb" src="./xxlb.jpg" onClick={() => alert("不要点我 操你妈")}></img>MMFC 11TH</h1>
      <div className='links'>
        <div className='linkContent'><a href='../'>返回</a></div>

        {/* <div className='linkContent'><a href='https://www.maimaimfc.ink/8thstart' target="_blank" rel="noreferrer">8th报名窗口</a></div> */}
        <div className='linkContent'><a href='https://www.maimaimfc.ink/precontest' target="_blank" rel="noreferrer">打分会场</a></div>
      </div>
      <div className="topButton" onClick={() => { if (typeof window !== "undefined") { window.scrollTo(0, 0) } }}>顶</div>
      <Majdata />
      <Tippy singleton={source} animation='fade' placement='top-start' interactive={true} />
      <TheList tippy={target} />
      <img className="footerImage" style={{ width: "150px" }} loading="lazy" src={"/xxlbfooter.webp"} alt="" />
    </>
  )
}


function CoverPic({ id }) {
  let url = apiroot1 + `/maichart/${id}/image`;
  let urlfull = apiroot1 + `/maichart/${id}/image?fullImage=true`;
  return (
    <><PhotoProvider bannerVisible={false} loadingElement={<div>Loading...</div>}>
      <PhotoView src={urlfull} >
        <img className="songImg" src={url} alt="" />

      </PhotoView>
    </PhotoProvider>
      <div className='songId'>{id}</div>
    </>
  );
}

function Levels({ levels, songid, onClick }) {
  for (let i = 0; i < levels.length; i++) {
    if (levels[i] == null) {
      levels[i] = "-"
    }
  }
  const scrollToTop = () => {
    let sTop = document.documentElement.scrollTop || document.body.scrollTop
    if (sTop > 0.1) {
      window.requestAnimationFrame(scrollToTop)
      window.scrollTo(0, sTop - sTop / 9)
    }
  }

  const levelClickCallback = e => {
    scrollToTop()
    onClick()
    const maichart = apiroot1 + "/maichart/" + songid
    const maidata = maichart + "/chart"
    const track = maichart + "/track"
    const bg = maichart + "/image"
    const mv = maichart + "/video"
    window.unitySendMessage(
      "HandleJSMessages",
      "ReceiveMessage",
      maidata + "\n" + track + "\n" + bg + "\n" + mv + "\n" + e.target.id
    );
  }
  return (
    <>
      <div className='songLevel' id="lv0" style={{ display: levels[0] == '-' ? 'none' : 'unset' }} onClick={levelClickCallback}>{levels[0]}</div>
      <div className='songLevel' id="lv1" style={{ display: levels[1] == '-' ? 'none' : 'unset' }} onClick={levelClickCallback}>{levels[1]}</div>
      <div className='songLevel' id="lv2" style={{ display: levels[2] == '-' ? 'none' : 'unset' }} onClick={levelClickCallback}>{levels[2]}</div>
      <div className='songLevel' id="lv3" style={{ display: levels[3] == '-' ? 'none' : 'unset' }} onClick={levelClickCallback}>{levels[3]}</div>
      <div className='songLevel' id="lv4" style={{ display: levels[4] == '-' ? 'none' : 'unset' }} onClick={levelClickCallback}>{levels[4]}</div>
      <div className='songLevel' id="lv5" style={{ display: levels[5] == '-' ? 'none' : 'unset' }} onClick={levelClickCallback}>{levels[5]}</div>
      <div className='songLevel' id="lv6" style={{ display: levels[6] == '-' ? 'none' : 'unset' }} onClick={levelClickCallback}>{levels[6]}</div>
    </>
  )
}

function SearchBar({ onChange }) {
  return (
    <div className='searchDiv'>
      <input type='text' className='searchInput' placeholder='Search' onChange={onChange} />
    </div>);
}

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function TheList({ tippy }) {
  const { data, error, isLoading } = useSWR(apiroot1 + "/maichart/list", fetcher);
  const [filteredList, setFilteredList] = new useState(data);
  const [desInfo, setDesInfo] = new useState("点击难度载入谱面哟");
  if (error) return <div className='notReady'>已闭店</div>;
  if (isLoading) {
    return <div className='loading'></div>;
  }

  data.sort((a, b) => { return b.id - a.id; });

  const filterBySearch = (e) => {
    let dataf = data.filter(o => (
      o.Designer?.toLowerCase().includes(e.target.value.toLowerCase()) ||
      o.Title?.toLowerCase().includes(e.target.value.toLowerCase()) ||
      o.Artist?.toLowerCase().includes(e.target.value.toLowerCase()) ||
      o.Levels.some(i => i == e.target.value) ||
      o.Id == e.target.value
    ));
    setFilteredList(dataf);
  };

  if (filteredList == undefined) {
    setFilteredList(data);
    return <SearchBar onChange={filterBySearch} />;
  }

  const list = filteredList.map(o => (
    <div key={o.id}>
      <LazyLoad height={165} width={352} offset={300}>
        <div className="songCard">
          <CoverPic id={o.id} />
          <div className='songInfo'>
            <Tippy content={o.title} singleton={tippy}>
              <div className='songTitle' id={o.id}>{o.title}</div>
            </Tippy>
            <Tippy content={o.artist} singleton={tippy}>
              <div className='songArtist'>{o.artist == "" || o.artist == null ? "-" : o.artist}</div>
            </Tippy>
            <Tippy content={o.designer} singleton={tippy}>
              <div className='songDesigner'>{o.designer == "" || o.designer == null ? "-" : o.designer}</div>
            </Tippy>
            <Levels levels={o.levels} songid={o.id} onClick={() => setDesInfo(o.description)} />
          </div>
        </div>
      </LazyLoad>
    </div>));
  // 渲染数据
  return (<>
    <div className="songDescription">留言<br />{desInfo}</div>
    <SearchBar onChange={e => filterBySearch(e)} />
    <div className='theList'>{list}</div>
  </>);
}