import { ConnectionMessage, JSONMessage } from "@humeai/voice-react"
import { useState } from "react";
import * as R from "remeda";

const useExpressions = () => {
    const [expressions, setExpressions] = useState<Map<string, number[]>>(new Map())

    const getCurrentExpression = (message: JSONMessage | ConnectionMessage) => {
        if (message && message.type === "user_message") {
            const values = message.models.prosody?.scores
            if (!values) return;

            const top3 = R.pipe(
                values,
                R.entries(),
                R.sortBy(R.pathOr([1], 0)),
                R.reverse(),
                R.take(3),
            );

            const updatedExpressions = new Map(expressions); // Create a new Map to avoid direct mutation

            top3.forEach(([key, value]) => {
                if (updatedExpressions.has(key)) {
                    let prev = updatedExpressions.get(key) || [];
                    prev.push(value);
                    updatedExpressions.set(key, prev);
                } else {
                    updatedExpressions.set(key, [value]);
                }
            });
            console.log(updatedExpressions)
            setExpressions(updatedExpressions); // Update the state with the new Map
        }
    }

    return { expressions, getCurrentExpression }

}

export default useExpressions