import { ConnectionMessage, JSONMessage } from "@humeai/voice-react"
import * as R from "remeda";

const useExpressions = () => {
    const expressions = new Map(); 

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

            top3.map(([key, value]) => {
                if (expressions.has(key)) {
                    let prev = expressions.get(key)
                    prev.push(value)
                    expressions.set(key,prev)
                } else {
                    expressions.set(key, [value])
                }
            })

            // send expressions to backend somehow. process here first (take avg)?
        }
    }

    return { getCurrentExpression }

}

export default useExpressions