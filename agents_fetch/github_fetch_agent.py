import requests
from uagents import Agent, Context, Model

agent = Agent(port=8001)

class Request(Model):
    github: str
 
class Response(Model):
    project: object

@agent.on_rest_post("/fetchgit", Request, Response)
async def fetch_github_projects(ctx: Context, req: Request) -> Response:
    """Fetches GitHub projects of a particular user and logs their metadata."""
    ctx.logger.info("In Git")
    response = requests.get(f"https://api.github.com/users/{req.github}/repos")
    result = []
    if response.status_code == 200:
        repos = response.json()
        if repos:
            for repo in repos:
                repo_name = repo.get("name")
                description = repo.get("description") or "No description provided"
                language = repo.get("language") or "Not specified"
                result.append(f"Repository: {repo_name}\nDescription: {description}\nLanguage: {language}\n\n")
        else:
            ctx.logger.info("No repositories found for the specified user.")
    else:
        ctx.logger.error(f"Failed to fetch GitHub projects. Status code: {response.status_code}")
    return Response(project=result)
    

if __name__ == "__main__":
    agent.run()
