'use client'
import React from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url,{mode:"cors",credentials: "include"}).then((res) => res.json())
export default function UserInfo({apiroot}){
const { data, error, isLoading } = useSWR(apiroot + "/account/info/", fetcher);
  if(error) return <div className='linkContent'><a href='./login'>登录</a></div>
  if(isLoading) return <div className='linkContent'><a href='./login'>...</a></div>
  if(data.Username == undefined) return <div className='linkContent'><a href='./login'>登录</a></div>
  return <div className='linkContent'><a href='./user'>{'用户:'+data.Username}</a></div>
}