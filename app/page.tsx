"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter()
    return (
        <div className="mx-auto mt-52 flex flex-col align-start space-y-4">
            <h1 className="text-8xl">candidate_compare</h1>
            <h2 className="text-4xl">streamline interviews</h2>
            <div className="flex justify-evenly space-x-4">
                <Button
                    className="w-1/2"
                    onClick={() => router.push("/new-interview")}
                >
                    <span>generate an interview</span>
                </Button>
                <Button
                    className="w-1/2"
                    onClick={() => router.push("/recruiter-view")} 
                >
                    <span>view interviews</span>
                </Button>
            </div>
        </div>
    )
}
