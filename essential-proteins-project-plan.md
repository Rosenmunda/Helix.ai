# Essential Proteins & Drug Repurposing System
## Industry-Level Project Plan

---

## 1. PROJECT OVERVIEW

### 1.1 Executive Summary
A full-stack AI-powered web application that predicts protein essentiality using multiple ML/GNN models and recommends repurposable drugs with supporting biomedical research integration.

### 1.2 Success Criteria
- **Model accuracy**: >90% for primary prediction task
- **API response time**: <2s for predictions, <3s for drug/paper queries
- **System availability**: 99.5% uptime
- **Code coverage**: >80% for backend and frontend critical paths
- **Production readiness**: CI/CD pipeline, monitoring, automated testing

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Tailwind)              │
│  (Dashboard → Model Selection → Protein Selection → Results) │
└────────────────────────┬────────────────────────────────────┘
                         │ REST/GraphQL API
┌────────────────────────▼────────────────────────────────────┐
│                  API Gateway / Load Balancer                 │
└────────────────────────┬────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
┌───▼────┐        ┌──────▼────────┐   ┌─────▼──────┐
│FastAPI │        │ ML Model      │   │ Cache Layer│
│Backend │        │ Server        │   │(Redis)     │
└───┬────┘        │(TensorFlow)   │   └────────────┘
    │             └───────────────┘
    │
    ├── PostgreSQL Database
    ├── Protein Metadata (CSV → DB)
    ├── Cache Layer (Redis)
    └── External APIs
        ├── DrugBank REST API
        ├── PubMed API
        ├── UniProt API
        └── NCBI Gene API
