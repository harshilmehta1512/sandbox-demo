# MAIA MUSE — Sandbox Demo

A lightweight demo interface for the MAIA MUSE AI music detection model. Upload any audio track to detect AI-generated music and identify the source platform (Suno, Udio, MusicGen, and others).

---

## What This Is

The sandbox demo is a self-contained React + Express application that demonstrates MAIA MUSE detection in a browser UI. It runs in two modes:

- **Demo mode** (default) — uses deterministic mock data so you can explore the UI with no GPU or model required
- **GPU mode** — connects to the live MUSE inference server for real detection results

This is not the full enterprise dashboard (that is MAIA-MUSE). This is a single-page demo built for quick evaluation and presentations.

---

## Model Performance

The underlying MUSE GTM v5 model this demo connects to achieves:

| Metric | Value |
|--------|-------|
| **Test Accuracy** | **99.85%** |
| **Test EER (%)** | **0.16** |
| **Validation EER (%)** | **0.11** |
| **AI Sources Covered** | 11 (Suno, Udio, MusicGen, DiffRhythm, YuE, and others) |
| **Architecture** | CLAP (laion/clap-htsat-unfused) + multi-task GTM head |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Install and Run

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# Edit .env if needed (default is demo mode — no changes required)

# 3. Start the dev server
npm run dev
```

Open `http://localhost:5174` in your browser.

This starts two processes concurrently:
- **Express backend** on port 3001 — handles audio uploads and proxies to the model
- **Vite frontend** on port 5174 — the React UI

---

## Modes

### Demo Mode (default)

No model or GPU needed. The backend returns realistic mock detection results so the full UI flow can be tested.

Set in `.env`:
```
MAIA_MODEL_MODE=demo
```

### GPU Mode (live model)

Connects to the MUSE inference server running on port 8011. Requires the MAIA-VOICE backend to be running.

Set in `.env`:
```
MAIA_MODEL_MODE=gpu
MAIA_MODEL_ENDPOINT=http://localhost:8001
```

If the inference server is on a remote Azure VM, open an SSH tunnel first:
```bash
ssh -i ~/path/to/key.pem -p 50000 -L 8001:localhost:8001 azureuser@<VM_IP> -N &
```

---

## Project Structure

```
sandbox-demo/
├── src/
│   ├── App.tsx              # Main React application
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   ├── lib/utils.ts         # Utility functions
│   └── components/ui/       # Shared UI components (Button, Card, Badge, etc.)
├── public/                  # Static assets (logos)
├── netlify/
│   └── functions/
│       └── analyze.js       # Netlify serverless function (for deployed version)
├── server.ts                # Express backend — handles /api/analyze endpoint
├── vite.config.ts           # Vite config — proxies /api to Express on port 3001
├── netlify.toml             # Netlify deployment config
├── .env.example             # Environment variable template
└── package.json
```

---

## Deployment (Netlify)

The demo can be deployed to Netlify. The `netlify/functions/analyze.js` serverless function replaces the Express backend for the deployed version.

```bash
# Build the frontend
npm run build

# Deploy via Netlify CLI
netlify deploy --prod
```

Set `MAIA_MODEL_ENDPOINT` in the Netlify environment variables to point to your production inference server.

---

## Ports

| Service | Port | Notes |
|---------|------|-------|
| Vite frontend | 5174 | Main browser URL |
| Express backend | 3001 | Handles `/api/analyze` — proxied from Vite |
| MUSE inference server | 8001 | Only needed in GPU mode (lives in MAIA-VOICE) |
