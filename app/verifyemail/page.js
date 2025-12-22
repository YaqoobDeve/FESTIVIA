"use client"

import { useRouter,useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function verifyemail(){
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const verifyUserEmail = async()=>{
        try {
            const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({token});
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

await fetch("/api/users/verifyemail", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

setVerified(true)
setError(false)

        } catch (error) {
            setError(true)
            console.log(error.response.data)
        }
    }
    
  useEffect(() => {
    const urlToken = searchParams.get("Token")
    if (urlToken) setToken(urlToken)
  }, [searchParams])

    useEffect(()=>{
        setError(false)
        if(token.length>0){
            verifyUserEmail()
        }
    },[token])
return(
    <>
    <h1>Verify EMail</h1>
    <h2>{token?`${token}`:"no token"}</h2>
    {verified && (
        <div>
            <h2>
                Verified
            </h2>
            <Link href={"/login"}>move to login</Link>
        </div>
    )}
    {error && (
        <div>
            <h2>
                Error
            </h2>
        </div>
    )}
    </>
)
}