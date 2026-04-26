# MAIA MUSE

**Commercial-Grade AI Music Detection for Music Labels, DSPs, and Artists**

MAIA MUSE is a proprietary AI music detection model designed to identify synthetic and generative AI-created music. Built for major music labels, distributors, and broadcasters — including UMG, Sony, CD Baby, Pandora/SiriusXM, and others — to screen, scan, and triage massive volumes of uploaded music.

---

## 🎯 The Mission

### **THE PROBLEM**
The industry's greatest threat is no longer "bad" AI — it's AI that is **too good**. Human intuition can no longer detect the machine. Without a filter, we are handing the keys of the music economy to the very models cannibalizing it.

### **THE POWER-UP**
MAIA MUSE finds the machine in the music. It provides the certainty that the human ear no longer can. It scans every second of a song to reveal hidden AI, pinpointing exactly when it occurs and naming the generator that created it.

### **THE TRANSFORMATION**
Users move from questioning if a track is real or fake → to **enforcing absolute catalog integrity**.

---

## Three-Tier Detection System

### Level 1: Binary Classification
Strict binary determination: **Real vs. Gen-AI**

### Level 2: Deep Analysis
Answers three critical questions:
- Is it AI-generated?
- Who made it?
- What parts of the song are synthetic?

### Level 3: Complete Audit
Comprehensive forensic analysis:
- Detect backing track origins
- Extract and verify vocals against known artist embeddings
- Full provenance tracing

## Technical Capabilities

MAIA MUSE is engineered to hunt generative artifacts hidden beneath:
- Complex polyphony
- Heavy instrumental masking
- Sophisticated audio manipulation

## Dashboard Features

- **Upload Queue**: Batch process music submissions
- **Analysis Results**: Detailed breakdown of detection findings
- **Triage Interface**: Approve, quarantine, or flag tracks for review
- **Audit Trail**: Complete logging for compliance and transparency
- **Real-time Screening**: Streamlined processing at scale

## Enterprise Features

### 1. Automated Policy & Routing Engine (The "Rules" Builder)
Since humans cannot review 60,000 flagged tracks daily, the system includes an IF/THEN rules engine to automate actions based on MAIA MUSE's 3-level analysis.

**Implementation:** A visual node-based or rule-based builder.

**Use Cases:**
- **Rule A:** IF Binary Confidence > 98% AND Distributor = CD Baby, THEN Auto-Reject Upload (No human review needed).
- **Rule B:** IF Level 3 Voice Match = Protected Artist AND Similarity > 90%, THEN Auto-Quarantine AND Alert Legal Team.
- **Rule C:** IF Binary Confidence is 75-85% (Borderline), THEN Route to Manual Triage Inbox.

### 2. Legal "Evidence Packet" Generator & One-Click DMCA
If a label wants to initiate a takedown or sue for unauthorized IP usage, they need irrefutable technical proof, not just a "flag."

**Implementation:** A feature inside the Track Detail view that compiles a forensic PDF report.

**Use Cases:** Automatically bundles the spectral waveform analysis, the exact timestamps of the AI artifacts, the cryptographic hash of the file, and the mathematical embedding match of the unauthorized voice clone. It then integrates with a legal API to instantly draft and dispatch a DMCA takedown notice to the hosting DSP.

### 3. Distributor / Uploader "Trust Score" Dashboard
Enterprises need to stop the flood at the source. If 80% of the AI tracks are coming from a specific set of users or a specific indie distributor, the enterprise needs to know.

**Implementation:** A "Threat Intelligence" view that aggregates flagged tracks by their metadata (ISRC prefix, Uploader ID, Distributor, IP Address).

**Use Cases:** Instead of playing whack-a-mole with individual tracks, a DSP can see that "Distributor X" has a 92% AI-generation rate this week, allowing them to temporarily suspend the distributor's API access entirely.

### 4. The "IP Vault" (Protected Artist Registry)
For Level 3 (Stem Extraction & Matching) to work, labels need a secure place to upload the "ground truth" data of their artists' voices.

**Implementation:** A highly secure, encrypted vault interface where A&R or Legal teams upload isolated vocal stems of their roster (e.g., Taylor Swift, Drake) to train the localized matching embeddings.

**Use Cases:** Includes access logs, embedding versioning, and a dashboard showing how many times a specific artist's voice has been illegally cloned and caught across the network.

