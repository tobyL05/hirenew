import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";

const InterviewStart = ({ company_name, role }: { company_name: string; role: string }) => {

  const { status, connect } = useVoice();

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={
            "fixed inset-0 p-4 flex items-center justify-center bg-background"
          }
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <div className="flex flex-col align-middle items-center justify-around space-y-4">
            <h1 className="w-full text-center text-primary text-xl">Welcome to hire_new, your AI interviewer. You are currently interviewing for {role} at {company_name}</h1>
            <AnimatePresence>
              <motion.div
                variants={{
                  initial: { scale: 0.5 },
                  enter: { scale: 1 },
                  exit: { scale: 0.5 },
                }}
              >
                <div className="w-40 flex flex-col align-middle justify-evenly">
                  <Button
                    className={"z-50 flex items-center gap-1.5 w-30"}
                    onClick={() => {
                      connect()
                    }}
                  >
                    <span>
                      <Phone
                        className={"size-4 opacity-50"}
                        strokeWidth={2}
                        stroke={"currentColor"}
                      />
                    </span>
                    <span>Start Interview</span>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          </motion.div>
        ) : null}
    </AnimatePresence>
  );
}

export default InterviewStart;