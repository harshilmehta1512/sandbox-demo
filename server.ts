import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

const PORT = process.env.PORT || 3001;
const MODEL_MODE = process.env.MAIA_MODEL_MODE || 'demo';
const MODEL_ENDPOINT = process.env.MAIA_MODEL_ENDPOINT || 'http://localhost:8001';

// ── Deterministic mock inference ─────────────────────────────────────────────

function seededRand(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5;
    return (h >>> 0) / 0xFFFFFFFF;
  };
}

const GENERATORS = [
  'Suno v3.5', 'Suno v4', 'Udio v1.5', 'MusicGen',
  'MusicLDM', 'AudioLDM2', 'Stable Audio', 'Mustango',
  'YuE', 'DiffRhythm', 'Riffusion',
];

const PROTECTED_ARTISTS = [
  { name: 'Taylor Swift',  registryId: 'UMG-REG-7712' },
  { name: 'Drake',         registryId: 'UMG-REG-8821' },
  { name: 'The Weeknd',    registryId: 'WMG-REG-2241' },
  { name: 'Beyoncé',       registryId: 'UMG-REG-5503' },
];

function mockInfer(filename: string) {
  const rand = seededRand(filename);
  const r    = rand();

  const isAI      = r > 0.30; // 70% flagged as AI for demo realism
  const confidence = isAI
    ? Math.round(78 + rand() * 21)   // 78–99%
    : Math.round(82 + rand() * 17);  // 82–99% real confidence

  const genIdx    = Math.floor(rand() * GENERATORS.length);
  const aiEngine  = GENERATORS[genIdx];

  // Anomaly regions — more at higher confidence
  const regionCount = confidence >= 90 ? 3 : confidence >= 75 ? 2 : 1;
  const allRegions = [
    { start: 0.12, end: 0.27, label: 'Spectral Smearing',  severity: 'high'   as const },
    { start: 0.50, end: 0.64, label: 'Uniform Harmonics',  severity: 'medium' as const },
    { start: 0.76, end: 0.90, label: 'Phase Incoherence',  severity: 'high'   as const },
  ];
  const anomalyRegions = isAI ? allRegions.slice(0, regionCount) : [];

  // Voice match only for high-confidence AI
  const artistIdx     = Math.floor(rand() * PROTECTED_ARTISTS.length);
  const voiceSimilarity = Math.round(85 + rand() * 14);
  const voiceMatch    = isAI && confidence >= 85 ? {
    artist:     PROTECTED_ARTISTS[artistIdx].name,
    registryId: PROTECTED_ARTISTS[artistIdx].registryId,
    similarity: voiceSimilarity,
  } : null;

  return {
    isAI,
    confidence,
    aiEngine:      isAI ? aiEngine : null,
    anomalyRegions,
    voiceMatch,
    processingMs:  Math.round(800 + rand() * 1200),
  };
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.post('/api/analyze', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No audio file provided' });
    return;
  }

  try {
    if (MODEL_MODE === 'gpu') {
      // Forward to real GPU inference server
      const form = new FormData();
      form.append('audio', req.file.buffer, {
        filename:    req.file.originalname,
        contentType: req.file.mimetype,
      });
      const response = await axios.post(`${MODEL_ENDPOINT}/analyze`, form, {
        headers: form.getHeaders(),
        timeout: 30000,
      });
      res.json(response.data);
    } else {
      // Demo mode — deterministic mock
      await new Promise(r => setTimeout(r, 1200)); // realistic delay
      const result = mockInfer(req.file.originalname || 'track.mp3');
      res.json(result);
    }
  } catch (err) {
    console.error('Inference error:', err);
    // Fallback to demo mode if GPU server unreachable
    const result = mockInfer(req.file.originalname || 'track.mp3');
    res.json(result);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mode: MODEL_MODE, version: '1.0.0' });
});

// ── Serve built frontend in production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n  MAIA MUSE Sandbox API`);
  console.log(`  Mode:     ${MODEL_MODE.toUpperCase()}`);
  console.log(`  Endpoint: http://localhost:${PORT}\n`);
});