### 5. Royalty Escrow & Fraud Analytics
Gen-AI music at scale is fundamentally a financial attack on the royalty pool. DSPs and labels need to know how much money MAIA MUSE is saving them.

**Implementation:** A financial dashboard overlay.

**Use Cases:** Integrates with the DSP's streaming data. If a track is retroactively flagged as AI after being live for a month, the system calculates the fraudulent streams, automatically flags the royalties for "Escrow/Freeze," and displays a metric on the dashboard: "Estimated Royalties Protected This Month: $1.2M".

### 6. API Webhook Manager for CI/CD Ingestion
DSPs don't upload tracks via a web UI; they come through massive API pipelines.

**Implementation:** A developer portal within the settings where enterprise engineers configure webhooks.

**Use Cases:** Allows them to set up synchronous blocks (e.g., the upload API call hangs for 2 seconds while MAIA MUSE does a Level 1 Binary scan, rejecting the payload immediately if it fails) versus asynchronous audits (Level 2/3 deep scans happen in the background).

### 7. "Blast Radius" Triage Sorting (Live Velocity Integration)
**The Industry Pain Point:** A triage inbox with 5,000 flagged tracks is overwhelming. Reviewers often waste time investigating an AI track that has 0 streams, while an AI track currently going viral on TikTok and racking up 10,000 streams an hour sits at the bottom of the queue.

**The UI/UX Solution:** We integrate the DSP's live streaming API into the Triage Inbox.

**UX:** We replace standard chronological sorting with a "Blast Radius" heat gauge. Tracks are dynamically sorted by Stream Velocity (streams per hour). A flagged track gaining massive traction turns neon red and jumps to the top of the queue, ensuring the team stops the most financially damaging fraud first.

### 8. The "VIP Fast-Lane" (Cryptographic Pre-Clearance)
**The Industry Pain Point:** Major labels are terrified that an aggressive AI filter will accidentally flag and delay a legitimate, highly anticipated midnight release (e.g., a new Beyoncé album) because it uses heavy vocal processing.

**The UI/UX Solution:** A secure portal outside the main ingestion pipeline for verified enterprise partners.

**UX:** Before release day, the label uploads the official, trusted pre-masters. The UI generates a "Cryptographic Whitelist Hash." When the actual files hit the massive ingestion pipeline via distributors at midnight, the system recognizes the hash and routes them through a green "VIP Fast-Lane," bypassing all AI scanning and guaranteeing zero release delays.

### 9. The "Royalty Dilution" / Bot Farm Mapper
**The Problem:** Fraudsters aren't just uploading fake Drake songs; they are uploading 100,000 31-second tracks of AI-generated "white noise" or "lo-fi beats." They then use bot networks to stream these tracks 24/7, draining millions of dollars from the legitimate royalty pool.

**The Feature:** A "Bot-Farm Topology Mapper". A visualization tool that correlates AI-flagged tracks with listener behavior anomalies. It shows labels: "These 5,000 AI-generated lo-fi tracks have 99% of their streams coming from just 50 IP addresses playing exactly 31 seconds on repeat."

### 10. Global DSP Takedown Sync Matrix
**The Problem:** A label successfully issues a DMCA and takes down an AI track on Spotify. However, the exact same track is still live and generating revenue on Apple Music, YouTube, TikTok, and Pandora because cross-platform communication is terrible.

**The Feature:** A "Global DSP Sync Matrix". A unified dashboard that tracks the takedown status of a specific AI hash across all major platforms simultaneously. It highlights which platforms are lagging in compliance, allowing legal teams to send targeted follow-ups.

## Production Backend Architecture

MAIA MUSE includes a full production-ready backend designed for high-scale deployment:

### Multi-Database Architecture
- **PostgreSQL**: Relational data (users, tracks, jobs, audits, compliance logs)
- **MongoDB**: Document storage (analysis results, embeddings, spectrograms)
- **Redis**: Queue management, caching, sessions, rate limiting

### Audio Input Adapters
Supports all major audio input methods:
- **File Upload**: Multipart/form-data with multer (50MB max)
- **S3 Pre-signed URLs**: Direct cloud storage integration
- **Streaming**: Real-time chunked audio (WebSocket/HTTP2)
- **Public URLs**: HTTPS endpoints with SSRF protection

### Processing Modes

