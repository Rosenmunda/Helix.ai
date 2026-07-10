# Quick Reference & Implementation Guide
## Essential Proteins & Drug Repurposing System

---

## 1. QUICK START COMMANDS

### 1.1 Backend Setup
```bash
# Clone repo and navigate
git clone <repo-url>
cd essential-proteins-system/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Initialize database
python scripts/load_proteins.py

# Run tests
pytest tests/ -v --cov=app

# Start dev server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 1.2 Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set environment variable
export VITE_API_URL=http://localhost:8000/api/v1

# Run dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 1.3 Docker Setup
```bash
# From project root
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop everything
docker-compose down
```

---

## 2. PROJECT STRUCTURE QUICK REFERENCE

```
essential-proteins-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry point
│   │   ├── config.py                  # Settings & env vars
│   │   ├── routes/                    # API endpoints
│   │   │   ├── proteins.py            # Protein CRUD
│   │   │   ├── predictions.py         # Predictions
│   │   │   ├── drugs.py               # Drug API
│   │   │   ├── research.py            # Research papers
│   │   │   └── health.py              # Health checks
│   │   ├── services/                  # Business logic
│   │   │   ├── model_service.py       # ML model inference
│   │   │   ├── explanation_service.py # LLM explanations
│   │   │   ├── drug_service.py        # Drug fetching
│   │   │   ├── research_service.py    # Paper fetching
│   │   │   └── cache_service.py       # Redis caching
│   │   ├── models/
│   │   │   └── database.py            # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── request_response.py    # Pydantic schemas
│   │   ├── ml/                        # Model loading
│   │   ├── utils/
│   │   │   ├── exceptions.py          # Custom exceptions
│   │   │   └── logging.py             # Logger setup
│   │   └── middleware/                # CORS, logging, metrics
│   ├── tests/
│   │   ├── test_proteins.py
│   │   ├── test_predictions.py
│   │   ├── test_drugs.py
│   │   ├── test_research.py
│   │   └── conftest.py                # Pytest fixtures
│   ├── data/
│   │   └── proteins.csv               # Initial data
│   ├── requirements.txt               # Dependencies
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Header, Sidebar
│   │   │   ├── dashboard/             # Model selection
│   │   │   ├── protein-search/        # Search component
│   │   │   ├── prediction/            # Prediction results
│   │   │   ├── drug-panel/            # Drug table
│   │   │   └── research/              # Research papers
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── services/
│   │   │   └── api.ts                 # API client
│   │   ├── store/                     # Zustand state
│   │   ├── types/                     # TypeScript interfaces
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── ml-models/
│   ├── trained_models/
│   │   ├── ml_model.pkl
│   │   ├── gnn_model.pt
│   │   └── graph_model.pkl
│   └── model_evaluation.py
│
├── scripts/
│   ├── init_db.py                     # DB initialization
│   ├── load_proteins.py               # Load CSV to DB
│   ├── fetch_drug_data.py             # Initial drug data
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
│       ├── ci.yml                     # Tests & linting
│       ├── deploy.yml                 # Auto-deploy
│       └── code-quality.yml
│
├── docker-compose.yml                 # Full stack setup
├── .gitignore
└── README.md
```

---

## 3. ENVIRONMENT VARIABLES TEMPLATE

```bash
# backend/.env

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/proteins_db
DATABASE_ECHO=false  # Set to true for SQL logging

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
ANTHROPIC_API_KEY=sk-...
DRUGBANK_API_KEY=...
NCBI_EMAIL=your-email@example.com

# Server
DEBUG=false
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Features
CACHE_ENABLED=true
CACHE_TTL=21600  # 6 hours
EXTERNAL_API_TIMEOUT=5  # seconds

# Model
MODEL_PATH=ml-models/trained_models
```

```bash
# frontend/.env.local

VITE_API_URL=http://localhost:8000/api/v1
VITE_LOG_LEVEL=debug
```

---

## 4. CRITICAL API ENDPOINTS (Reference)

### Proteins
```
GET  /api/v1/proteins/search?q=TP&limit=20
GET  /api/v1/proteins/{id}
```

### Models
```
GET  /api/v1/models/metrics
```

### Predictions
```
POST /api/v1/predictions
     { "protein_id": 123, "model_type": "ML" }
GET  /api/v1/predictions/{id}/explanations
```

### Drugs
```
GET  /api/v1/drugs/{protein_id}
```

### Research
```
GET  /api/v1/research/{protein_id}
```

### Health
```
GET  /health
```

---

## 5. TESTING COMMANDS

### Backend Tests
```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_predictions.py -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test
pytest tests/test_predictions.py::test_create_prediction_ml -v
```

### Frontend Tests
```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 6. DATABASE SCHEMA (Key Tables)

