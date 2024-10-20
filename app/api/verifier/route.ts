import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { params } = await request.json();
    // call github api here?
    console.log("verifier triggered")
    console.log(params)
    return NextResponse.json({
        success: true,
        data: true // this is important. Determines the bots response
    })
}