#### Sync API (`POST /api/v1/analyze/sync`)
- 2000ms hard timeout for real-time DSP upload blocking
- Returns immediate result or PENDING status with jobId for polling
- Rate limited: 100 req/min per API key

#### Async API (`POST /api/v1/analyze/async`)
- Queue-based background processing via Bull + Redis
- Supports up to 10,000 tracks per batch audit
- Webhook callbacks on completion
- Rate limited: 1000 req/min per API key

### Webhook System
- **HMAC-SHA256 signature verification** for security
- **Exponential backoff retry**: 2s, 4s, 8s, 16s, 32s
- **Circuit breaker**: Auto-disables failing endpoints
- **Events**: `analysis.completed`, `analysis.failed`, `audit.progress`, `audit.completed`

### Authentication & Security
- **JWT**: Dashboard user sessions (24h expiry)
- **API Keys**: DSP integrations with hash-based lookup
- **RBAC**: ADMIN, AUDITOR, TRIAGE_OFFICER, VIEWER roles
- **Rate Limiting**: Burst protection + tier-based limits
- **Helmet**: Security headers, CSP, HSTS

### Model Integration
Drop-in ready for MAIA MUSE model:
```typescript
// Set in .env
MAIA_MODEL_MODE=local
MAIA_MODEL_PATH=./models/maia-muse

// Or connect to GPU server
MAIA_MODEL_ENDPOINT=http://gpu-server:8000
```

Adapters available:
- `MockModelAdapter`: Randomized results for testing
- `LocalModelAdapter`: In-process model (TensorFlow.js/ONNX)
- `GPUServerAdapter`: Remote GPU inference (Triton/TF Serving)

## API Endpoints

### Authentication
```
POST /api/v1/auth/login         # JWT login with email/password
POST /api/v1/auth/register      # Create new user (Admin only)
GET  /api/v1/users/me           # Get current user profile
PUT  /api/v1/users/me           # Update profile / change password
```

### Analysis
```
POST /api/v1/analyze/sync       # Real-time (2000ms timeout)
POST /api/v1/analyze/async      # Background job
GET  /api/v1/analyze/jobs/:id   # Check job status
DELETE /api/v1/analyze/jobs/:id # Cancel pending job
GET  /api/v1/analyze/supported-formats  # List audio formats
```

### Batch Audits
```
POST /api/v1/audits             # Start catalog scan (up to 10k tracks)
GET  /api/v1/audits             # List audits
GET  /api/v1/audits/:id/progress # Check progress
GET  /api/v1/audits/:id/results  # Detailed results
DELETE /api/v1/audits/:id      # Cancel audit
```

### Track Triage
```
GET    /api/v1/tracks           # List tracks with filters
GET    /api/v1/tracks/:id       # Get track details
POST   /api/v1/tracks/:id/action # Take action (approve/quarantine/reject/escalate/release)
POST   /api/v1/tracks/:id/notes  # Add triage note
GET    /api/v1/tracks/:id/history # Full audit trail
POST   /api/v1/tracks/bulk-action # Bulk actions on multiple tracks
```

### Storage (S3 Direct Upload)
```
POST /api/v1/storage/upload-url # Generate presigned S3 URL
POST /api/v1/storage/confirm     # Confirm upload & queue analysis
DELETE /api/v1/storage/:trackId # Delete from S3
```

### Webhooks
```
POST /api/v1/webhooks           # Register endpoint
GET  /api/v1/webhooks           # List endpoints
PUT  /api/v1/webhooks/:id       # Update webhook
DELETE /api/v1/webhooks/:id    # Delete webhook
POST /api/v1/webhooks/:id/test # Send test event
GET  /api/v1/webhooks/:id/deliveries # Delivery history
```

### API Keys (for DSP Integration)
```
GET    /api/v1/users/api-keys   # List API keys
POST   /api/v1/users/api-keys   # Generate new key
DELETE /api/v1/users/api-keys/:id # Revoke key
```

### Health & Monitoring
```
GET /api/v1/health              # Basic liveness check
GET /api/v1/health/ready        # Readiness (checks all dependencies)
GET /api/v1/health/model        # Model health with GPU pool status
GET /api/v1/health/queues       # Queue metrics
GET /api/v1/metrics             # Prometheus-compatible metrics
```

