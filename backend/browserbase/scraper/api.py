from fastapi import FastAPI
from pydantic import BaseModel
from tasks import scrape_and_store

app = FastAPI()

class SearchRequest(BaseModel):
    username: str
    password: str
    query: str

@app.post("/scrape")
def trigger_scrape(req: SearchRequest):
    scrape_and_store.delay(req.username, req.password, req.query)
    return {"status": "Job submitted"}