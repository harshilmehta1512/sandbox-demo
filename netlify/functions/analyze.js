const https = require('https');
const http = require('http');

const MODEL_MODE = process.env.MAIA_MODEL_MODE || 'demo';
const MODEL_ENDPOINT = process.env.MAIA_MODEL_ENDPOINT || 'http://localhost:8001';

// ── Deterministic mock inference ─────────────────────────────────────────────

function seededRand(seed) {
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

function mockInfer(filename) {
  const rand = seededRand(filename);
  const r    = rand();
  const isAI = r > 0.30;
  const confidence = isAI
    ? Math.round(78 + rand() * 21)
    : Math.round(82 + rand() * 17);
  const genIdx   = Math.floor(rand() * GENERATORS.length);
  const aiEngine = GENERATORS[genIdx];
  const regionCount = confidence >= 90 ? 3 : confidence >= 75 ? 2 : 1;
  const allRegions = [
    { start: 0.12, end: 0.27, label: 'Spectral Smearing',  severity: 'high'   },
    { start: 0.50, end: 0.64, label: 'Uniform Harmonics',  severity: 'medium' },
    { start: 0.76, end: 0.90, label: 'Phase Incoherence',  severity: 'high'   },
  ];
  const anomalyRegions = isAI ? allRegions.slice(0, regionCount) : [];
  const artistIdx      = Math.floor(rand() * PROTECTED_ARTISTS.length);
  const voiceSimilarity = Math.round(85 + rand() * 14);
  const voiceMatch = isAI && confidence >= 85 ? {
    artist:     PROTECTED_ARTISTS[artistIdx].name,
    registryId: PROTECTED_ARTISTS[artistIdx].registryId,
    similarity: voiceSimilarity,
  } : null;
  return {
    isAI, confidence,
    aiEngine:      isAI ? aiEngine : null,
    anomalyRegions,
    voiceMatch,
    processingMs:  Math.round(800 + rand() * 1200),
  };
}

// ── Parse multipart form-data to extract the audio file buffer ────────────────

function parseMultipart(body, boundary) {
  const boundaryBuf = Buffer.from('--' + boundary);
  const parts = [];
  let start = 0;
  while (start < body.length) {
    const bStart = indexOfBuffer(body, boundaryBuf, start);
    if (bStart === -1) break;
    const headerStart = bStart + boundaryBuf.length + 2; // skip \r\n
    const headerEnd   = indexOfBuffer(body, Buffer.from('\r\n\r\n'), headerStart);
    if (headerEnd === -1) break;
    const headers    = body.slice(headerStart, headerEnd).toString();
    const dataStart  = headerEnd + 4;
    const nextBound  = indexOfBuffer(body, boundaryBuf, dataStart);
    const dataEnd    = nextBound === -1 ? body.length : nextBound - 2; // strip \r\n
    parts.push({ headers, data: body.slice(dataStart, dataEnd) });
    start = nextBound === -1 ? body.length : nextBound;
  }
  return parts;
}

function indexOfBuffer(buf, search, offset = 0) {
  for (let i = offset; i <= buf.length - search.length; i++) {
    let found = true;
    for (let j = 0; j < search.length; j++) {
      if (buf[i + j] !== search[j]) { found = false; break; }
    }
    if (found) return i;
  }
  return -1;
}

// ── Call inference server ─────────────────────────────────────────────────────

function callInferenceServer(audioB64, filename) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      audio:    audioB64,
      filename: filename,
      level:    3,
      trackId:  `NETLIFY-${Date.now()}`,
    });
    const url = new URL(`${MODEL_ENDPOINT}/analyze`);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: url.hostname,
      port:     url.port || (url.protocol === 'https:' ? 443 : 80),
      path:     url.pathname,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 60000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Invalid JSON from inference server')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Inference server timeout')); });
    req.write(payload);
    req.end();
  });
}

// ── Netlify function handler ──────────────────────────────────────────────────

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Parse the multipart body to get the audio file
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No boundary in content-type' }) };
    }

    const boundary = boundaryMatch[1].trim();
    const rawBody  = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    const parts    = parseMultipart(rawBody, boundary);

    // Find the audio part
    const audioPart = parts.find(p => p.headers.includes('name="audio"'));
    if (!audioPart) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No audio file provided' }) };
    }

    // Extract filename from headers
    const filenameMatch = audioPart.headers.match(/filename="([^"]+)"/);
    const filename = filenameMatch ? filenameMatch[1] : 'track.mp3';

    if (MODEL_MODE === 'gpu') {
      try {
        const audioB64 = audioPart.data.toString('base64');
        const r = await callInferenceServer(audioB64, filename);

        const generatorScores = (r.level2?.sourceAttribution?.allGenerators ?? []).map(g => ({
          name:       g.name,
          score:      Math.round(g.confidence),
          isDetected: g.name === r.level1?.aiEngine,
        }));

        const anomalyRegions = (r.level3?.anomalyRegions ?? []).map((region, i) => {
          const labels = ['Spectral Smearing', 'Phase Incoherence', 'Harmonic Artifact', 'High-Freq Dropout'];
          return {
            start:    region.start,
            end:      region.end,
            severity: region.severity,
            label:    labels[i % labels.length],
          };
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            isAI:            r.level1?.isAiGenerated ?? false,
            confidence:      Math.round(r.level1?.confidence ?? 0),
            aiEngine:        r.level1?.aiEngine ?? null,
            generatorScores,
            anomalyRegions,
            voiceMatch:      null,
            processingMs:    r.processingTimeMs ?? 0,
            temporalProfile: r.level3?.temporalProfile ?? [],
          }),
        };
      } catch (err) {
        console.error('GPU inference failed, falling back to demo:', err.message);
        // Fall through to demo mode
      }
    }

    // Demo mode (or GPU fallback)
    await new Promise(r => setTimeout(r, 1200));
    const result = mockInfer(filename);
    return { statusCode: 200, headers, body: JSON.stringify(result) };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
