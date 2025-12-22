'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
 import Link from 'next/link'
 
 export default function SignupPage() {
    const [user,setUser]=useState({
        email: "",
        password: "",
        username: "",
    })
    const router = useRouter()
    const [buttonDisabled,setButtonDisabled]=useState(false)
    const onSignup = async()=>{
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
await fetch("/api/users/signup", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
router.push('/login')
        } catch (error) {
            console.log("signup failed")
        }
    }
    useEffect(()=>{
        if(user.email.length>0&&user.password.length>0&&user.username.length>0){
            setButtonDisabled(false)
        }else{
            setButtonDisabled(true)
        }
        },[user])
   return (
     <div>
     <div className="username">
     <label htmlFor="username">username</label>
     <input 
     id='username'
     value={user.username}
     onChange={(e)=>setUser({...user,username: e.target.value})}
     type="text" /></div>
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
     <button onClick={onSignup}>{buttonDisabled?"noSignup":"signup"}</button>
     <Link href={"/login"}>I already have an account</Link>
     </div>
   )
 }
  