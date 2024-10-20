import json
import aiohttp
from uagents import Agent, Context, Model
import os

verify_agent = Agent(port=8006)

class VerificationRequest(Model):
    cid: str
    category: str
    text: str = ""

class VerificationResponse(Model):
    result: str

@verify_agent.on_rest_post("/verify", VerificationRequest, VerificationResponse)
async def verify(ctx: Context, req: VerificationRequest) -> VerificationResponse:
    """
    Verify the candidate's project, certification, or experience, or retrieve the result.
    """
    cid = req.cid
    category = req.category.lower()
    text = req.text
    file_name = f"{cid}.json"

    # Check if result request is made
    if category == 'result':
        if os.path.exists(file_name):
            with open(file_name, 'r') as file:
                data = json.load(file)
            return VerificationResponse(result=json.dumps(data))
        else:
            return VerificationResponse(result="Profile not found")
    
    # API endpoints for verification
    api_mapping = {
        "project": "http://0.0.0.0:8003/projectcheck",
        "certification": "http://0.0.0.0:8004/certicheck",
        "experience": "http://0.0.0.0:8005/expcheck"
    }
    
    if category not in api_mapping:
        return VerificationResponse(result="Invalid category")

    # Make the API call for verification
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(api_mapping[category], json={"cid":cid,"text": text}) as response:
                verification_result = await response.text()
                verification_result = verification_result.strip().lower() == 'true'
        except Exception as e:
            ctx.logger.error(f"Error during verification: {e}")
            return VerificationResponse(result="Error during verification")
    
    # Read the candidate profile
    if not os.path.exists(file_name):
        return VerificationResponse(result="Profile not found")

    with open(file_name, 'r') as file:
        data = json.load(file)

    # Update confidence and false count based on verification result
    if not verification_result:
        if category == "project":
            data["confidence"] = max(0, data["confidence"] - 20)
            data["fprojects"] = data.get("fprojects", 0) + 1
        elif category == "certification":
            data["confidence"] = max(0, data["confidence"] - 5)
            data["fcertifications"] = data.get("fcertifications", 0) + 1
        elif category == "experience":
            data["confidence"] = max(0, data["confidence"] - 30)
            data["fexperiences"] = data.get("fexperiences", 0) + 1

    # Save the updated profile
    with open(file_name, 'w') as file:
        json.dump(data, file)

    return VerificationResponse(result="Verification complete")

if __name__ == "__main__":
    verify_agent.run()