```sql
-- Proteins: Core data
CREATE TABLE proteins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    protein_id VARCHAR(100),
    gene_name VARCHAR(100),
    uniprot_id VARCHAR(50),
    pli_score FLOAT,
    features JSONB,
    is_essential BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_protein_name ON proteins(name);

-- Model Statistics
CREATE TABLE model_statistics (
    id SERIAL PRIMARY KEY,
    model_type VARCHAR(50) UNIQUE, -- 'ML', 'GNN', 'Graph'
    accuracy FLOAT,
    precision FLOAT,
    recall FLOAT,
    f1_score FLOAT,
    roc_auc FLOAT
);

-- Predictions: Audit trail
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    protein_id INT REFERENCES proteins(id),
    model_type VARCHAR(50),
    prediction VARCHAR(50), -- 'Essential' or 'Non-Essential'
    confidence FLOAT,
    execution_time_ms INT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_predictions_protein_model ON predictions(protein_id, model_type);

-- Drugs: Cached results
CREATE TABLE cached_drugs (
    id SERIAL PRIMARY KEY,
    protein_id INT REFERENCES proteins(id),
    drug_name VARCHAR(255),
    drug_bank_id VARCHAR(100),
    approval_status VARCHAR(50),
    source VARCHAR(100),
    expires_at TIMESTAMP
);
CREATE INDEX idx_cached_drugs_protein ON cached_drugs(protein_id);

-- Research: Cached papers
CREATE TABLE cached_research (
    id SERIAL PRIMARY KEY,
    protein_id INT REFERENCES proteins(id),
    paper_title VARCHAR(500),
    doi VARCHAR(100),
    pubmed_id VARCHAR(50),
    abstract TEXT,
    publication_year INT,
    expires_at TIMESTAMP
);
CREATE INDEX idx_cached_research_protein ON cached_research(protein_id);
```

---

## 7. COMMON DEBUGGING SCENARIOS

### Backend Issues

**Problem: "ModuleNotFoundError: No module named 'app'"**
```bash
# Solution: Ensure PYTHONPATH is set
export PYTHONPATH=$PYTHONPATH:$(pwd)
python -m uvicorn app.main:app
```

**Problem: "Database connection refused"**
```bash
# Check if PostgreSQL is running
psql -U postgres -h localhost
# If not, start Docker containers:
docker-compose up -d postgres redis
```

**Problem: Model loading fails**
```bash
# Check if model files exist
ls -la ml-models/trained_models/
# Verify model format (pkl, pt, h5)
```

### Frontend Issues

**Problem: "CORS error when calling backend"**
```typescript
// Check frontend/.env
VITE_API_URL=http://localhost:8000/api/v1
// Check backend/.env
ALLOWED_ORIGINS=http://localhost:3000
```

**Problem: "API calls timeout"**
```typescript
// Check if backend is running
curl http://localhost:8000/health
// Check network tab in browser DevTools
```

---

## 8. PERFORMANCE TUNING

### Database
```sql
-- Add indexes for common queries
CREATE INDEX idx_protein_gene_name ON proteins(gene_name);
CREATE INDEX idx_predictions_created_at ON predictions(created_at DESC);

-- Analyze query plans
EXPLAIN ANALYZE SELECT * FROM proteins WHERE name ILIKE 'TP%' LIMIT 20;
```

### Backend
```python
# Use connection pooling
SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_size": 20,
    "pool_recycle": 3600,
    "pool_pre_ping": True,
    "max_overflow": 40
}

# Cache frequently accessed data
@cache(ttl=3600)
async def get_model_metrics():
    ...
```

### Frontend
```typescript
// Code splitting
const DrugPanel = React.lazy(() => import('./components/Results/DrugPanel'));

// Query caching
useQuery({
  queryKey: ['proteins', query],
  queryFn: () => api.searchProteins(query),
  staleTime: 5 * 60 * 1000  // 5 minutes
});
```

---

## 9. DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing (backend & frontend)
- [ ] Code coverage >80%
- [ ] No linting errors
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] ML models loaded and verified
- [ ] API documentation updated
- [ ] CHANGELOG updated with new version

### Deployment
- [ ] Docker images built and pushed
- [ ] SSL certificate configured
- [ ] Load balancer configured
- [ ] Database backups enabled
- [ ] Monitoring/alerting configured
- [ ] Deployment script tested
- [ ] Rollback plan documented

### Post-Deployment
- [ ] Health checks passing
- [ ] Monitor error rates (should be <0.1%)
- [ ] Check response times (should be <2s)
- [ ] Verify external APIs working
- [ ] Test full user workflow
- [ ] Monitor logs for errors
- [ ] Collect user feedback

---

## 10. DEVELOPER WORKFLOW

### Creating a New Feature

1. **Create feature branch**
   ```bash
   git checkout -b feature/protein-visualization
   git push -u origin feature/protein-visualization
   ```

2. **Develop & test locally**
   ```bash
   # Make changes
   # Run tests
   pytest tests/ -v
   npm test
   ```

3. **Commit with meaningful messages**
   ```bash
   git add .
   git commit -m "feat(visualization): Add protein network graph"
   git push
   ```

4. **Create pull request**
   - Describe changes
   - Link to issues
   - Request review

5. **Merge after review**
   ```bash
   git merge feature/protein-visualization
   git push origin main
   ```

### Debugging Workflow

