import requests
import json
from uagents import Agent, Context, Model

agent = Agent(port=8003)

class Request(Model):
    cid: str
    text: str
 
class Response(Model):
    result: bool

@agent.on_rest_post("/projectcheck", Request, Response)
async def check_project(ctx: Context, req: Request) -> Response:
    # Load the JSON file based on cid
    try:
        with open(f"{req.cid}.json", "r") as file:
            data = json.load(file)
    except FileNotFoundError:
        return Response(result=False)

    # Extract the githubData > project array
    projects = data.get("githubData", {}).get("project", [])
    projects_str = json.dumps(projects)

    # Create a prompt to provide better context to Perplexity API
    prompt = (
        "The following is a list of projects that the candidate has worked on: "
        f"{projects_str}. "
        "Given the statement: '{req.text}', determine if the candidate has actually worked on the mentioned project based on the provided list. "
        "Respond with true if the project is clearly part of the candidate's work history, otherwise respond with false."
    )

    # Make a call to Perplexity API to verify if the project is mentioned
    perplexity_endpoint = "https://api.perplexity.ai/verify"
    payload = {
        "prompt": prompt
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
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
