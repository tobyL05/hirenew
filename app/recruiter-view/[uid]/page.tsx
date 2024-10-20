"use client"

import { useEffect } from "react";


export default function Page({ params }: { params: { uid: string } }) {
    const { uid } = params;

    useEffect(() => {
        const fetchInterview = async () => {
            const req = await fetch(`http://localhost:3001/generate-insights/${uid}`,{
                headers: {
                    "Content-Type": "application/json"
                },
            })
            const res = await req.json();
            console.log(res)
        }
        fetchInterview()
    },[])

    return (
        <h1>hellop</h1> 
    )
}