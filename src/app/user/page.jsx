'use client'
import React from 'react';
import 'react-photo-view/dist/react-photo-view.css';
//import useSWR from 'swr';
import { useRouter } from 'next/navigation'
import UserInfo from '../userinfo';

const apiroot = 'http://101.132.193.53:5003/api'

export default function Page() {
  return (
    <>
      <div className='seprate'></div>
      <h1><img className="xxlb"src="./salt.webp" onClick={()=>alert("不要点我 操你妈")}></img>MajOnline.Beta</h1>
      <div className='links'>
      <div className='linkContent'><a href='../'>返回</a></div>
      <UserInfo apiroot={apiroot}/>
      <Logout/>
      </div>
      {/* <UserInfoDetail/> */}
      <Uploader/>
    </>
  )
}

//const fetcher = (...args) => fetch(...args).then((res) => res.json())

function getCookie(cname) {
  let name = cname + "=";
  if (typeof window !== 'undefined') {
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
  }
}
  return "";
}

// function UserInfoDetail(){
//   const router = useRouter()
//   const token = getCookie('token')
//   if(token=='') router.push('./login')
//   const { data, error, isLoading } = useSWR(apiroot + "/User/Info/" + token, fetcher);
//   if(error) return <div className='linkContent'><a href='./login'>error</a></div>
//   if(isLoading) return <div className='linkContent'><a href='./login'>...</a></div>
//   return (<>
//     {/* <div>{data.Username}</div>
//     <div>{data.Email}</div> */}
//   </>
//   )
// }

function Logout(){
  const router = useRouter()
  return <div className='linkContent' onClick={()=>{
    if (typeof window !== 'undefined') { 
    document.cookie = "token="
    //TODO should be a request that disable the token
    }
    router.push('./login')
  }}>登出</div>
}

function Uploader(){
  const router = useRouter()
  async function onSubmit(event) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    formData.set('token',getCookie('token'))
    if (typeof window !== 'undefined') { 
    document.getElementById("submitbutton").disabled = true;
    document.getElementById("submitbutton").textContent = "上传中啦等一会啦";
    }
    const response = await fetch(apiroot+'/Uploader/Chart', {
      method: 'POST',
      body: formData,
    })
    if (response.status !=200){
      alert(await response.text())
      if (typeof window !== 'undefined') { 
      document.getElementById("submitbutton").textContent = "上传";
      document.getElementById("submitbutton").disabled = false;
      }
      return
    }
    alert('上传成功')
    router.push('../')
  }
  return (
    <div className='theList'>
      <form className='formbox' onSubmit={onSubmit}>
        <div className='inputHint'>maidata</div>
        <input className='userinput' type="file" name="formfiles" />
        <div className='inputHint'>bg</div>
        <input className='userinput' type="file" name="formfiles" />
        <div className='inputHint'>track</div>
        <input className='userinput' type="file" name="formfiles" />
        <button className='linkContent' id='submitbutton' type="submit">上传</button>
      </form>
    </div>
  )
}