```

### 2.2 Technology Stack (Recommended)

**Frontend:**
- React 18+ with TypeScript
- Tailwind CSS + shadcn/ui (industry-standard design system)
- TanStack Query (React Query) for server state management
- Zustand for client state
- Vite for build tooling

**Backend:**
- FastAPI (async, fast, auto-documentation)
- SQLAlchemy ORM with async support
- Pydantic for data validation
- Redis for caching predictions and API responses

**Database:**
- PostgreSQL (production database)
- Initial CSV support for protein metadata, then migrate to DB

**ML/Model Serving:**
- FastAPI async endpoints for predictions
- TensorFlow/PyTorch model serving (depending on model type)
- Model versioning with MLflow
- Separate microservice for model inference (optional, for scaling)

**External Integrations:**
- aiohttp for async API calls to DrugBank, PubMed, UniProt
- Scheduled jobs (Celery + Redis) for periodic data updates

**Infrastructure & DevOps:**
- Docker for containerization
- Docker Compose for local development
- GitHub Actions for CI/CD
- AWS/GCP/Digital Ocean for deployment
- Prometheus + Grafana for monitoring

**Testing & Quality:**
- pytest for backend testing
- Jest + React Testing Library for frontend
- Selenium/Playwright for E2E testing
- SonarQube for code quality analysis

---

## 3. PROJECT STRUCTURE

```
essential-proteins-system/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Header, Sidebar, Footer
│   │   │   ├── dashboard/       # Landing dashboard
│   │   │   ├── model-selection/ # Model picker + stats
│   │   │   ├── protein-search/  # Searchable dropdown + info
│   │   │   ├── prediction/      # Results, badges, explanations
│   │   │   ├── drug-panel/      # Drug recommendations table
│   │   │   └── research/        # Research papers panel
│   │   ├── hooks/
│   │   │   ├── useProteinSearch.ts
│   │   │   ├── usePrediction.ts
│   │   │   └── useExternalAPIs.ts
│   │   ├── services/
│   │   │   ├── api.ts           # API client
│   │   │   └── externalAPIs.ts  # DrugBank, PubMed integration
│   │   ├── store/               # Zustand stores
│   │   ├── types/               # TypeScript interfaces
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app entry
│   │   ├── config.py           # Configuration (env, DB, etc.)
│   │   ├── routes/
│   │   │   ├── proteins.py     # Protein CRUD, search
│   │   │   ├── predictions.py  # Prediction endpoints
│   │   │   ├── drugs.py        # Drug recommendations
│   │   │   ├── research.py     # Research paper queries
│   │   │   └── health.py       # Health checks
│   │   ├── services/
│   │   │   ├── prediction_service.py    # Model inference
│   │   │   ├── explanation_service.py   # LLM explanations
│   │   │   ├── drug_service.py         # DrugBank integration
│   │   │   ├── research_service.py     # PubMed integration
│   │   │   └── cache_service.py        # Redis caching
│   │   ├── models/
│   │   │   └── database.py     # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── request_response.py  # Pydantic schemas
│   │   ├── ml/
│   │   │   ├── __init__.py
│   │   │   ├── ml_model.py     # Classical ML model
│   │   │   ├── gnn_model.py    # Graph Neural Network
│   │   │   └── graph_model.py  # Graph-based model
│   │   └── utils/
│   │       ├── logging.py
│   │       └── exceptions.py
│   ├── data/
│   │   ├── proteins.csv        # Initial protein data
│   │   ├── drug_repurposing.csv
│   │   └── migration_scripts/  # DB initialization
│   ├── tests/
│   │   ├── test_prediction.py
│   │   ├── test_drugs.py
│   │   ├── test_research.py
│   │   └── test_integration.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── ml-models/
│   ├── trained_models/
│   │   ├── ml_model.pkl
│   │   ├── gnn_model.pt
│   │   └── graph_model.pkl
│   ├── model_registry/         # MLflow or similar
│   └── model_evaluation.py
│
├── scripts/
│   ├── init_db.py
│   ├── load_proteins.py
│   ├── fetch_drug_data.py
│   └── deployment.sh
│
├── docs/
│   ├── API_SPECIFICATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── ARCHITECTURE.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Frontend + Backend tests
│       ├── deploy.yml          # Automated deployment
│       └── code-quality.yml    # SonarQube/linting
│
└── README.md
```

---

## 4. DEVELOPMENT PHASES

### Phase 1: Foundation (Weeks 1-2)
**Deliverable:** Scaffolded codebase with API skeleton and basic UI

- [ ] Set up React + FastAPI project structure
- [ ] Configure Docker & docker-compose
- [ ] Create database schema (PostgreSQL)
- [ ] Implement basic authentication/API key validation
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Load protein CSV data into database

**Key Files to Create:**
- `backend/app/main.py` (FastAPI app)
- `frontend/src/pages/Dashboard.tsx` (main page)
- `.github/workflows/ci.yml` (automated tests)

### Phase 2: Backend Core (Weeks 2-3)
**Deliverable:** Fully functional API endpoints with all integrations

- [ ] Implement `/proteins` endpoints (search, filter, get by ID)
- [ ] Implement `/predictions` endpoint with model selection
- [ ] Integrate all 3 ML models (ML, GNN, Graph-based)
- [ ] Add `/explanations` endpoint (LLM-powered reasoning)
- [ ] Integrate DrugBank API (`/drugs` endpoint)
- [ ] Integrate PubMed API (`/research` endpoint)
- [ ] Implement Redis caching for frequently accessed data
- [ ] Write comprehensive tests (pytest)

**API Endpoints Summary:**
```
GET    /api/v1/proteins/search?q=TP53
GET    /api/v1/proteins/{id}
GET    /api/v1/models/metrics
POST   /api/v1/predictions (body: {protein_id, model_type})
POST   /api/v1/explanations (body: {prediction_id})
GET    /api/v1/drugs/{protein_id}
GET    /api/v1/research/{protein_id}
GET    /health
```

### Phase 3: Frontend Integration (Weeks 3-4)
**Deliverable:** Fully functional UI with all workflows

- [ ] Build Dashboard component with header/sidebar
- [ ] Implement Model Selection panel with statistics display
- [ ] Create Protein Search dropdown with autocomplete
- [ ] Build Prediction Result panel with loading states
- [ ] Implement Drug Recommendation table with sorting/filtering
- [ ] Create Research Paper panel with DOI links
- [ ] Add error handling and user feedback (toasts, modals)
- [ ] Implement response caching (React Query)
- [ ] Write component tests (React Testing Library)

**Key Components:**
- Dashboard (main orchestrator)
- ModelStats (dynamic cards)
- ProteinSearch (autocomplete dropdown)
- PredictionResult (badge + explanation)
- DrugTable (sortable, filterable)
- ResearchPanel (linked papers)

### Phase 4: Optimization & Hardening (Week 4-5)
**Deliverable:** Production-ready application

- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Implement API rate limiting & throttling
- [ ] Add comprehensive error handling
- [ ] Security audit (CORS, input validation, SQL injection prevention)
- [ ] Implement comprehensive logging & monitoring
- [ ] Load testing (simulate 100+ concurrent users)
- [ ] Database indexing optimization
- [ ] Implement model versioning & A/B testing framework

### Phase 5: Deployment & Documentation (Week 5)
**Deliverable:** Live application with runbooks

- [ ] Containerize both frontend and backend
- [ ] Set up production database
- [ ] Deploy to cloud platform (AWS/GCP/DigitalOcean)
- [ ] Configure monitoring (Prometheus + Grafana)
- [ ] Set up alerting rules
- [ ] Write comprehensive deployment documentation
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Record demo video

---

## 5. KEY TECHNICAL DETAILS

### 5.1 Protein Search & Selection
```
Feature: Searchable dropdown with 10K+ proteins
Implementation:
- Backend: Trie-based search or PostgreSQL full-text search
- Frontend: Debounced autocomplete (300ms delay)
- Caching: Redis cache top 1000 searches
- Performance: <100ms response time
```

### 5.2 Model Prediction Pipeline
```
1. User selects model type (ML/GNN/Graph)
2. Backend loads cached model or initializes it
3. Protein features extracted from database
4. Model inference runs (<1s)
5. Confidence score calculated
6. Result cached for 24 hours
7. Prediction logged to database for analytics
```

### 5.3 LLM Explanation Generation
```
Prompt to Claude/GPT API:
"Given protein {name} with features {features},
model predicted {prediction} with confidence {score}.
Explain in 2-3 sentences why this prediction makes sense."

