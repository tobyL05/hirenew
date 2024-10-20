"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import useWebcam from "@/utils/useWebcam";
import * as R from "remeda"
import { useUidStore } from "@/stores/useUidStore";

interface cleaned_message {
  type: string
  message: string
}

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();
  const { stopWebcam } = useWebcam()
  const { messages } = useVoice()
  const uid = useUidStore((state) => state.uid)

  function sendMessages() {
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
    return cleanedMsgs
  }

  function sendExpressions() {
    let expressions = new Map()
    messages.map((msg) => {
        if (msg && msg.type === "user_message") {
            const values = msg.models.prosody?.scores
            if (!values) return;

            const top3 = R.pipe(
                values,
                R.entries(),
                R.sortBy(R.pathOr([1], 0)),
                R.reverse(),
                R.take(3),
            );

            top3.forEach(([key, value]) => {
                if (expressions.has(key)) {
                    let prev = expressions.get(key) || [];
                    prev.push(value);
                    expressions.set(key, prev);
                } else {
                    expressions.set(key, [value]);
                }
            });
          }
    })
    // Convert the map to an array of [key, value] pairs
    const entriesArray = Array.from(expressions.entries());

    // Sort the array by value in descending order
    const sortedEntries = entriesArray.sort((a, b) => b[1] - a[1]);

    // Get the top 3 entries
    const top3 = sortedEntries.slice(0, 3);

    return top3;

  }

  async function save() {
    const cleanedMsgs = sendMessages();
    const expressions = sendExpressions();
    console.log(uid) // null here
    try {
        const response = await fetch('http://localhost:3001/interviewRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,  // null???????
          interviewRecord: cleanedMsgs,  
          expressions: expressions 
        }),
      });

      console.log("Saving interview")

      if (!response.ok) {
        throw new Error('Failed to send interview record');
      }

      const data = await response.json();
      console.log('Interview record sent successfully:', data);
    } catch (error) {
      console.error('Error sending messages:', error);
    }
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
              onClick={async () => {
                stopWebcam();
                disconnect();
                await save()
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