### NLP Assistant (Powered by Gemma 4)
```
# Analysis Explanations
GET    /api/v1/nlp/explanations/:trackId           # Get track explanation
POST   /api/v1/nlp/explanations/:trackId/regenerate # Regenerate explanation

# Interactive Chat
POST   /api/v1/nlp/chat                             # Send chat message
GET    /api/v1/nlp/conversations                    # List conversations
GET    /api/v1/nlp/conversations/:id                # Get conversation with messages
DELETE /api/v1/nlp/conversations/:id                # Delete conversation

# Audit Reports
POST   /api/v1/nlp/reports                          # Generate report
GET    /api/v1/nlp/reports                          # List reports
GET    /api/v1/nlp/reports/:id                      # Get report

# Policy Q&A
GET    /api/v1/nlp/policies/search?q=...           # Search policies
POST   /api/v1/nlp/policies/ask                     # Ask policy question

# Health
GET    /api/v1/nlp/health                         # LLM adapter health
```

## Frontend API Client

The dashboard includes a TypeScript API client for easy integration:

```typescript
import { api, useApi } from './lib/api';

// Authentication
const { token, user } = await api.login('admin@maia.com', 'password');

// Analyze audio
const result = await api.analyzeSync(audioFile, { level: 3 });

// Triage tracks
await api.trackAction(trackId, 'QUARANTINE', 'AI-generated voice clone detected', 98);

// Bulk actions
await api.bulkAction([track1, track2, track3], 'REJECT', 'Batch rejection');

// Start batch audit
const audit = await api.createAudit('UMG Weekly Scan', tracks, { level: 2 });
```

React hook usage:
```typescript
const MyComponent = () => {
  const api = useApi();
  
  useEffect(() => {
    api.getTracks().then(({ tracks }) => setTracks(tracks));
  }, []);
};
```

## Development Mode (No Backend Required)

The dashboard includes a **mock data system** for frontend development without running backend services:

### Auto-Features on `localhost`:
- **Auto-login**: Logs in as `ADMIN` user automatically
- **Mock API**: All API calls return realistic demo data
- **Full Access**: All dashboard pages populated with sample data

### Pages with Demo Data:
- **Dashboard** - Live metrics, charts, recent flags
- **Scan Queue** - 30 tracks ready for triage
- **Catalog Audits** - 10 batch audits with progress
- **Bot Farm Mapper** - Suspicious upload networks
- **IP Vault** - Protected artist embeddings (Taylor Swift, Drake, etc.)
- **Threat Intelligence** - Distributor trust scores
- **DSP Sync Matrix** - Takedown status across platforms
- **Compliance** - Audit logs with severity levels
- **Policy Engine** - Routing rules with conditions
- **VIP Fast Lane** - Whitelist management

### Start Dev Server:
```bash
npm run dev:frontend  # or: npx vite --port 8888
```

Access at `http://localhost:8888` - no Docker or backend services needed!

## DSP Integration Examples

### Real-time Upload Blocking (Synchronous)

```bash
# Upload and get immediate result
curl -X POST http://localhost:9999/api/v1/analyze/sync \
  -H "X-API-Key: your-api-key" \
  -F "audio=@track.mp3" \
  -F "level=1"

# Response (within 2000ms)
{
  "success": true,
  "data": {
    "level1": {
      "isAiGenerated": true,
      "confidence": 95,
      "classification": "AI_FLAGGED",
      "aiEngine": "Suno v3"
    }
  },
  "timing": {
    "totalMs": 450,
    "modelMs": 380
  }
}
```

### Large File Upload (Async via S3)

```typescript
// 1. Get presigned URL
const { uploadUrl, s3Url, trackId } = await api.getUploadUrl(
  'large-track.mp3',
  'audio/mpeg',
  45 * 1024 * 1024  // 45MB
);

// 2. Upload directly to S3 (client-side)
await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'audio/mpeg' },
  body: audioFile
});

// 3. Confirm and queue analysis
await api.confirmUpload(trackId, s3Url, { 
  analysisLevel: 3, 
  priority: 'high',
  webhookUrl: 'https://your-dsp.com/webhooks/maia'
});
```

### Batch Catalog Audit

```bash
# Start scan of entire catalog
curl -X POST http://localhost:9999/api/v1/audits \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 2024 Catalog Scan",
    "tracks": [
      {"url": "s3://bucket/track1.mp3", "trackId": "TRK-001"},
      {"url": "s3://bucket/track2.mp3", "trackId": "TRK-002"}
    ],
    "level": 2,
    "webhook_url": "https://your-dsp.com/webhooks/audit"
  }'

# Poll progress
curl http://localhost:9999/api/v1/audits/AUD-XXXX/progress
```

