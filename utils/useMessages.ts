import { ConnectionMessage, JSONMessage } from "@humeai/voice-react"
import { useState } from "react"

const useMessages = () => {
    const [messages, setMessages] = useState<(JSONMessage | ConnectionMessage)[]>([])

    const addMessage = (message: JSONMessage | ConnectionMessage) => {
        setMessages((prevmsgs) => [...prevmsgs,message])
    }

    const sendMessages = async () => {
        console.log("sendMessages")
        console.log(messages)
        messages.forEach((msg) => {
            console.log(msg)
        })
        // send messages to backend
    }

    return { addMessage, sendMessages }
}

export default useMessages