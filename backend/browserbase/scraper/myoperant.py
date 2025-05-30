import operant
import os
import openai
from dotenv import load_dotenv
load_dotenv()

token = os.getenv("OPENAI_API_KEY", "")
if not token:
    raise ValueError("OPENAI_API_KEY is missing")
client = openai.OpenAI(api_key=token)

def recommend_rfps(rfps, context):

    # Gatekeep OpenAI calls with the one line code addition in the next line.
    operant.ai.gatekeep(client, "openai") 
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        store=True,
        messages=[
            {
                "role": "user",
                "content": f'Recommend the top 3 most relevant rfps (requests for proposals) from the following list {rfps}, based on company context {context}',
            }
        ],
    )
    # Based on Operant policies set, this call could end up either alerting 
    # or getting blocked or redacted before the request reaches OpenAI
    print(response.choices)
    return response.choices