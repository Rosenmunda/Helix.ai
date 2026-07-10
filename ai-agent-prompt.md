# AI Agent Prompt: Essential Proteins & Drug Repurposing System
## Full-Stack Development Directive

---

## SYSTEM ROLE & OBJECTIVE

You are an **Industry-Level Full-Stack AI Development Agent** tasked with building a production-ready web application that predicts protein essentiality using multiple AI models and recommends repurposable drugs with biomedical research integration.

**Primary Goal:** Deliver a scalable, maintainable, well-tested system following enterprise software engineering practices, ready for real-world deployment.

---

## PROJECT SPECIFICATION

### Core Functionality
1. **Protein Intelligence:** Search and analyze ~10,000+ proteins with essentiality predictions
2. **Multi-Model Predictions:** Three parallel prediction engines (ML classifier, Graph Neural Network, Graph-based algorithm)
3. **Drug Repurposing:** Query DrugBank and external APIs to recommend approved/repurposable drugs
4. **Research Integration:** Fetch and display related biomedical papers from PubMed with DOI links
5. **AI Explanations:** Generate natural language explanations for predictions

### User Workflow
```
User Opens App
    ↓
Select Prediction Model (ML/GNN/Graph)
    ↓
View Model Performance Stats (Accuracy, Precision, Recall, F1, ROC-AUC)
    ↓
Search & Select Protein (via autocomplete dropdown)
    ↓
View Protein Details (Name, ID, PLI Score, External IDs)
    ↓
Click "Predict" Button
    ↓
Backend: Predict Essentiality + Generate Explanation
    ↓
Display Prediction (Essential/Non-Essential + Confidence)
    ↓
Query Drug & Research APIs
    ↓
Display Results:
  • AI Explanation (2-3 sentences)
  • Drug Recommendations (Table with approval status)
  • Related Research Papers (Links with DOI)
    ↓
Allow Download/Export of Full Report
```

---

## TECHNICAL REQUIREMENTS

### Stack & Architecture

**Frontend:**
- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand (client state) + TanStack Query (server state)
- **Build:** Vite (fast, ESM-native)
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier

**Backend:**
- **Framework:** FastAPI (async, OpenAPI auto-documentation)
- **Language:** Python 3.11+
- **ORM:** SQLAlchemy 2.0 (async)
- **Validation:** Pydantic v2
- **Async HTTP:** aiohttp or httpx
- **Caching:** Redis (in-memory cache, session store)
- **Database:** PostgreSQL (production), SQLite (development)
- **Task Queue:** Celery + Redis (optional, for async jobs)
- **Testing:** pytest + pytest-asyncio

**ML & Models:**
- Store trained models as `.pkl` (sklearn), `.pt` (PyTorch), or `.h5` (TensorFlow)
- Implement inference APIs that accept protein features and return predictions + confidence scores
- Model selection: Load model from disk on startup, cache in memory

**External Integrations:**
- **DrugBank API:** REST endpoint for drug querying by protein/gene ID
- **PubMed API:** E-utilities for searching papers by protein/gene
- **UniProt API:** Protein sequence/annotation data
- **NCBI Gene API:** Gene-to-protein mappings

**Infrastructure:**
- **Containerization:** Docker + docker-compose for local dev, production
- **CI/CD:** GitHub Actions (tests, linting, deployment)
- **Monitoring:** Prometheus metrics + Grafana dashboards
- **Logging:** Structured JSON logging (python-json-logger)
- **Deployment:** AWS EC2 / Google Cloud Run / DigitalOcean App Platform

---

## PHASE 1: FOUNDATION (Weeks 1-2)

### Objective
Establish project scaffold, database schema, and basic API/UI framework.

### Tasks

#### 1.1 Project Initialization

