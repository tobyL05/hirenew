import json
import aiohttp
from uagents import Agent, Context, Model

agent = Agent(name='Main', seed = 'dhjsgjhdsgvs',port=8010, endpoint=['http://localhost:8010/submit'])

class Request(Model):
    cid: str
    github: str
    linkedin: str
    pass
 
class Response(Model):
    text: str

@agent.on_rest_post("/main", Request, Response)
async def save_profile(ctx: Context, req: Request) -> Response:
    """
    Store the candidate's information in JSON format.
    """
    profile_data = {
        "candidate": req.cid,
        "confidence": 100,
        "githubData": {},
        "linkedinData": {}

    }

    # Making API calls to fetch GitHub and LinkedIn data
    async with aiohttp.ClientSession() as session:
        try:
            # Fetching GitHub data
            async with session.post('http://0.0.0.0:8001/fetchgit',  json={"github": req.github}) as git_response:
                git_data = await git_response.json(content_type=None)
                profile_data["githubData"] = git_data

            # # Fetching LinkedIn data
            async with session.post('http://0.0.0.0:8002/fetchlink', json={"linkedin": req.linkedin}) as link_response:
                link_data = await link_response.json(content_type=None)
                profile_data["linkedinData"] = link_data['text']

        except Exception as e:
            ctx.logger.error(f"Error fetching data: {e}")

    ctx.logger.info(f"Saving profile for candidate: {req.cid}")
    ctx.storage.set("profile", json.dumps(profile_data))
    with open(req.cid+'.json', 'w') as file:
        json.dump(profile_data, file)
    ctx.logger.info(f"Profile for {req.cid} saved successfully!")
    return Response(text="Done")

if __name__ == "__main__":
    agent.run()
