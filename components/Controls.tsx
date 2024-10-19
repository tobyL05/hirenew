"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import useWebcam from "@/utils/useWebcam";
import useExpressions from "@/utils/useExpressions";

interface cleaned_message {
  type: string
  message: string
}

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();
  const { stopWebcam } = useWebcam()
  const { messages } = useVoice()
  const { expressions } = useExpressions()

  async function sendMessages() {
    const cleanedMsgs: cleaned_message[] = []
    console.log(messages);
    const messagesFiltered = messages.filter((msg) => msg.type === "user_message" || msg.type === "assistant_message")
    console.log(messagesFiltered)
    console.log(messagesFiltered[0]);
    let prevmsg = messagesFiltered[0]
    let currmsg: string = prevmsg.message.content!
    for (let i = 1;i < messagesFiltered.length; i++) {
      if (messagesFiltered[i].type === prevmsg.type) {
        currmsg += " " + messagesFiltered[i].message.content
      } else {
        cleanedMsgs.push({
          type: prevmsg.type,
          message: prevmsg.message.content!
        })
        prevmsg = messagesFiltered[i]
        currmsg = prevmsg.message.content!
      }
    }
    cleanedMsgs.push({
      type: prevmsg.type,
      message: prevmsg.message.content!
    })
    // console.log(cleanedMsgs)

    try {
      const response = await fetch('https://newhire-backend.onrender.com/interviewRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewRecord: cleanedMsgs,  // Pass the cleaned messages as the interview record
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send interview record');
      }

      const data = await response.json();
      console.log('Interview record sent successfully:', data);
    } catch (error) {
      console.error('Error sending messages:', error);
    }
  }

  async function sendExpressions() {
    console.log(expressions)
     
    // send expressions to backend
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
        "bg-gradient-to-t from-card via-card/90 to-card/0",
      )}
    >
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className={
              "p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4"
            }
          >
            <Toggle
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
            >
              {isMuted ? (
                <MicOff className={"size-4"} />
              ) : (
                <Mic className={"size-4"} />
              )}
            </Toggle>

            <div className={"relative grid h-8 w-48 shrink grow-0"}>
              <MicFFT fft={micFft} className={"fill-current"} />
            </div>

            <Button
              className={"flex items-center gap-1"}
              onClick={() => {
                stopWebcam();
                disconnect();
                sendMessages();
                sendExpressions()
              }}
              variant={"destructive"}
            >
              <span>
                <Phone
                  className={"size-4 opacity-50"}
                  strokeWidth={2}
                  stroke={"currentColor"}
                />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
