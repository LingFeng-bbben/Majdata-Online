'use client'
import React from 'react';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json())
export default function UserInfo({apiroot}){
  function getCookie(cname) {
      if (typeof window !== 'undefined') { 
      let name = cname + "=";
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
  const token = getCookie('token')
  const { data, error, isLoading } = useSWR(apiroot + "/User/Info/" + token, fetcher);
  if(error) return <div className='linkContent'><a href='./login'>登录(上传)</a></div>
  if(isLoading) return <div className='linkContent'><a href='./login'>...</a></div>
  if(data.Username == undefined) return <div className='linkContent'><a href='./login'>登录(上传)</a></div>
  return <div className='linkContent'><a href='./user'>{'用户:'+data.Username}</a></div>
}