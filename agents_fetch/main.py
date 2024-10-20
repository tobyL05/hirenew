from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# Wrapper for the /main route of the agent
@app.route('/api', methods=['POST'])
def main_route():
    try:
        # Extract data from the incoming request
        req_data = request.get_json()

        # Forward the request to the agent running on port 8010
        agent_url = 'http://0.0.0.0:8010/main'
        agent_response = requests.post(agent_url, json=req_data)

        # Get the response from the agent and return it
        if agent_response.status_code == 200:
            return jsonify(agent_response.json())
        else:
            return jsonify({"error": "Agent responded with an error"}), agent_response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/verifyapi', methods=['POST'])
def verify_route():
    try:
        # Extract data from the incoming request
        req_data = request.get_json()

        # Forward the request to the agent running on port 8010
        agent_url = 'http://0.0.0.0:8006/verify'
        agent_response = requests.post(agent_url, json=req_data)

        # Get the response from the agent and return it
        if agent_response.status_code == 200:
            return jsonify(agent_response.json())
        else:
            return jsonify({"error": "Agent responded with an error"}), agent_response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
