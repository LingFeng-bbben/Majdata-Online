'use client'
import React from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import md5 from 'js-md5'
import { useRouter } from 'next/navigation'

const apiroot = 'http://101.132.193.53:5003/api'

export default function Page() {
  return (
    <>
      <div className='seprate'></div>
      <h1><img className="xxlb"src="./salt.webp" onClick={()=>alert("不要点我 操你妈")}></img>MajOnline.Beta</h1>
      <div className='links'>
      <div className='linkContent'><a href='../'>返回</a></div>
      <div className='linkContent'><a href='./login'>登录</a></div>
      <div className='linkContent'><a href='./register'>注册</a></div>
      </div>
      <Register/>
    </>
  )
}

function Register(){
  const router = useRouter()
  async function onSubmit(event) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    if(formData.get('password')!=formData.get('password2')){
      alert('密码不一致')
      return
    }
    formData.set('password',md5(formData.get('password')))
    const response = await fetch(apiroot+'/User/Register', {
      method: 'POST',
      body: formData,
    })
    if (response.status !=200){
      alert(await response.text())
    }
    router.push('/login')
    // Handle response if necessary
    //const data = await response.json()
    // ...
  }
  return (
    <div className='theList'>
      <form className='formbox' onSubmit={onSubmit}>
        <div className='inputHint'>用户名</div>
        <input className='userinput' type="text" name="username" />
        <div className='inputHint'>密码</div>
        <input className='userinput' type="password" name="password" />
        <div className='inputHint'>确认密码</div>
        <input className='userinput' type="password" name="password2" />
        <div className='inputHint'>邮箱</div>
        <input className='userinput' type="email" name="email" />
        <div className='inputHint'>邀请码</div>
        <input className='userinput' type="text" name="invitecode" />
        <button className='linkContent' type="submit">确定</button>
      </form>
    </div>
  )
}