1. **Reproduce locally**
   ```bash
   docker-compose up -d
   npm run dev
   # Trigger the issue
   ```

2. **Check logs**
   ```bash
   docker-compose logs backend
   # Or check browser console
   ```

3. **Add debug logging**
   ```python
   logger.debug(f"Variable value: {var}")
   ```

4. **Use debugger**
   ```python
   import pdb; pdb.set_trace()
   ```

5. **Write test case**
   ```python
   def test_issue_xyz():
       # Test case that reproduces bug
       assert ...
   ```

---

## 11. MONITORING & OBSERVABILITY

### Key Metrics to Monitor

| Metric | Target | Tool |
|--------|--------|------|
| API Response Time (p95) | <2000ms | Prometheus |
| Error Rate | <0.1% | Prometheus |
| Cache Hit Rate | >70% | Redis CLI |
| Database Connections | <max_connections | PostgreSQL |
| Prediction Latency | <1000ms | Prometheus |

### Grafana Dashboard Queries

```promql
# Average response time
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Cache hit rate
redis_hits / (redis_hits + redis_misses)
```

---

## 12. VERSION CONTROL BEST PRACTICES

### Branching Strategy
```
main (production)
  ├── develop (staging)
  │   ├── feature/xyz
  │   ├── bugfix/abc
  │   └── refactor/def
  └── hotfix/urgent-issue
```

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>

Examples:
feat(predictions): Add GNN model support
fix(protein-search): Correct autocomplete debouncing
docs(api): Update endpoint specifications
test(predictions): Add unit tests for ML model
chore(deps): Update React to 18.3
```

---

## 13. QUICK API TESTING (cURL)

```bash
# Search proteins
curl "http://localhost:8000/api/v1/proteins/search?q=TP&limit=10"

# Get protein details
curl "http://localhost:8000/api/v1/proteins/1"

# Get model metrics
curl "http://localhost:8000/api/v1/models/metrics"

# Create prediction
curl -X POST "http://localhost:8000/api/v1/predictions" \
  -H "Content-Type: application/json" \
  -d '{"protein_id": 1, "model_type": "ML"}'

# Get drugs
curl "http://localhost:8000/api/v1/drugs/1"

# Get research papers
curl "http://localhost:8000/api/v1/research/1"

# Health check
curl "http://localhost:8000/health"
```

---

## 14. COMMONLY USED LIBRARIES & VERSIONS

**Backend:**
- FastAPI 0.104+
- SQLAlchemy 2.0+
- Pydantic 2.0+
- Redis 5.0+
- aiohttp 3.9+
- pytest 7.4+

**Frontend:**
- React 18.2+
- TypeScript 5.0+
- Tailwind CSS 3.3+
- TanStack Query 5.0+
- Zustand 4.4+
- Vite 5.0+

**ML/Infrastructure:**
- TensorFlow 2.13+ or PyTorch 2.0+
- PostgreSQL 15+
- Docker 24+
- GitHub Actions (built-in)

---

## 15. COST ESTIMATION (AWS)

| Service | Estimated Cost/Month | Notes |
|---------|---------------------|-------|
| EC2 (t3.medium) | $35 | Backend server |
| RDS PostgreSQL | $50 | Database |
| ElastiCache Redis | $20 | Caching |
| Bandwidth | $10 | Data transfer |
| S3 (backups) | $5 | Database backups |
| CloudWatch | $10 | Monitoring |
| **Total** | **~$130** | For dev/test environment |

*Production environment would be higher (auto-scaling, multi-AZ, CDN).*

---

## 16. SUCCESS METRICS DASHBOARD

Track these metrics weekly:

```markdown
| Date | API Uptime | Avg Response Time | Error Rate | Cache Hit Rate | Test Coverage |
|------|------------|-------------------|------------|----------------|---------------|
| Week 1 | 95% | 1200ms | 0.5% | 55% | 65% |
| Week 2 | 98% | 950ms | 0.2% | 72% | 78% |
| Week 3 | 99% | 850ms | 0.1% | 75% | 82% |
| Week 4 | 99.5% | 750ms | 0.05% | 77% | 85% |
```

---

## 17. TROUBLESHOOTING MATRIX

| Issue | Symptom | Diagnosis | Fix |
|-------|---------|-----------|-----|
| DB down | 500 errors | `docker-compose ps` | Restart postgres |
| Redis down | Cache misses | `redis-cli ping` | Restart redis |
| Model files missing | Prediction fails | `ls ml-models/` | Load models |
| CORS error | API blocked | Browser console | Check ALLOWED_ORIGINS |
| OOM (Out of Memory) | Random crashes | `docker stats` | Increase memory limit |

---

## FINAL NOTES

- **Start small:** Get MVP working first
- **Test continuously:** Don't write code without tests
- **Document as you go:** Don't leave it for later
- **Monitor from day 1:** Instrumentation is critical
- **Iterate based on feedback:** Build what users need
- **Keep code clean:** Refactor as you go

---

**Good luck with your implementation! 🚀**

For questions or clarifications, refer to the detailed project plan and AI agent prompt.
