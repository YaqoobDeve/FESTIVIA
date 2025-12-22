"use client"

import Link from "next/link";
import { useRouter } from "next/router"
import { useEffect } from "react";
import { useState } from "react";


export default function dashboard() {
    const router = useRouter;
    const [data, setData] = useState("")
    useEffect(()=>{
         const getUserDetails = async () => {
        try {
            const response = await fetch("/api/users/dashboard", { method: "POST", })
            setData(response.data.data._id)
        } catch (error) {
            console.error(error)
        }
    }
    })
    const logout = async () => {
        try {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            fetch("/api/users/logout", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
                router.push("/login")
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <h1>My profile</h1>
            <h2>{data ==="nothing"?"Nothing":<Link href={`/profile/${data}`}>{data}</Link> }</h2>
            <hr />
            <button onClick={logout}>Logout</button>
        </div>
    )
}