Response: 2-3 structured sentences with supporting reasons
```

### 5.4 External API Integration Pattern
```python
# Use circuit breaker pattern
# Retry with exponential backoff
# Timeout after 5 seconds
# Cache responses for 6 hours
# Graceful degradation if API is down

async def fetch_drugs_safe(protein_id: str):
    try:
        result = await drugbank_api.query(protein_id)
        cache.set(f"drugs:{protein_id}", result, ttl=6h)
        return result
    except APITimeout:
        cached = cache.get(f"drugs:{protein_id}")
        return cached or []
    except APIError as e:
        log.error(f"DrugBank API failed: {e}")
        return []
```

### 5.5 Database Schema (Key Tables)
```sql
-- Proteins
CREATE TABLE proteins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    protein_id VARCHAR(100),
    pli_score FLOAT,
    external_id VARCHAR(100),
    features JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_protein_name ON proteins(name);

-- Predictions
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    protein_id INT REFERENCES proteins(id),
    model_type VARCHAR(50),
    prediction VARCHAR(50),
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_protein_model ON predictions(protein_id, model_type);

-- Drugs
CREATE TABLE cached_drugs (
    id SERIAL PRIMARY KEY,
    protein_id INT REFERENCES proteins(id),
    drug_name VARCHAR(255),
    drug_bank_id VARCHAR(100),
    approval_status VARCHAR(50),
    external_source VARCHAR(100),
    cached_at TIMESTAMP DEFAULT NOW()
);

