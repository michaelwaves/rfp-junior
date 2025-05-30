from fastapi import FastAPI
from pydantic import BaseModel
from bb import search
from myoperant import recommend_rfps
import uvicorn
app = FastAPI()
class SearchRequest(BaseModel):
    username: str
    password: str
    query: str
    context:str

@app.post("/scrape")    
def trigger_scrape(req: SearchRequest):
    res = search(req.username, req.password, req.query)
    print(res)
    recommendation = recommend_rfps(res["results"], req.context)
    print(recommendation)
    return {"status": "Job submitted","results":res["results"],"session_link":res["session_link"], 'recommendation':recommendation}

if __name__=="__main__":
    uvicorn.run("api:app",host="0.0.0.0",port=8081, reload=True)