**Backend:**
```bash
# Create FastAPI project structure
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Settings (env vars, DB connection)
│   ├── models/
│   │   └── database.py         # SQLAlchemy ORM models
│   ├── schemas/
│   │   └── request_response.py # Pydantic request/response models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── proteins.py
│   │   ├── predictions.py
│   │   ├── drugs.py
│   │   ├── research.py
│   │   └── health.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── (services to be implemented in Phase 2)
│   ├── utils/
│   │   ├── exceptions.py       # Custom exception classes
│   │   └── logging.py          # Logger configuration
│   └── ml/
│       ├── __init__.py
│       └── (model loading stubs)
├── tests/
│   ├── __init__.py
│   ├── test_proteins.py
│   ├── test_predictions.py
│   └── conftest.py             # pytest fixtures
├── data/
│   └── proteins.csv            # Initial protein data
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

**Implementation Details:**
1. Create FastAPI app with CORS middleware enabled
2. Add structured logging with JSON output
3. Implement health check endpoint (`GET /health`)
4. Create custom exception handlers
5. Set up environment variable loading (python-dotenv)

**Code Skeleton:**
```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI(
    title="Essential Proteins API",
    version="1.0.0",
    description="API for protein essentiality prediction"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logger = logging.getLogger(__name__)

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

**Frontend:**
```bash
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── services/
│   │   └── api.ts              # API client
│   ├── store/
│   │   └── useStore.ts         # Zustand store
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

**Implementation Details:**
1. Set up Vite with React + TypeScript template
2. Install Tailwind CSS + shadcn/ui
3. Create responsive layout with Header + Sidebar
4. Implement basic API client (axios or fetch wrapper)
5. Create Zustand store for global state

**Code Skeleton:**
```typescript
// src/App.tsx
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
```

#### 1.2 Database Setup

**Create PostgreSQL Schema:**

```sql
-- Proteins Table
CREATE TABLE proteins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    protein_id VARCHAR(100),
    pli_score FLOAT DEFAULT NULL,
    external_id VARCHAR(100),
    gene_name VARCHAR(100),
    uniprot_id VARCHAR(50),
    features JSONB DEFAULT '{}',
    is_essential BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_protein_name ON proteins(name);
CREATE INDEX idx_protein_external_id ON proteins(external_id);
CREATE INDEX idx_protein_uniprot ON proteins(uniprot_id);

-- Model Statistics Table
CREATE TABLE model_statistics (
    id SERIAL PRIMARY KEY,
    model_type VARCHAR(50) UNIQUE NOT NULL, -- 'ML', 'GNN', 'Graph'
    accuracy FLOAT,
    precision FLOAT,
    recall FLOAT,
    f1_score FLOAT,
    roc_auc FLOAT,
    test_set_size INT,
    training_date TIMESTAMP,
    model_version VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions Table (for logging)
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    protein_id INT NOT NULL REFERENCES proteins(id) ON DELETE CASCADE,
    model_type VARCHAR(50) NOT NULL,
    prediction VARCHAR(50) NOT NULL, -- 'Essential' or 'Non-Essential'
    confidence FLOAT NOT NULL,
    features_hash VARCHAR(64), -- hash of input features for debugging
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INT
);

CREATE INDEX idx_predictions_protein_model ON predictions(protein_id, model_type);
CREATE INDEX idx_predictions_created ON predictions(created_at);

-- Explanations Table (LLM-generated)
CREATE TABLE explanations (
    id SERIAL PRIMARY KEY,
    prediction_id INT NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
    explanation_text TEXT NOT NULL,
    model_used_for_explanation VARCHAR(50), -- 'GPT', 'Claude', 'Local'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cached Drugs Table
CREATE TABLE cached_drugs (
    id SERIAL PRIMARY KEY,
    protein_id INT NOT NULL REFERENCES proteins(id) ON DELETE CASCADE,
    drug_name VARCHAR(255),
    drug_bank_id VARCHAR(100),
    approval_status VARCHAR(50), -- 'Approved', 'Experimental', etc.
    drug_type VARCHAR(50),
    external_source VARCHAR(100),
    retrieved_from_api_at TIMESTAMP,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP -- for cache invalidation
);

CREATE INDEX idx_cached_drugs_protein ON cached_drugs(protein_id);
CREATE INDEX idx_cached_drugs_expires ON cached_drugs(expires_at);

-- Cached Research Papers Table
CREATE TABLE cached_research (
    id SERIAL PRIMARY KEY,
    protein_id INT NOT NULL REFERENCES proteins(id) ON DELETE CASCADE,
    paper_title VARCHAR(500),
    doi VARCHAR(100),
    pubmed_id VARCHAR(50),
    abstract TEXT,
    authors TEXT, -- JSON array
    publication_year INT,
    journal VARCHAR(255),
    retrieved_from_api_at TIMESTAMP,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_cached_research_protein ON cached_research(protein_id);
CREATE INDEX idx_cached_research_expires ON cached_research(expires_at);

-- API Request Log (for monitoring)
CREATE TABLE api_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INT,
    response_time_ms INT,
    user_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_logs_created ON api_logs(created_at);
```

**SQLAlchemy Models:**
```python
# app/models/database.py
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Protein(Base):
    __tablename__ = "proteins"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    protein_id = Column(String(100))
    pli_score = Column(Float, nullable=True)
    external_id = Column(String(100))
    gene_name = Column(String(100))
    uniprot_id = Column(String(50), index=True)
    features = Column(JSON, default={})
    is_essential = Column(Boolean, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    predictions = relationship("Prediction", back_populates="protein", cascade="all, delete-orphan")
    cached_drugs = relationship("CachedDrug", back_populates="protein", cascade="all, delete-orphan")
    cached_research = relationship("CachedResearch", back_populates="protein", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    protein_id = Column(Integer, ForeignKey("proteins.id"), index=True)
    model_type = Column(String(50))
    prediction = Column(String(50))
    confidence = Column(Float)
    features_hash = Column(String(64))
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    execution_time_ms = Column(Integer)
    
    protein = relationship("Protein", back_populates="predictions")
    explanation = relationship("Explanation", back_populates="prediction", uselist=False, cascade="all, delete-orphan")

# ... Continue with other models
```

#### 1.3 Load Initial Data

**Load proteins.csv to Database:**

```python
# scripts/load_proteins.py
import pandas as pd
from sqlalchemy import create_engine
from app.models.database import Base, Protein

# Read CSV
df = pd.read_csv("data/proteins.csv")

# Create engine & tables
engine = create_engine("postgresql://user:password@localhost/proteins_db")
Base.metadata.create_all(engine)

# Load data
with engine.begin() as connection:
    df.to_sql("proteins", connection, if_exists="append", index=False)
    print(f"Loaded {len(df)} proteins")
```

#### 1.4 Docker Setup

**Dockerfile (Backend):**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml:**
```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: proteins_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/proteins_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:8000/api/v1

volumes:
  postgres_data:
```

#### 1.5 GitHub Actions CI/CD

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: cd backend && pytest tests/ --cov=app --cov-report=xml
      - uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run test

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
      - run: pip install flake8 black isort
      - run: flake8 backend/app --max-line-length=100
      - run: black --check backend/app
```

### Phase 1 Deliverables
- ✅ Scaffolded backend (FastAPI) with basic routes
- ✅ PostgreSQL schema with all necessary tables
- ✅ Initial data loaded (proteins.csv)
- ✅ Scaffolded frontend (React + Tailwind)
- ✅ Docker setup for local development
- ✅ GitHub Actions CI/CD pipeline
- ✅ Basic health check endpoint working

---

## PHASE 2: BACKEND CORE (Weeks 2-3)

### Objective
Implement all API endpoints with database integration, ML model loading, and external API integration.

### Tasks

#### 2.1 Protein Search & Management

**Endpoint: GET /api/v1/proteins/search**
```python
# app/routes/proteins.py
from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

router = APIRouter(prefix="/proteins", tags=["proteins"])

@router.get("/search")
async def search_proteins(
    q: str = Query(..., min_length=2, max_length=100),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search proteins by name (autocomplete)"""
    query = select(Protein).where(
        Protein.name.ilike(f"{q}%")
    ).limit(limit)
    
    result = await db.execute(query)
    proteins = result.scalars().all()
    
    return {
        "query": q,
        "count": len(proteins),
        "results": [
            {
                "id": p.id,
                "name": p.name,
                "protein_id": p.protein_id,
                "gene_name": p.gene_name,
                "pli_score": p.pli_score
            }
            for p in proteins
        ]
    }

@router.get("/{protein_id}")
async def get_protein(
    protein_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed protein information"""
    query = select(Protein).where(Protein.id == protein_id)
    result = await db.execute(query)
    protein = result.scalar_one_or_none()
    
    if not protein:
        raise HTTPException(status_code=404, detail="Protein not found")
    
    return {
        "id": protein.id,
        "name": protein.name,
        "protein_id": protein.protein_id,
        "uniprot_id": protein.uniprot_id,
        "gene_name": protein.gene_name,
        "pli_score": protein.pli_score,
        "external_id": protein.external_id,
        "features": protein.features,
        "is_essential": protein.is_essential
    }
```

**Pydantic Schemas:**
```python
# app/schemas/request_response.py
from pydantic import BaseModel
from typing import Optional, List

class ProteinResponse(BaseModel):
    id: int
    name: str
    protein_id: Optional[str]
    gene_name: Optional[str]
    pli_score: Optional[float]
    uniprot_id: Optional[str]
    
    class Config:
        from_attributes = True

class ProteinDetailResponse(ProteinResponse):
    features: dict
    is_essential: Optional[bool]
    external_id: Optional[str]

class ProteinSearchResponse(BaseModel):
    query: str
    count: int
    results: List[ProteinResponse]
```

#### 2.2 Model Statistics & Management

**Endpoint: GET /api/v1/models/metrics**
```python
# app/routes/models.py (to be created)
from fastapi import APIRouter

router = APIRouter(prefix="/models", tags=["models"])

@router.get("/metrics")
async def get_model_metrics(db: AsyncSession = Depends(get_db)):
    """Get performance metrics for all models"""
    query = select(ModelStatistics)
    result = await db.execute(query)
    stats = result.scalars().all()
    
    return {
        "models": [
            {
                "type": s.model_type,
                "accuracy": s.accuracy,
                "precision": s.precision,
                "recall": s.recall,
                "f1_score": s.f1_score,
                "roc_auc": s.roc_auc,
                "test_set_size": s.test_set_size,
                "training_date": s.training_date,
                "version": s.model_version
            }
            for s in stats
        ]
    }
```

**Model Loader Service:**
```python
# app/services/model_service.py
import pickle
import joblib
from pathlib import Path
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self, models_dir: str = "ml-models/trained_models"):
        self.models_dir = Path(models_dir)
        self._models_cache: Dict[str, Any] = {}
        self._load_all_models()
    
    def _load_all_models(self):
        """Load all trained models on startup"""
        try:
            self._models_cache['ML'] = joblib.load(self.models_dir / "ml_model.pkl")
            self._models_cache['GNN'] = pickle.load(open(self.models_dir / "gnn_model.pt", 'rb'))
            self._models_cache['Graph'] = pickle.load(open(self.models_dir / "graph_model.pkl", 'rb'))
            logger.info("All models loaded successfully")
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            raise
    
    def predict(self, model_type: str, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Make prediction with specified model
        
        Args:
            model_type: 'ML', 'GNN', or 'Graph'
            features: dict of protein features
        
        Returns:
            dict with prediction and confidence
        """
        if model_type not in self._models_cache:
            raise ValueError(f"Unknown model type: {model_type}")
        
        model = self._models_cache[model_type]
        
        # Convert features dict to feature vector (order matters!)
        feature_vector = self._features_to_vector(features, model_type)
        
        # Make prediction
        if model_type == 'GNN':
            prediction = self._predict_gnn(model, feature_vector)
        elif model_type == 'Graph':
            prediction = self._predict_graph(model, feature_vector)
        else:  # ML
            prediction = self._predict_ml(model, feature_vector)
        
        return prediction
    
    def _features_to_vector(self, features: Dict, model_type: str) -> list:
        """Convert feature dict to ordered vector"""
        # This depends on your specific features
        # Example: features = {'score1': 0.5, 'score2': 0.8, ...}
        # Return ordered list matching model's input shape
        pass
    
    def _predict_ml(self, model, X) -> Dict[str, Any]:
        """sklearn model prediction"""
        prediction = model.predict([X])[0]
        confidence = max(model.predict_proba([X])[0])
        return {
            "prediction": "Essential" if prediction == 1 else "Non-Essential",
            "confidence": float(confidence)
        }
    
    def _predict_gnn(self, model, X) -> Dict[str, Any]:
        """GNN model prediction"""
        # Implementation depends on your GNN framework
        pass
    
    def _predict_graph(self, model, X) -> Dict[str, Any]:
        """Graph-based model prediction"""
        # Implementation depends on your framework
        pass
```

#### 2.3 Prediction Endpoint

**Endpoint: POST /api/v1/predictions**
```python
# app/routes/predictions.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.model_service import ModelManager
from app.services.explanation_service import ExplanationService
import logging
import time

router = APIRouter(prefix="/predictions", tags=["predictions"])
logger = logging.getLogger(__name__)

model_manager = ModelManager()
explanation_service = ExplanationService()

class PredictionRequest(BaseModel):
    protein_id: int
    model_type: str  # 'ML', 'GNN', 'Graph'

class PredictionResponse(BaseModel):
    id: int
    protein_id: int
    model_type: str
    prediction: str
    confidence: float
    execution_time_ms: int

@router.post("")
async def create_prediction(
    req: PredictionRequest,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Create a new prediction for a protein
    
    Process:
    1. Fetch protein features from DB
    2. Run through selected model
    3. Log prediction
    4. Return result
    """
    
    # Validate model type
    if req.model_type not in ['ML', 'GNN', 'Graph']:
        raise HTTPException(status_code=400, detail="Invalid model type")
    
    # Fetch protein
    query = select(Protein).where(Protein.id == req.protein_id)
    result = await db.execute(query)
    protein = result.scalar_one_or_none()
    
    if not protein:
        raise HTTPException(status_code=404, detail="Protein not found")
    
    try:
        # Extract features
        features = protein.features
        
        # Run prediction
        start_time = time.time()
        prediction_result = model_manager.predict(req.model_type, features)
        execution_time = int((time.time() - start_time) * 1000)
        
        # Log prediction
        prediction = Prediction(
            protein_id=req.protein_id,
            model_type=req.model_type,
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            execution_time_ms=execution_time,
            features_hash=hash_features(features)
        )
        db.add(prediction)
        await db.commit()
        await db.refresh(prediction)
        
        logger.info(f"Prediction created: {prediction.id}")
        
        return {
            "id": prediction.id,
            "protein_id": prediction.protein_id,
            "model_type": prediction.model_type,
            "prediction": prediction.prediction,
            "confidence": prediction.confidence,
            "execution_time_ms": prediction.execution_time_ms
        }
    
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
```

#### 2.4 LLM Explanation Service

```python
# app/services/explanation_service.py
import os
import asyncio
from typing import Dict, Any
import aiohttp
import logging

logger = logging.getLogger(__name__)

class ExplanationService:
    def __init__(self, model: str = "claude"):
        self.model = model  # 'claude', 'gpt', or 'ollama'
        self.api_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("OPENAI_API_KEY")
    
    async def generate_explanation(
        self,
        protein_name: str,
        prediction: str,
        confidence: float,
        model_type: str
    ) -> str:
        """
        Generate AI explanation for prediction
        
        Prompt Example:
        "The protein TP53 was predicted to be Essential by the ML model
         with confidence 0.92. Generate 2-3 sentences explaining why this
         prediction makes biological sense."
        """
        
        prompt = f"""Given:
- Protein: {protein_name}
- Prediction Model: {model_type}
- Prediction: {prediction}
- Confidence Score: {confidence:.2%}

Generate 2-3 concise, scientifically-grounded sentences explaining why 
this prediction is likely correct. Focus on known biological functions
and essentiality patterns.

Keep response under 150 words."""
        
        try:
            if self.model == "claude":
                return await self._call_claude(prompt)
            elif self.model == "gpt":
                return await self._call_gpt(prompt)
            elif self.model == "ollama":
                return await self._call_ollama(prompt)
        except Exception as e:
            logger.error(f"Explanation generation error: {e}")
            return f"Protein {protein_name} predicted as {prediction} (confidence: {confidence:.2%})"
    
    async def _call_claude(self, prompt: str) -> str:
        """Call Claude API"""
        async with aiohttp.ClientSession() as session:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            payload = {
                "model": "claude-opus-4-6",
                "max_tokens": 200,
                "messages": [{"role": "user", "content": prompt}]
            }
            
            async with session.post(
                "https://api.anthropic.com/v1/messages",
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=10)
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    return data['content'][0]['text']
                else:
                    raise Exception(f"API error: {resp.status}")
    
    async def _call_gpt(self, prompt: str) -> str:
        """Call OpenAI API"""
        # Similar implementation
        pass
    
    async def _call_ollama(self, prompt: str) -> str:
        """Call local Ollama instance"""
        # For development: local LLM
        pass

@router.post("/{prediction_id}/explanations")
async def get_explanation(
    prediction_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Generate or retrieve explanation for prediction"""
    
    # Fetch prediction
    query = select(Prediction).where(Prediction.id == prediction_id)
    result = await db.execute(query)
    prediction = result.scalar_one_or_none()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    # Check if explanation exists
    exp_query = select(Explanation).where(
        Explanation.prediction_id == prediction_id
    )
    exp_result = await db.execute(exp_query)
    explanation = exp_result.scalar_one_or_none()
    
    if explanation:
        return {"explanation": explanation.explanation_text}
    
    # Generate new explanation
    protein_query = select(Protein).where(Protein.id == prediction.protein_id)
    protein_result = await db.execute(protein_query)
    protein = protein_result.scalar_one()
    
    explanation_service = ExplanationService()
    explanation_text = await explanation_service.generate_explanation(
        protein_name=protein.name,
        prediction=prediction.prediction,
        confidence=prediction.confidence,
        model_type=prediction.model_type
    )
    
    # Save explanation
    exp = Explanation(
        prediction_id=prediction_id,
        explanation_text=explanation_text,
        model_used_for_explanation="claude"
    )
    db.add(exp)
    await db.commit()
    
    return {"explanation": explanation_text}
```

#### 2.5 Drug Recommendation Integration

**Endpoint: GET /api/v1/drugs/{protein_id}**
```python
# app/services/drug_service.py
import aiohttp
import asyncio
from redis.asyncio import Redis
import json
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DrugService:
    def __init__(self, redis_client: Redis):
        self.redis = redis_client
        self.cache_ttl = 6 * 3600  # 6 hours
    
    async def fetch_drugs(
        self,
        protein_id: int,
        protein_name: str,
        gene_name: str,
        db: AsyncSession
    ) -> List[Dict[str, Any]]:
        """
        Fetch drugs for a protein from multiple sources
        
        Sources:
        1. DrugBank API (by protein/gene ID)
        2. UniProt (drug interactions)
        3. Cached results (if fresh)
        """
        
        # Check cache first
        cache_key = f"drugs:{protein_id}"
        cached = await self.redis.get(cache_key)
        if cached:
            logger.info(f"Cache hit for protein {protein_id}")
            return json.loads(cached)
        
        drugs = []
        
        try:
            # Fetch from DrugBank
            drugbank_drugs = await self._fetch_drugbank_drugs(gene_name)
            drugs.extend(drugbank_drugs)
            
            # Fetch from other sources (parallel)
            other_drugs = await asyncio.gather(
                self._fetch_uniprot_drugs(protein_name),
                self._fetch_chembl_drugs(gene_name),
                return_exceptions=True
            )
            
            for result in other_drugs:
                if not isinstance(result, Exception) and result:
                    drugs.extend(result)
            
            # Deduplicate
            drugs = self._deduplicate_drugs(drugs)
            
            # Cache result
            await self.redis.setex(
                cache_key,
                self.cache_ttl,
                json.dumps(drugs)
            )
            
            # Also save to DB for persistence
            await self._save_to_db(protein_id, drugs, db)
            
            return drugs
        
        except Exception as e:
            logger.error(f"Error fetching drugs: {e}")
            # Return cached drugs if available
            return []
    
    async def _fetch_drugbank_drugs(self, gene_name: str) -> List[Dict]:
        """Query DrugBank API"""
        url = f"https://api.drugbank.ca/v1/drugs?gene_id={gene_name}"
        headers = {"Authorization": f"Bearer {os.getenv('DRUGBANK_API_KEY')}"}
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=5)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        return [
                            {
                                "name": drug.get("name"),
                                "drug_bank_id": drug.get("drugbank_id"),
                                "approval_status": drug.get("approval_status"),
                                "type": drug.get("drug_type"),
                                "source": "DrugBank"
                            }
                            for drug in data.get("drugs", [])
                        ]
        except Exception as e:
            logger.warning(f"DrugBank API failed: {e}")
        
        return []
    
    async def _fetch_uniprot_drugs(self, protein_name: str) -> List[Dict]:
        """Query UniProt for drug interactions"""
        # Similar implementation
        pass
    
    async def _fetch_chembl_drugs(self, gene_name: str) -> List[Dict]:
        """Query ChEMBL API"""
        # Similar implementation
        pass
    
    def _deduplicate_drugs(self, drugs: List[Dict]) -> List[Dict]:
        """Remove duplicate drugs"""
        seen = set()
        unique = []
        for drug in drugs:
            key = drug.get("drug_bank_id") or drug.get("name")
            if key not in seen:
                seen.add(key)
                unique.append(drug)
        return unique
    
    async def _save_to_db(self, protein_id: int, drugs: List[Dict], db: AsyncSession):
        """Persist drugs to database"""
        for drug in drugs:
            cached_drug = CachedDrug(
                protein_id=protein_id,
                drug_name=drug.get("name"),
                drug_bank_id=drug.get("drug_bank_id"),
                approval_status=drug.get("approval_status"),
                drug_type=drug.get("type"),
                external_source=drug.get("source")
            )
            db.add(cached_drug)
        
        await db.commit()

# Route
@router.get("/{protein_id}")
async def get_drugs(
    protein_id: int,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    """Get drug recommendations for protein"""
    
    # Fetch protein
    protein_query = select(Protein).where(Protein.id == protein_id)
    protein_result = await db.execute(protein_query)
    protein = protein_result.scalar_one_or_none()
    
    if not protein:
        raise HTTPException(status_code=404)
    
    # Fetch drugs
    drug_service = DrugService(redis)
    drugs = await drug_service.fetch_drugs(
        protein_id, protein.name, protein.gene_name, db
    )
    
    return {
        "protein_id": protein_id,
        "drug_count": len(drugs),
        "drugs": drugs
    }
```

#### 2.6 Research Paper Integration

**Endpoint: GET /api/v1/research/{protein_id}**
```python
# app/services/research_service.py
import aiohttp
import xml.etree.ElementTree as ET
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class ResearchService:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.cache_ttl = 6 * 3600
    
    async def fetch_papers(
        self,
        protein_id: int,
        protein_name: str,
        gene_name: str,
        db: AsyncSession
    ) -> List[Dict[str, Any]]:
        """Fetch research papers from PubMed"""
        
        cache_key = f"research:{protein_id}"
        cached = await self.redis.get(cache_key)
        if cached:
            return json.loads(cached)
        
        try:
            papers = []
            
            # Search by protein name
            papers.extend(await self._search_pubmed(protein_name))
            
            # Search by gene name
            if gene_name:
                papers.extend(await self._search_pubmed(gene_name))
            
            # Deduplicate
            papers = self._deduplicate_papers(papers)
            
            # Sort by relevance (publication date descending)
            papers.sort(key=lambda x: x.get("publication_year", 0), reverse=True)
            
            # Limit to top 20
            papers = papers[:20]
            
            # Cache
            await self.redis.setex(
                cache_key,
                self.cache_ttl,
                json.dumps(papers)
            )
            
            # Save to DB
            await self._save_to_db(protein_id, papers, db)
            
            return papers
        
        except Exception as e:
            logger.error(f"Error fetching papers: {e}")
            return []
    
    async def _search_pubmed(self, query: str) -> List[Dict]:
        """Search PubMed using E-utilities API"""
        
        search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
        
        try:
            # Phase 1: Search for PMIDs
            async with aiohttp.ClientSession() as session:
                params = {
                    "db": "pubmed",
                    "term": query,
                    "retmax": 50,
                    "rettype": "json"
                }
                
                async with session.get(search_url, params=params, timeout=aiohttp.ClientTimeout(total=5)) as resp:
                    if resp.status != 200:
                        return []
                    
                    data = await resp.json()
                    pmids = data.get("esearchresult", {}).get("idlist", [])
                
                if not pmids:
                    return []
                
                # Phase 2: Fetch paper details
                params = {
                    "db": "pubmed",
                    "id": ",".join(pmids),
                    "rettype": "xml"
                }
                
                async with session.get(fetch_url, params=params, timeout=aiohttp.ClientTimeout(total=5)) as resp:
                    if resp.status != 200:
                        return []
                    
                    xml_data = await resp.text()
                    return self._parse_pubmed_xml(xml_data)
        
        except Exception as e:
            logger.warning(f"PubMed search failed: {e}")
            return []
    
    def _parse_pubmed_xml(self, xml_str: str) -> List[Dict]:
        """Parse PubMed XML response"""
        papers = []
        
        try:
            root = ET.fromstring(xml_str)
            
            for article in root.findall(".//PubmedArticle"):
                pmid_elem = article.find(".//PMID")
                title_elem = article.find(".//ArticleTitle")
                journal_elem = article.find(".//Journal/Title")
                year_elem = article.find(".//PubDate/Year")
                abstract_elem = article.find(".//Abstract/AbstractText")
                
                # Extract DOI
                doi = None
                for id_elem in article.findall(".//ArticleId"):
                    if id_elem.get("IdType") == "doi":
                        doi = id_elem.text
                        break
                
                paper = {
                    "pubmed_id": pmid_elem.text if pmid_elem is not None else None,
                    "title": title_elem.text if title_elem is not None else "Unknown",
                    "journal": journal_elem.text if journal_elem is not None else None,
                    "publication_year": int(year_elem.text) if year_elem is not None else None,
                    "abstract": abstract_elem.text if abstract_elem is not None else None,
                    "doi": doi
                }
                
                papers.append(paper)
        
        except Exception as e:
            logger.error(f"XML parsing error: {e}")
        
        return papers
    
    def _deduplicate_papers(self, papers: List[Dict]) -> List[Dict]:
        """Remove duplicate papers"""
        seen = set()
        unique = []
        for paper in papers:
            key = paper.get("pubmed_id") or paper.get("title")
            if key not in seen:
                seen.add(key)
                unique.append(paper)
        return unique
    
    async def _save_to_db(self, protein_id: int, papers: List[Dict], db: AsyncSession):
        """Persist papers to database"""
        for paper in papers:
            cached_paper = CachedResearch(
                protein_id=protein_id,
                paper_title=paper.get("title"),
                doi=paper.get("doi"),
                pubmed_id=paper.get("pubmed_id"),
                abstract=paper.get("abstract"),
                journal=paper.get("journal"),
                publication_year=paper.get("publication_year")
            )
            db.add(cached_paper)
        
        await db.commit()

# Route
@router.get("/{protein_id}")
async def get_research(
    protein_id: int,
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    """Get research papers for protein"""
    
    protein_query = select(Protein).where(Protein.id == protein_id)
    protein_result = await db.execute(protein_query)
    protein = protein_result.scalar_one_or_none()
    
    if not protein:
        raise HTTPException(status_code=404)
    
    research_service = ResearchService(redis)
    papers = await research_service.fetch_papers(
        protein_id, protein.name, protein.gene_name, db
    )
    
    return {
        "protein_id": protein_id,
        "paper_count": len(papers),
        "papers": papers
    }
```

#### 2.7 Comprehensive Testing

```python
# backend/tests/test_predictions.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def sample_protein(db):
    """Create sample protein for testing"""
    protein = Protein(
        name="TP53",
        gene_name="TP53",
        protein_id="P04637",
        features={"score1": 0.8, "score2": 0.6},
        pli_score=0.95
    )
    db.add(protein)
    db.commit()
    return protein

def test_create_prediction_ml(sample_protein):
    """Test ML model prediction"""
    response = client.post(
        "/api/v1/predictions",
        json={"protein_id": sample_protein.id, "model_type": "ML"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] in ["Essential", "Non-Essential"]
    assert 0 <= data["confidence"] <= 1

def test_create_prediction_invalid_model(sample_protein):
    """Test invalid model type"""
    response = client.post(
        "/api/v1/predictions",
        json={"protein_id": sample_protein.id, "model_type": "InvalidModel"}
    )
    
    assert response.status_code == 400

def test_search_proteins():
    """Test protein search"""
    response = client.get("/api/v1/proteins/search?q=TP&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert data["count"] >= 0
```

### Phase 2 Deliverables
- ✅ All API endpoints implemented
- ✅ Database integration complete
- ✅ ML model loading & prediction
- ✅ External API integration (DrugBank, PubMed)
- ✅ Caching layer (Redis)
- ✅ Comprehensive test suite
- ✅ API documentation (Swagger)

---

## PHASE 3: FRONTEND INTEGRATION (Weeks 3-4)

### Objective
Build complete, responsive React UI with all user workflows.

### Tasks

#### 3.1 Project Setup & Configuration

```typescript
// frontend/src/types/index.ts
export interface Protein {
  id: number;
  name: string;
  protein_id?: string;
  gene_name?: string;
  pli_score?: number;
}

export interface ModelMetrics {
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
}

export interface Prediction {
  id: number;
  protein_id: number;
  model_type: string;
  prediction: string;
  confidence: number;
  execution_time_ms: number;
}

export interface Drug {
  name: string;
  drug_bank_id?: string;
  approval_status: string;
  type?: string;
  source: string;
}

export interface Paper {
  pubmed_id: string;
  title: string;
  journal?: string;
  publication_year?: number;
  abstract?: string;
  doi?: string;
}
```

```typescript
// frontend/src/services/api.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class APIClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  async searchProteins(query: string, limit: number = 20) {
    return this.client.get('/proteins/search', { params: { q: query, limit } });
  }
  
  async getProtein(id: number) {
    return this.client.get(`/proteins/${id}`);
  }
  
  async getModelMetrics() {
    return this.client.get('/models/metrics');
  }
  
  async createPrediction(proteinId: number, modelType: string) {
    return this.client.post('/predictions', { protein_id: proteinId, model_type: modelType });
  }
  
  async getExplanation(predictionId: number) {
    return this.client.get(`/predictions/${predictionId}/explanations`);
  }
  
  async getDrugs(proteinId: number) {
    return this.client.get(`/drugs/${proteinId}`);
  }
  
  async getResearch(proteinId: number) {
    return this.client.get(`/research/${proteinId}`);
  }
}

export default new APIClient();
```

```typescript
// frontend/src/store/useStore.ts
import { create } from 'zustand';
import { Protein, Prediction } from '../types';

interface AppState {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  
  selectedProtein: Protein | null;
  setSelectedProtein: (protein: Protein | null) => void;
  
  currentPrediction: Prediction | null;
  setCurrentPrediction: (prediction: Prediction | null) => void;
  
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedModel: 'ML',
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  selectedProtein: null,
  setSelectedProtein: (protein) => set({ selectedProtein: protein }),
  
  currentPrediction: null,
  setCurrentPrediction: (prediction) => set({ currentPrediction: prediction }),
  
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  error: null,
  setError: (error) => set({ error })
}));
```

#### 3.2 Core Components

```typescript
// frontend/src/components/common/Header.tsx
export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6 shadow-lg">
      <h1 className="text-3xl font-bold">Protein Essentiality Prediction System</h1>
      <p className="text-blue-100 mt-2">Multi-Model AI-Powered Drug Repurposing Platform</p>
    </header>
  );
};
```

```typescript
// frontend/src/components/dashboard/ModelSelection.tsx
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { Card, Badge, Skeleton } from '@/components/ui/card';

export const ModelSelection = () => {
  const { selectedModel, setSelectedModel } = useStore();
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['modelMetrics'],
    queryFn: () => api.getModelMetrics().then(r => r.data.models)
  });
  
  if (isLoading) return <div className="grid grid-cols-3 gap-4"><Skeleton className="h-48" /><Skeleton className="h-48" /><Skeleton className="h-48" /></div>;
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Select Prediction Model</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics?.map((model: any) => (
          <Card
            key={model.type}
            onClick={() => setSelectedModel(model.type)}
            className={`cursor-pointer p-6 transition-all ${
              selectedModel === model.type
                ? 'border-blue-600 bg-blue-50 border-2'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <h3 className="text-lg font-bold">{model.type} Model</h3>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <Badge className="bg-green-100 text-green-800">{(model.accuracy * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Precision:</span>
                <span className="font-semibold">{(model.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recall:</span>
                <span className="font-semibold">{(model.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">F1-Score:</span>
                <span className="font-semibold">{(model.f1_score * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROC-AUC:</span>
                <span className="font-semibold">{(model.roc_auc * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            {selectedModel === model.type && (
              <div className="mt-4 text-blue-600 font-semibold text-sm">✓ Selected</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
```

```typescript
// frontend/src/components/ProteinSearch/ProteinSearch.tsx
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { debounce } from 'lodash-es';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const ProteinSearch = () => {
  const { setSelectedProtein } = useStore();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  
  const { data: results, isLoading } = useQuery({
    queryKey: ['proteinSearch', query],
    queryFn: () => api.searchProteins(query, 20).then(r => r.data.results),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  const handleSelect = (protein: any) => {
    setSelectedProtein(protein);
    setQuery('');
    setOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-gray-800">Search Proteins</label>
      
      <div className="relative">
        <Input
          placeholder="e.g., TP53, BRCA1, EGFR..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
        />
        
        {open && query.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {isLoading && <div className="p-4 text-center text-gray-500">Searching...</div>}
            
            {results && results.length === 0 && (
              <div className="p-4 text-center text-gray-500">No proteins found</div>
            )}
            
            {results?.map((protein: any) => (
              <div
                key={protein.id}
                onClick={() => handleSelect(protein)}
                className="p-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
              >
                <div className="font-semibold">{protein.name}</div>
                <div className="text-sm text-gray-600">
                  {protein.gene_name && <span>{protein.gene_name} • </span>}
                  {protein.protein_id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

```typescript
// frontend/src/components/Prediction/PredictionPanel.tsx
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const PredictionPanel = () => {
  const { selectedProtein, selectedModel, setCurrentPrediction, loading, setLoading, error, setError } = useStore();
  const [explanation, setExplanation] = useState<string | null>(null);
  
  const handlePredict = async () => {
    if (!selectedProtein) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const predictionRes = await api.createPrediction(selectedProtein.id, selectedModel);
      const prediction = predictionRes.data;
      setCurrentPrediction(prediction);
      
      // Fetch explanation
      const explanationRes = await api.getExplanation(prediction.id);
      setExplanation(explanationRes.data.explanation);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };
  
  if (!selectedProtein) {
    return <div className="text-center text-gray-500 py-8">Select a protein to predict</div>;
  }
  
  return (
    <div className="space-y-4">
      <Button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? 'Predicting...' : 'Predict Essentiality'}
      </Button>
      
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
      
      {/* Prediction Result */}
      {/* ... display prediction, confidence, explanation ... */}
    </div>
  );
};
```

#### 3.3 Results Display Components

```typescript
// frontend/src/components/Results/DrugPanel.tsx
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const DrugPanel = () => {
  const { selectedProtein } = useStore();
  
  const { data: drugData, isLoading } = useQuery({
    queryKey: ['drugs', selectedProtein?.id],
    queryFn: () => api.getDrugs(selectedProtein!.id).then(r => r.data),
    enabled: !!selectedProtein
  });
  
  if (!selectedProtein) return null;
  if (isLoading) return <div className="animate-pulse">Loading drugs...</div>;
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Drug Repurposing Recommendations ({drugData?.drug_count || 0})</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drug Name</TableHead>
              <TableHead>Drug Bank ID</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugData?.drugs.map((drug: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{drug.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{drug.drug_bank_id || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    drug.approval_status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {drug.approval_status}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{drug.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
```

```typescript
// frontend/src/components/Results/ResearchPanel.tsx
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store/useStore';
import api from '../../services/api';
import { ExternalLink } from 'lucide-react';

export const ResearchPanel = () => {
  const { selectedProtein } = useStore();
  
  const { data: researchData, isLoading } = useQuery({
    queryKey: ['research', selectedProtein?.id],
    queryFn: () => api.getResearch(selectedProtein!.id).then(r => r.data),
    enabled: !!selectedProtein
  });
  
  if (!selectedProtein) return null;
  if (isLoading) return <div className="animate-pulse">Loading papers...</div>;
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Related Research Papers ({researchData?.paper_count || 0})</h3>
      
      <div className="space-y-3">
        {researchData?.papers.map((paper: any, idx: number) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition">
            <h4 className="font-semibold text-sm text-gray-900 mb-2">{paper.title}</h4>
            
            <div className="text-xs text-gray-600 space-y-1">
              {paper.journal && <p><strong>Journal:</strong> {paper.journal}</p>}
              {paper.publication_year && <p><strong>Year:</strong> {paper.publication_year}</p>}
              {paper.abstract && <p className="text-gray-600 italic mt-2">{paper.abstract.substring(0, 150)}...</p>}
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              {paper.doi && (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"
                >
                  View Paper <ExternalLink className="w-3 h-3" />
                </a>
              )}
              
              {paper.pubmed_id && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pubmed_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-xs font-semibold"
                >
                  PubMed <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### 3.4 Main Dashboard Page

```typescript
// frontend/src/pages/Dashboard.tsx
import { useState } from 'react';
import { ModelSelection } from '../components/dashboard/ModelSelection';
import { ProteinSearch } from '../components/ProteinSearch/ProteinSearch';
import { PredictionPanel } from '../components/Prediction/PredictionPanel';
import { DrugPanel } from '../components/Results/DrugPanel';
import { ResearchPanel } from '../components/Results/ResearchPanel';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'results'>('setup');
  
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'setup'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            Setup
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === 'results'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            Results
          </button>
        </div>
        
        {/* Setup Phase */}
        {activeTab === 'setup' && (
          <div className="space-y-8">
            <ModelSelection />
            <ProteinSearch />
            <PredictionPanel />
          </div>
        )}
        
        {/* Results Phase */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            <DrugPanel />
            <ResearchPanel />
          </div>
        )}
      </div>
    </div>
  );
};
```

### Phase 3 Deliverables
- ✅ Fully functional React UI
- ✅ All components responsive and styled
- ✅ API integration complete
- ✅ State management (Zustand)
- ✅ Loading states and error handling
- ✅ Component tests written

---

## PHASE 4: OPTIMIZATION & HARDENING (Week 4-5)

### 4.1 Performance Optimization

**Frontend:**
- Code splitting with React.lazy()
- Image optimization (lazy load, WebP)
- Bundle analysis (webpack-bundle-analyzer)
- Lighthouse score >90
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1

**Backend:**
- Database query optimization (EXPLAIN ANALYZE)
- Add indexes strategically
- Connection pooling (SQLAlchemy pool_size, pool_pre_ping)
- Async endpoints for long-running operations
- Caching strategy (Redis, HTTP cache headers)

### 4.2 Security Hardening

- Input validation (Pydantic models)
- SQL injection prevention (ORM usage)
- XSS prevention (React auto-escaping)
- CSRF protection (if sessions)
- Rate limiting (slowapi)
- CORS configuration
- HTTPS enforcement
- Secrets management (.env, AWS Secrets Manager)

### 4.3 Error Handling

- Custom exception classes
- Graceful degradation
- User-friendly error messages
- Proper HTTP status codes
- Detailed logging (but no sensitive data)

### 4.4 Monitoring & Alerting

```python
# app/middleware/monitoring.py
import time
from prometheus_client import Counter, Histogram, CollectorRegistry

registry = CollectorRegistry()

request_count = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status'],
    registry=registry
)

request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint'],
    registry=registry
)

@app.middleware("http")
async def add_metrics(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    
    request_count.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    request_duration.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)
    
    return response
```

---

## PHASE 5: DEPLOYMENT & DOCUMENTATION (Week 5)

### 5.1 Containerization & Deployment

**Push to Docker Hub:**
```bash
docker build -t yourrepo/protein-prediction:latest ./backend
docker push yourrepo/protein-prediction:latest
```

**Deploy to AWS EC2:**
```bash
# On EC2 instance
git clone <repo>
docker-compose up -d
```

**Alternative: Deploy to Google Cloud Run:**
```bash
gcloud run deploy protein-prediction \
  --image gcr.io/project/protein-prediction \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 5.2 Documentation

- **API Documentation:** Swagger UI at `/docs`
- **Database Schema:** SQL script + ER diagram
- **Deployment Guide:** Step-by-step instructions
- **Architecture Guide:** System design overview
- **Contributing Guide:** Development guidelines

---

## KEY SUCCESS FACTORS

1. **Code Quality:** Maintain >80% test coverage throughout
2. **Documentation:** Write docs as you code, not after
3. **Communication:** Regular syncs with stakeholders
4. **Iteration:** Gather feedback early, iterate fast
5. **Monitoring:** Instrument system from day 1
6. **Security:** Never compromise on security practices
7. **Performance:** Profile and optimize continuously

---

## IMPLEMENTATION CHECKLIST

### Week 1-2
- [ ] Project scaffold created (backend + frontend)
- [ ] Database schema initialized
- [ ] Docker setup working
- [ ] CI/CD pipeline configured
- [ ] Initial protein data loaded

### Week 2-3.5
- [ ] All protein endpoints working
- [ ] All 3 ML models integrated
- [ ] External APIs integrated (drugs, papers)
- [ ] Caching layer functional
- [ ] Backend tests passing (>85% coverage)

### Week 3-4.5
- [ ] React components fully functional
- [ ] API integration complete
- [ ] UI responsive on all devices
- [ ] Error handling comprehensive
- [ ] Frontend tests passing (>75% coverage)

### Week 4.5-5.5
- [ ] Performance optimized (Lighthouse >90)
- [ ] Security audit passed
- [ ] Load testing successful (100+ concurrent users)
- [ ] Monitoring & alerting configured

### Week 5.5-6.5
- [ ] Production deployment successful
- [ ] Documentation complete
- [ ] Team trained
- [ ] Go-live checklist completed

---

## NEXT STEPS AFTER LAUNCH

1. **Monitor & Iterate:** Track metrics, gather user feedback
2. **Enhance:** Implement Phase 1.1 features (visualization, batch prediction)
3. **Scale:** Auto-scaling, multi-region deployment
4. **Integrate:** Client systems, dashboards
5. **Maintain:** Security patches, dependency updates, monitoring

---

**This prompt is your complete blueprint. Use it to guide development, delegate tasks, or work with AI agents for rapid iteration.**
