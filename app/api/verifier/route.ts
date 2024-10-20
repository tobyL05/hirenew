import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const params = await request.json();
    // call github api here?
    console.log(params)
    console.log("verifier triggered")
    const payload = {
        "cid": "Toby",
        "category": "project",
        "text": params.parameters
    }
    await fetch('http://127.0.0.1:5000/verifyapi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    return NextResponse.json({
        success: true,
        data: true // this is important. Determines the bots response
    })
}