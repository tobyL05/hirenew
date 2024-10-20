"use client";

import { ToolCallHandler, VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { useEffect, useState } from "react";
import { VideoChat } from "./video-chat";
import { useRouter } from "next/navigation"
import { useUidStore } from "@/stores/useUidStore";

export default function ClientComponent({
  accessToken,
  uid
}: {
  accessToken: string;
  uid:string;
}) {
  const router = useRouter()
  const setUid = useUidStore((state) => state.setUid)

  const [interviewData, setInterviewData] = useState({
    name: "",
    role: "",
    company: "",
    job_description: "",
    questions: ""
  });
  const [loading, setLoading] = useState(true); // Loading state to stall rendering

  useEffect(() => {
    if (uid) {
      console.log(uid) // works here
      setUid(uid)
    }
  },[uid])


  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/questions/${uid}`)
        // const response = await fetch(`https://newhire-backend.onrender.com/questions/${uid}`);
        if (response.ok) {
          const data = await response.json();
          setInterviewData({
            name: data.name || "Unknown",
            role: data.role || "Unknown Role",
            company: data.company || "Unknown Company",
            job_description: data.job_description || "No job description available",
            questions: data.questions
          });
          setLoading(false);
        } else {
          console.error("Failed to fetch interview details");
          router.push("/Error") 
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching interview details:", error);
        router.push("/Error")
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [uid]);

    const handleToolCall: ToolCallHandler = async (message, send) => {
        if (message.name === "verifier") {
            try {
                const response = await fetch('/api/verifier', {
                    method: "POST",
                    headers: {'Content-Type': "application/json"},
                    body: JSON.stringify({ parameters: message.parameters }),
                })

                const result = await response.json()

                if (result.success) {
                    return send.success(result.data)
                } else {
                    return send.error(result.data)
                }
            } catch (error) {
                return send.error({
                    error: 'verifier_error',
                    code: 'verifier_error',
                    level: 'warn',
                    content: 'An error occurred during verification',
                    });
            }
        }
        return send.error({
            error: 'Tool not found',
            code: 'tool_not_found',
            level: 'warn',
            content: 'The tool you requested was not found',
        });
    }


  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={process.env.NEXT_PUBLIC_HUME_CONFIG_ID}
        onClose={(e) => {
          router.push("/thank-you")
        }}
        sessionSettings={{
            type: "session_settings",
            variables: {
                name: interviewData.name,
                role: interviewData.role,
                company: interviewData.company,
                questions: interviewData.questions,
                job_description: interviewData.job_description
            }
        }}
        onToolCall={handleToolCall}
      >
        <VideoChat />
        {/* <Messages ref={ref} /> */}
        <Controls />
        <StartCall company_name={interviewData.company} role={interviewData.role} />
      </VoiceProvider>
    </div>
  );
}
