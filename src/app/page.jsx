'use client'
import React, { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import useSWR from 'swr';
import Majdata from './majdata'
import UserInfo from './userinfo';
import { apiroot3 } from './apiroot';
import JSZip from 'jszip';
import axios from 'axios';

export default function Page() {
  return (
    <>
      <div className='seprate'></div>
      <h1><img className="xxlb"src="./salt.webp" onClick={()=>alert("不要点我 操你妈")}></img>MajOnline.Beta</h1>
      <div className='links'>
      <div className='linkContent'><a href='./filebase'>MMFC文件库</a></div>
      <div className='linkContent'><a href='./contest'>MMFC 6th</a></div>
      <UserInfo apiroot={apiroot3}/>
      </div>
      
      <Majdata />
      <TheList />
    </>
  )
}

function CoverPic({id}){
  let url = apiroot3 + `/Image/${id}` 
  let urlfull = apiroot3 +`/ImageFull/${id}` 
  return (
    <><PhotoProvider bannerVisible={false} loadingElement={<div>Loading...</div>}>
      <PhotoView src={urlfull} >
        <img className="songImg" src={url} alt="" />
        
      </PhotoView>
    </PhotoProvider>
    {/* <div className='songId'>{id}</div> */}
    </>
);
}

function Levels({levels, songid}){
  for(let i=0;i<levels.length;i++){
    if(levels[i]==null){
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

  const levelClickCallback = e =>{
    scrollToTop()
    window.unitySendMessage("HandleJSMessages","ReceiveMessage",'jsnmsl\n'+apiroot3 + '\n' +songid +'\n'+e.target.id)
  }
  return(
    <div >
    <div className='songLevel'  id="lv0" style={{display:levels[0]=='-'?'none':'unset'}} onClick={levelClickCallback}>{levels[0]}</div>
    <div className='songLevel'  id="lv1" style={{display:levels[1]=='-'?'none':'unset'}} onClick={levelClickCallback}>{levels[1]}</div>
    <div className='songLevel'  id="lv2" style={{display:levels[2]=='-'?'none':'unset'}} onClick={levelClickCallback}>{levels[2]}</div>
    <div className='songLevel'  id="lv3" style={{display:levels[3]=='-'?'none':'unset'}} onClick={levelClickCallback}>{levels[3]}</div>
    <div className='songLevel'  id="lv4" style={{display:levels[4]=='-'?'none':'unset'}} onClick={levelClickCallback}>{levels[4]}</div>
    <div className='songLevel'  id="lv5" style={{display:levels[5]=='-'?'none':'unset'}} onClick={levelClickCallback}>{levels[5]}</div>
    <div className='songLevel'  id="lv6" style={{display:levels[6]=='-'?'none':'unset'}} onClick={levelClickCallback}>{levels[6]}</div>
    </div>
  )
}

function SearchBar({onChange}){
  return (
  <div className='searchDiv'>
    <input type='text' className='searchInput' placeholder='Search' onChange={onChange}/>
  </div>);
}

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function TheList() {
  const { data, error, isLoading } = useSWR(apiroot3 + "/SongList", fetcher);
  const [filteredList, setFilteredList] = new useState(data);

  if (error) return <div>failed to load</div>;
  if (isLoading) {
    return <div className='loading'>Loading List...</div>;
  }
  if(data==''||data==undefined) return <div>failed to load</div>;
  data.sort((a, b) => { return b.Timestamp - a.Timestamp; });

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

  async function fetchFile(url) {
    const response = await axios.get(url,{responseType:'blob'})
    return response.data
  }

  function downloadFile(url, fileName) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadSong = props => ()=>{
    const zip = new JSZip();
    //alert(props.id)
    zip.file('track.mp3',fetchFile(apiroot3+"/Track/"+props.id));
    zip.file('bg.jpg',fetchFile(apiroot3+"/ImageFull/"+props.id));
    zip.file('maidata.txt',fetchFile(apiroot3+"/Maidata/"+props.id));

    zip.generateAsync({ type: "blob" }).then(blob => {
      const url = window.URL.createObjectURL(blob);
      downloadFile(url, props.title);
  });
  
  }

  const list = filteredList.map(o => (
    <div key={o.Id}>
      <div className="songCard">
        <CoverPic id={o.Id} />
        <div className='songInfo'>
          <div className='songTitle' id={o.Id}>{o.Title}</div>
          <div className='songArtist'>{o.Artist == "" || o.Artist == null ? "-" : o.Artist}</div>
          <div className='songDesigner'>{o.Uploader +"@"+ o.Designer}</div>
          <div className='songLevel downloadButtonBox' onClick={downloadSong({id:o.Id,title:o.Title})}>
            <svg className='downloadButton' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
          </div>
          <Levels levels={o.Levels} songid={o.Id} />
          
        </div>
      </div>
    </div>));
  // 渲染数据
  return (<>
    <SearchBar onChange={e => filterBySearch(e)} />
    <div className='theList'>{list}</div>
  </>);
}