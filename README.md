# AI-Based Placement Analytics and Skill Recommendation System

This generic platform analyzes historical placement data and student performance to identify skill gaps and recommend training programs that improve employability.

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **ML Service**: Python (FastAPI)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- Python (3.8+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with MONGODB_URI and JWT_SECRET
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. ML Service Setup
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
