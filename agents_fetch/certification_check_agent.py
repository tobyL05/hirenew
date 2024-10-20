import requests
import json
from uagents import Agent, Context, Model

agent = Agent(port=8004)

class Request(Model):
    cid: str
    text: str
 
class Response(Model):
    result: bool

@agent.on_rest_post("/certicheck", Request, Response)
async def check_certification(ctx: Context, req: Request) -> Response:
    # Load the JSON file based on cid
    try:
        with open(f"{req.cid}.json", "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        return Response(result=False)

    # Extract the linkedinData > certifications list
    certifications = data.get("linkedinData", {}).get("certifications", [])
    certifications_str = json.dumps(certifications)

    # Create a prompt to provide better context to Perplexity API
    prompt = (
        "The following is a list of certifications that the candidate has obtained: "
        f"{certifications_str}. "
        "Given the statement: '{req.text}', determine if the candidate has actually obtained the mentioned certification based on the provided list. "
        "Respond with true if the certification is clearly part of the candidate's obtained certifications, otherwise respond with false."
    )

    # Make a call to Perplexity API to verify if the certification is mentioned
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
