"use client"

import { Button } from "@/components/ui/button";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter()
    return (
        <div className="mx-auto mt-52 flex flex-col align-start space-y-4">
            <h1 className="text-8xl">hire_new</h1>
            <h2 className="text-4xl">streamline interviews</h2>
            <div className="flex justify-evenly">
                <Button
                    onClick={() => router.push("/new-interview")}
                >
                    <span>generate an interview</span>
                </Button>
                <div className="flex flex-col align-middle items-center">
                    <Button
                        onClick={() => {}} 
                        disabled
                    >
                        <span>view pending interviews</span>
                    </Button>
                    <label className="text-sm">coming soon!</label>
                </div>
            </div>
        </div>
    )
}
