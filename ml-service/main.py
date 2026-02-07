from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from recommendation_engine import analyze_student
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml-service")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudentProfile(BaseModel):
    skills: List[str]
    gpa: float
    interests: List[str]
    domain: Optional[str] = "General"

@app.get("/")
def read_root():
    return {"status": "ML Service is Model Ready"}

@app.post("/recommend")
def recommend_endpoint(profile: StudentProfile):
    logger.info(f"Received recommendation request for Domain: {profile.domain}")
    logger.info(f"Student Skills: {profile.skills}")
    
    result = analyze_student(profile)
    
    logger.info(f"Analysis Complete: Probability={result['placement_probability']}%")
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
