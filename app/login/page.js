'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
 import Link from 'next/link'
 
 export default function loginPage() {
    const [user,setUser]=useState({
        email: "",
        password: "",
    })
    const router = useRouter()
    const [buttonDisabled,setButtonDisabled]=useState(false)
    const onLogin = async()=>{
        try {
            const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
const raw =  JSON.stringify(user);
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};
await fetch("/api/users/login", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
router.push('/dashboard')
        } catch (error) {
            console.log("Login failed")
        }
    }
    useEffect(()=>{
        if(user.email.length>0&&user.password.length>0){
            setButtonDisabled(false)
        }else{
            setButtonDisabled(true)
        }
        },[user])
   return (
     <div>
     <div className="email">
     <label htmlFor="email">email</label>
     <input 
     id='email'
     value={user.email}
     onChange={(e)=>setUser({...user,email: e.target.value})}
     type="text" /></div>
     <div className="password">
     <label htmlFor="password">passowrd</label>
     <input 
     id='password'
     value={user.password}
     onChange={(e)=>setUser({...user,password: e.target.value})}
     type="password" /></div>
     <button onClick={onLogin}>{buttonDisabled?"noLogin":"Login"}</button>
     <Link href={"/signup"}>I do not have an account(signup)</Link>
     </div>
   )
 }
  