-- Research
CREATE TABLE cached_research (
    id SERIAL PRIMARY KEY,
    protein_id INT REFERENCES proteins(id),
    paper_title VARCHAR(500),
    doi VARCHAR(100),
    pubmed_id VARCHAR(50),
    abstract TEXT,
    cached_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. QUALITY ASSURANCE STRATEGY

### 6.1 Testing Pyramid
```
        ▲
       /|\
      / | \
     /  |  \  E2E Tests (5%)
    /   |   \
   /    |    \
  /─────┼─────\ Integration Tests (15%)
 /      |      \
/───────┼───────\ Unit Tests (80%)
```

### 6.2 Test Coverage Goals
- **Backend unit tests:** >85% coverage
- **Frontend component tests:** >75% coverage
- **Integration tests:** Critical user workflows
- **E2E tests:** Happy path + error scenarios

### 6.3 Code Quality Standards
- Linting: ESLint (frontend), Flake8/Black (backend)
- Type checking: TypeScript, mypy
- Documentation: Docstrings (backend), JSDoc (frontend)
- Code review: GitHub PR reviews before merge

---

## 7. SECURITY CONSIDERATIONS

- **Input Validation:** Pydantic schemas + frontend validation
- **Authentication:** JWT tokens or API keys
- **CORS:** Configured for frontend domain only
- **Rate Limiting:** 100 requests/minute per IP
- **SQL Injection:** ORM usage, parameterized queries
- **HTTPS:** TLS 1.3 on production
- **Secrets Management:** Environment variables, no hardcoded keys
- **OWASP Top 10:** Regular security audits

---

## 8. MONITORING & OBSERVABILITY

### 8.1 Metrics to Track
- API response times (p50, p95, p99)
- Model inference latency per model type
- Cache hit rate (target: >70%)
- Error rate (target: <0.1%)
- Database query performance
- External API availability

### 8.2 Alerting Rules
```
- Response time > 3s for 5 min → Alert
- Error rate > 1% → Alert
- Database connection pool exhausted → Critical
- External API down for >10 min → Alert
- Cache hit rate < 50% → Warning
```

---

## 9. SCALABILITY ROADMAP

### Phase 1 (Current): Single Server
- Frontend: Deployed to Vercel/Netlify
- Backend: Single FastAPI instance on EC2/Droplet
- Database: PostgreSQL 1 instance
- Cache: Redis 1 instance

### Phase 2 (Future): Load Balanced
- Frontend: CDN with caching
- Backend: Auto-scaling FastAPI instances behind load balancer
- Database: Read replicas + connection pooling
- Cache: Redis cluster

### Phase 3 (Future): Microservices
- API Gateway (Kong/AWS API Gateway)
- Separate microservice for model inference
- Separate microservice for external API integration
- Message queue (RabbitMQ) for async tasks

---

## 10. SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Model Accuracy | >90% | F1-score across test set |
| API Response Time | <2s | p95 latency |
| System Uptime | 99.5% | Monthly downtime <3.6 hours |
| Cache Hit Rate | >70% | Redis hit/miss ratio |
| Code Coverage | >80% | pytest coverage report |
| Frontend Performance | Lighthouse >90 | Google Lighthouse audit |
| User Satisfaction | >4.5/5 | Feedback surveys |

---

## 11. DELIVERABLES CHECKLIST

### MVP (Minimum Viable Product)
- [x] Protein search and selection
- [x] Model selection with statistics
- [x] Single working model prediction
- [x] Basic drug recommendations
- [x] Research paper links

### Version 1.0 (Production)
- [ ] All 3 models integrated
- [ ] LLM explanations
- [ ] Full drug/research API integration
- [ ] Comprehensive error handling
- [ ] Logging & monitoring
- [ ] Documentation

### Version 1.1 (Enhancement)
- [ ] Protein network visualization
- [ ] Confidence score graphs
- [ ] PDF report download
- [ ] User authentication & history
- [ ] Batch prediction support

---

## 12. RISK MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| External API downtime | Medium | High | Cache responses, graceful degradation |
| Model inference latency | Medium | High | Model optimization, async processing |
| Database scalability | Low | High | Connection pooling, read replicas |
| Data quality issues | Medium | Medium | Validation pipeline, monitoring |
| Security vulnerabilities | Low | Critical | Regular audits, OWASP compliance |

---

## 13. TIMELINE ESTIMATE

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Foundation | 2 weeks | Week 1 | Week 2 |
| Backend Core | 1.5 weeks | Week 2 | Week 3.5 |
| Frontend Integration | 1.5 weeks | Week 3 | Week 4.5 |
| Optimization | 1 week | Week 4.5 | Week 5.5 |
| Deployment | 1 week | Week 5.5 | Week 6.5 |
| **Total** | **~6-7 weeks** | | |

---

## 14. TOOLS & RESOURCES

### Development
- VS Code / PyCharm / WebStorm
- Git & GitHub
- Postman (API testing)
- DBeaver (DB management)

### Deployment
- Docker & docker-compose
- GitHub Actions
- AWS/GCP/DigitalOcean CLI

### Monitoring
- Prometheus (metrics collection)
- Grafana (visualization)
- ELK Stack (logging) or DataDog

### Documentation
- Swagger/OpenAPI (API docs)
- Markdown (guides)
- Confluence (team wiki)

---

## 15. COMMUNICATION PLAN

- **Daily standup:** 10 min (async Slack updates if distributed)
- **Weekly sprint review:** Friday 4 PM
- **Code review:** 24-hour turnaround
- **Documentation:** Written during development, not after

---

**End of Plan**
