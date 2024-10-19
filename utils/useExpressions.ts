import { ConnectionMessage, JSONMessage } from "@humeai/voice-react"
import * as R from "remeda";

const useExpressions = () => {

    const getCurrentExpression = (message: JSONMessage | ConnectionMessage) => {
        if (message && message.type === "assistant_message") {
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
                console.log(key);
                console.log(value);
                console.log();
            })
            
            // send expression to backend for processing
        }
    }

    return { getCurrentExpression }

}

export default useExpressions