"use client";

import { useVoice, VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { VideoChat } from "./video-chat";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

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
                name: "Bob", // candidate name
                role: "Software Engineer", // candidate role
                company: "Hume AI" // company name
            }
        }}
        onMessage={() => {

        }}
      >
        <VideoChat />
        {/* <Messages ref={ref} /> */}
        <Controls />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}
