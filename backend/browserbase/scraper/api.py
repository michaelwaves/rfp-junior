from fastapi import FastAPI
from pydantic import BaseModel
from bb import search
import uvicorn
app = FastAPI()
class SearchRequest(BaseModel):
    username: str
    password: str
    query: str

@app.post("/scrape")
def trigger_scrape(req: SearchRequest):
    res = search(req.username, req.password, req.query)
    return {"status": "Job submitted","results":res}

if __name__=="__main__":
    uvicorn.run("api:app",host="0.0.0.0",port=3000, reload=True)