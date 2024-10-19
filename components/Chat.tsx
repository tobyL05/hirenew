"use client";

import { useVoice, VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { useEffect, useState, useRef, ComponentRef } from "react";
import { VideoChat } from "./video-chat";

export default function ClientComponent({
  accessToken,
  uid
}: {
  accessToken: string;
  uid:string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  const [interviewData, setInterviewData] = useState({
    name: "",
    role: "",
    company: "",
    job_description: "",
    questions: ""
  });
  const [loading, setLoading] = useState(true); // Loading state to stall rendering

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/questions/${uid}`);
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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching interview details:", error);
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [uid]);

  if (loading) {
    return <div>Loading interview details...</div>;
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
        sessionSettings={{
            type: "session_settings",
            // generate a systemprompt later
            // systemPrompt: "Address the user by their name {{name}}. In the beginning, tell the candidate that they are interviewing for the {{role}} role at {{company}}. Wait for a response from the candidate. If the candidate is speaking, do not speak.", // generate based on candidate's resume and job desc
            variables: {
                name: interviewData.name,
                role: interviewData.role,
                company: interviewData.company,
                questions: interviewData.questions,
                job_description: interviewData.job_description
            }
        }}
        onMessage={() => {

        }}
      >
        <VideoChat />
        {/* <Messages ref={ref} /> */}
        <Controls />
        <StartCall company_name={interviewData.company} role={interviewData.role} />
      </VoiceProvider>
    </div>
  );
}
