import requests
import json
from uagents import Agent, Context, Model

agent = Agent(port=8005)

class Request(Model):
    cid: str
    text: str
 
class Response(Model):
    result: bool

@agent.on_rest_post("/expcheck", Request, Response)
async def check_experience(ctx: Context, req: Request) -> Response:
    # Load the JSON file based on cid
    try:
        with open(f"{req.cid}.json", "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        return Response(result=False)

    # Extract the linkedinData > experience list
    experiences = data.get("linkedinData", {}).get("experience", [])
    experiences_str = json.dumps(experiences)

    # Create a prompt to provide better context to Perplexity API
    prompt = (
        "The following is a list of work experiences that the candidate has had: "
        f"{experiences_str}. "
        "Given the statement: '{req.text}', determine if the candidate has actually had the mentioned work experience based on the provided list. "
        "Respond with true if the experience is clearly part of the candidate's work history, otherwise respond with false."
    )

    # Make a call to Perplexity API to verify if the experience is mentioned
    perplexity_endpoint = "https://api.perplexity.ai/verify"
    payload = {
        "prompt": prompt
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY_HERE"
    }

    try:
        response = requests.post(perplexity_endpoint, headers=headers, json=payload)
        response_data = response.json()
        is_valid = response_data.get("isValid", False)
    except Exception as e:
        # In case of an error, default to False
        is_valid = False

    return Response(result=is_valid)

if __name__ == "__main__":
    agent.run()