## Project Structure

```
maia-muse-dash/
├── src/
│   ├── adapters/           # Audio input adapters (multer, S3, stream, URL)
│   ├── components/         # React UI components
│   ├── db/                # Database connections (PostgreSQL, MongoDB, Redis)
│   ├── lib/               # Utilities and API client
│   ├── middleware/        # Auth, rate limiting, RBAC
│   ├── model/             # Model adapters (Mock, Local, GPU Server)
│   ├── processing/        # Sync/Async processors
│   ├── queues/            # Bull queue definitions
│   ├── routes/            # API route handlers
│   ├── webhooks/          # Webhook dispatcher
│   └── worker.ts          # Standalone queue worker
├── docker-compose.yml     # Local development stack
├── Dockerfile             # API server container
├── Dockerfile.worker      # Worker container
├── server.ts             # Express server entry point
└── .env.example          # Configuration template
```

## Run Locally

**Prerequisites:** Node.js, PostgreSQL, MongoDB, Redis (or Docker)

### Quick Start with Docker
```bash
# Start all services (API + databases)
docker-compose up -d

# Scale workers
 docker-compose up -d --scale worker=4
```

### Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start databases (if not using Docker):**
   ```bash
   # PostgreSQL
   brew install postgresql && brew services start postgresql
   createdb maia

   # MongoDB
   brew install mongodb-community && brew services start mongodb-community

   # Redis
   brew install redis && brew services start redis
   ```

4. **Start the API server:**
   ```bash
   npm run dev
   ```

5. **Start queue workers (in separate terminals):**
   ```bash
   # Terminal 1: Audio analysis workers
   npm run worker

   # Terminal 2: Additional workers (optional)
   npm run worker
   ```

The dashboard will be available at `http://localhost:9999`

## Deployment

### Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Change default `JWT_SECRET` to a secure random string
- [ ] Configure production database URLs
- [ ] Set up S3 bucket with proper IAM policies
- [ ] Configure webhook secrets
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure log aggregation
- [ ] Set up SSL/TLS certificates
- [ ] Configure backup strategies

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    image: maia-muse-api:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      MAIA_MODEL_MODE: local
      JWT_SECRET: ${JWT_SECRET}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9999/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
  
  worker:
    image: maia-muse-worker:latest
    deploy:
      replicas: 10
      resources:
        limits:
          cpus: '4'
          memory: 8G
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      MAIA_MODEL_MODE: local
```

### Kubernetes Deployment

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: maia-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: maia-api
  template:
    metadata:
      labels:
        app: maia-api
    spec:
      containers:
      - name: api
        image: maia-muse-api:latest
        ports:
        - containerPort: 9999
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: maia-secrets
              key: database-url
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 9999
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health/ready
            port: 9999
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
          requests:
            cpu: "1"
            memory: "2Gi"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: maia-worker
spec:
  replicas: 5
  selector:
    matchLabels:
      app: maia-worker
  template:
    metadata:
      labels:
        app: maia-worker
    spec:
      containers:
      - name: worker
        image: maia-muse-worker:latest
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          limits:
            cpu: "4"
            memory: "8Gi"
```

### Environment Variables

See `.env.example` for full configuration. Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `MONGODB_URL` | MongoDB connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes |
| `MAIA_MODEL_MODE` | `mock`, `local`, or `remote` | Yes |
| `MAIA_MODEL_ENDPOINT` | GPU server URL (if remote) | If remote |
| `AWS_REGION` | AWS region for S3 | For storage |
| `S3_BUCKET` | S3 bucket name | For storage |
| `WEBHOOK_SECRET` | Secret for webhook signatures | Recommended |

## Target Users

- **Major Labels**: UMG, Sony Music, Warner Music Group
- **Distributors**: CD Baby, DistroKid, TuneCore
- **Broadcasters**: Pandora, SiriusXM, iHeartRadio
- **DSPs**: Spotify, Apple Music, Amazon Music
- **Rights Management**: PROs, collection societies

## About the Model

MAIA MUSE is currently in training and being refined for production deployment. The detection interface provides enterprise-grade tooling for high-volume music screening workflows.
