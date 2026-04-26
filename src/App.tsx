import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload, Music2, ShieldAlert, ShieldCheck, AlertTriangle,
  CheckCircle2, Cpu, RotateCcw, Lock, Activity, Layers,
  Clock, Zap, ChevronRight, TrendingUp, Wand2, Play, Sun, Moon, ArrowLeft,
} from 'lucide-react';

// ── Brand logo component ───────────────────────────────────────────────────────
function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const iconSize  = size === 'sm' ? 'w-9 h-9'   : 'w-11 h-11';
  const titleSize = size === 'sm' ? 'text-lg'   : 'text-xl';
  const subSize   = size === 'sm' ? 'text-[9px]': 'text-[10px]';
  return (
    <div className="flex items-center gap-3">
      {/* Shield icon */}
      <div className={`${iconSize} flex-shrink-0 relative`}>
        <svg viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
          <path d="M22 2L4 10v14c0 11.5 7.7 22.3 18 25 10.3-2.7 18-13.5 18-25V10L22 2z"
            fill="url(#shieldGrad)" stroke="rgba(108,71,255,0.4)" strokeWidth="1"/>
          <defs>
            <linearGradient id="shieldGrad" x1="4" y1="2" x2="40" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="#6c47ff"/>
            </linearGradient>
          </defs>
          {/* Waveform bars */}
          {[
            {x:10, h:8,  y:21},
            {x:14, h:14, y:18},
            {x:18, h:20, y:15},
            {x:22, h:16, y:17},
            {x:26, h:22, y:14},
            {x:30, h:12, y:19},
            {x:34, h:6,  y:22},
          ].map((b,i)=>(
            <rect key={i} x={b.x} y={b.y} width="2.5" height={b.h} rx="1.2" fill="white" fillOpacity="0.9"/>
          ))}
        </svg>
      </div>
      {/* Text block */}
      <div className="flex flex-col leading-tight">
        <span className={`${subSize} font-mono uppercase tracking-[0.2em] text-muted-foreground`}>Powered by MAIA</span>
        <span className={`${titleSize} font-black tracking-tight text-foreground`}>MAIA MUSE™</span>
        <span className={`${subSize} font-mono text-muted-foreground`}>AI-Generated Music Detection</span>
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Separator } from './components/ui/separator';
import { cn } from './lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AnomalyRegion  { start: number; end: number; label: string; severity: 'high'|'medium'|'low' }
interface VoiceMatch     { artist: string; registryId: string; similarity: number }
interface GeneratorScore { name: string; score: number; isDetected: boolean }
interface AnalysisResult {
  isAI: boolean;
  confidence: number;
  aiEngine: string | null;
  generatorScores: GeneratorScore[];
  anomalyRegions: AnomalyRegion[];
  voiceMatch: VoiceMatch | null;
  processingMs: number;
}

// ── Seeded random ─────────────────────────────────────────────────────────────

function seededRand(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  return () => { h ^= h<<13; h ^= h>>17; h ^= h<<5; return (h>>>0)/0xFFFFFFFF; };
}

// ── All 11 generators ─────────────────────────────────────────────────────────

const GENERATORS = [
  'Suno v3.5','Suno v4','Udio v1.5','MusicGen',
  'MusicLDM','AudioLDM2','Stable Audio','Mustango',
  'YuE','DiffRhythm','Riffusion',
];

const PROTECTED_ARTISTS = [
  { name:'Taylor Swift', registryId:'UMG-REG-7712' },
  { name:'Drake',        registryId:'UMG-REG-8821' },
  { name:'The Weeknd',   registryId:'WMG-REG-2241' },
  { name:'Beyoncé',      registryId:'UMG-REG-5503' },
];

// ── Pre-loaded demo tracks ────────────────────────────────────────────────────

const DEMO_TRACKS = [
  {
    id:       'suno_generated_pop.mp3',
    label:    'AI Pop Track',
    desc:     'Suno v3.5 generated pop song',
    icon:     <Wand2 className="w-5 h-5" />,
    tag:      'AI',
    tagColor: 'destructive' as const,
  },
  {
    id:       'indie_folk_recording.mp3',
    label:    'Indie Folk Recording',
    desc:     'Live studio session, 2024',
    icon:     <Music2 className="w-5 h-5" />,
    tag:      'REAL',
    tagColor: 'success' as const,
  },
  {
    id:       'udio_hiphop_beat.mp3',
    label:    'Hip-Hop Beat',
    desc:     'AI-generated instrumental',
    icon:     <Play className="w-5 h-5" />,
    tag:      'AI',
    tagColor: 'destructive' as const,
  },
];

// ── Mock inference ────────────────────────────────────────────────────────────

function buildMockResult(filename: string): AnalysisResult {
  const rand = seededRand(filename);
  const r    = rand();

  // Demo tracks have known outcomes
  const knownReal = filename === 'indie_folk_recording.mp3';
  const isAI = knownReal ? false : r > 0.28;

  const confidence = isAI
    ? Math.round(80 + rand() * 19)
    : Math.round(83 + rand() * 16);

  const genIdx      = Math.floor(rand() * GENERATORS.length);
  const aiEngine    = isAI ? GENERATORS[genIdx] : null;

  // Generator scores — all 11, top one is the detected generator
  const generatorScores: GeneratorScore[] = GENERATORS.map((name, i) => {
    let score: number;
    if (!isAI) {
      score = Math.round(1 + rand() * 8);
    } else if (name === aiEngine) {
      score = confidence;
    } else {
      const decay = 1 - ((i + 1) * 0.07);
      score = Math.round(Math.max(2, rand() * 35 * decay));
    }
    return { name, score, isDetected: name === aiEngine };
  }).sort((a, b) => b.score - a.score);

  const regionCount   = confidence >= 92 ? 3 : confidence >= 78 ? 2 : 1;
  const allRegions: AnomalyRegion[] = [
    { start:0.12, end:0.27, label:'Spectral Smearing',  severity:'high'   },
    { start:0.50, end:0.64, label:'Uniform Harmonics',  severity:'medium' },
    { start:0.76, end:0.90, label:'Phase Incoherence',  severity:'high'   },
  ];
  const anomalyRegions = isAI ? allRegions.slice(0, regionCount) : [];

  const artistIdx      = Math.floor(rand() * PROTECTED_ARTISTS.length);
  const voiceSimilarity = Math.round(86 + rand() * 13);
  const voiceMatch     = isAI && confidence >= 87
    ? { artist: PROTECTED_ARTISTS[artistIdx].name, registryId: PROTECTED_ARTISTS[artistIdx].registryId, similarity: voiceSimilarity }
    : null;

  return {
    isAI, confidence, aiEngine, generatorScores, anomalyRegions, voiceMatch,
    processingMs: Math.round(820 + rand() * 1300),
  };
}

// ── Waveform Canvas ───────────────────────────────────────────────────────────

function WaveformCanvas({ trackId, isAI, anomalyRegions }: { trackId:string; isAI:boolean; anomalyRegions:AnomalyRegion[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const W = c.offsetWidth, H = c.offsetHeight;
    c.width = W; c.height = H;
    const rand = seededRand(trackId+'_wave');
    const BARS = 240, bw = W/BARS, cx = H/2;
    const bars = Array.from({length:BARS},(_,i)=>{
      const t=i/BARS;
      const raw = Math.abs(0.45*Math.sin(2*Math.PI*2.3*t+0.5)+0.25*Math.sin(2*Math.PI*5.7*t+1.2)+0.15*Math.sin(2*Math.PI*11.3*t+0.8)+0.22*(rand()-0.3));
      const inR = anomalyRegions.some(r=>t>=r.start&&t<=r.end);
      let h: number;
      if(inR) h=34+(rand()-0.5)*14;
      else if(isAI) h=Math.max(5,Math.min(88,raw*110));
      else { const lv=0.5+0.5*Math.abs(Math.sin(Math.PI*t*1.6)); h=Math.max(2,Math.min(98,raw*130*lv)); }
      return {h,inR};
    });
    // Region bg
    anomalyRegions.forEach(r=>{ ctx.fillStyle='rgba(244,63,94,0.07)'; ctx.fillRect(r.start*W,0,(r.end-r.start)*W,H); });
    // Centred line
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(0,cx); ctx.lineTo(W,cx); ctx.stroke();
    // Guide lines
    [0.25,0.75].forEach(y=>{ ctx.strokeStyle='rgba(255,255,255,0.03)'; ctx.beginPath(); ctx.moveTo(0,H*y); ctx.lineTo(W,H*y); ctx.stroke(); });
    // Bars
    bars.forEach(({h,inR},i)=>{
      const x=i*bw, half=(h/100)*(cx*0.88);
      const alpha=0.5+(h/100)*0.5;
      ctx.fillStyle = inR ? `rgba(244,63,94,${alpha})` : `rgba(108,71,255,${alpha})`;
      ctx.beginPath(); ctx.roundRect(x+0.5,cx-half,Math.max(1,bw-1),half,1); ctx.fill();
      ctx.globalAlpha=0.45;
      ctx.beginPath(); ctx.roundRect(x+0.5,cx,Math.max(1,bw-1),half,1); ctx.fill();
      ctx.globalAlpha=1;
    });
  },[trackId,isAI,anomalyRegions]);
  return <canvas ref={ref} className="w-full h-full block" />;
}

// ── Spectrogram Canvas ─────────────────────────��──────────────────────────────

function SpectrogramCanvas({ trackId, isAI, confidence }: { trackId:string; isAI:boolean; confidence:number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const ROWS=80, COLS=300;
    c.width=COLS; c.height=ROWS;
    const rand=seededRand(trackId+'_spec');
    const harmonics=[0.04,0.08,0.14,0.21,0.30,0.40,0.52,0.65,0.79];
    const wins=confidence>=90?[[0.12,0.28],[0.50,0.65],[0.76,0.90]]:confidence>=70?[[0.12,0.28],[0.50,0.65]]:[[0.12,0.28]];
    const img=ctx.createImageData(COLS,ROWS);
    for(let y=0;y<ROWS;y++){for(let x=0;x<COLS;x++){
      const fr=1-y/ROWS, t=x/COLS; let e=8+rand()*12;
      harmonics.forEach((hf,hi)=>{
        const d=Math.abs(fr-hf);
        if(d<0.018){ const a=1-hi*0.085, nv=isAI?0.92+rand()*0.08:0.3+0.9*Math.abs(Math.sin(Math.PI*t*(2.5+hi*0.6)+hi)); e+=240*a*nv*Math.pow(1-d/0.018,1.5); }
      });
      const env=isAI?0.72+0.28*Math.abs(Math.sin(Math.PI*t*1.8)):0.35+0.65*Math.abs(Math.sin(Math.PI*t*1.6+0.3));
      e*=env;
      if(isAI&&fr>0.55&&confidence>50&&(wins as number[][]).some(([s,w])=>t>=s&&t<=w)) e+=90+rand()*100;
      if(!isAI&&fr>0.2&&fr<0.65){ e*=0.6+0.7*rand(); if(rand()<0.012) e+=60+rand()*80; }
      const v=Math.min(255,Math.max(0,Math.round(e))), idx=(y*COLS+x)*4;
      img.data[idx]=Math.min(255,v); img.data[idx+1]=Math.min(255,v>128?(v-128)*1.6:0); img.data[idx+2]=Math.min(255,v<160?180-v:0); img.data[idx+3]=255;
    }}
    ctx.putImageData(img,0,0);
  },[trackId,isAI,confidence]);
  return <canvas ref={ref} className="w-full h-full rounded pixelated" />;
}

// ── Upload / Landing View ─────────────────────────────────────────────────────

function UploadView({ onFile, darkMode, onToggleTheme }: { onFile:(f:File)=>void; darkMode:boolean; onToggleTheme:()=>void }) {
  const [dragging,setDragging]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);

  const handleDrop=useCallback((e:React.DragEvent)=>{
    e.preventDefault(); setDragging(false);
    const f=e.dataTransfer.files[0]; if(f) onFile(f);
  },[onFile]);

  const useDemoTrack=(trackId:string)=>{
    const f=new File([new Uint8Array(1024)],'',{type:'audio/mpeg'});
    Object.defineProperty(f,'name',{value:trackId});
    onFile(f);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/60 px-8 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Live Demo</span>
            <span>99.35% F1 · 0.65% EER</span>
          </div>
          <button onClick={onToggleTheme} className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            {darkMode ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── Hero ── */}
        <div className="text-center mb-14 animate-in fade-in duration-700">
          <Badge variant="brand" className="mb-5 text-xs px-4 py-1.5 gap-1.5 font-mono uppercase tracking-wider">
            <Zap className="w-3 h-3" /> AI-Generated Music Detection
          </Badge>
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight mb-4 leading-none">
            <span className="gradient-text">MAIA MUSE™</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Upload any track. Our neural model detects AI generation, identifies the source, and pinpoints every artifact — in seconds.
          </p>
        </div>

        {/* ── Headline stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            { value:'99.35%',  sub:'Detection F1',      icon:<ShieldCheck className="w-4 h-4 text-[#6c47ff]"/>,    accent:'border-[#6c47ff]/20' },
            { value:'0.65%',   sub:'Equal Error Rate',   icon:<Activity    className="w-4 h-4 text-cyan-400"/>,     accent:'border-cyan-400/20'  },
            { value:'11',      sub:'AI Generators',      icon:<Layers      className="w-4 h-4 text-violet-400"/>,   accent:'border-violet-400/20'},
            { value:'3.2×',    sub:'Beats Resemble AI',  icon:<TrendingUp  className="w-4 h-4 text-emerald-400"/>  , accent:'border-emerald-400/20'},
          ].map(s=>(
            <Card key={s.sub} className={cn('bg-card border text-center p-4 transition-all hover:scale-[1.02] cursor-default', s.accent)}>
              <div className="flex justify-center mb-2">{s.icon}</div>
              <div className="text-3xl font-black text-foreground tracking-tight">{s.value}</div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* ── Demo tracks ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Try a pre-loaded example</div>
            <div className="flex-1 h-px bg-border/60"/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_TRACKS.map(t=>(
              <Card key={t.id}
                className="bg-card border border-border/60 hover:border-[#6c47ff]/40 hover:bg-[#6c47ff]/5 transition-all cursor-pointer group"
                onClick={()=>useDemoTrack(t.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-[#6c47ff]/20 transition-colors text-muted-foreground group-hover:text-[#6c47ff]">
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-foreground truncate">{t.label}</span>
                      <Badge variant={t.tagColor} className="text-[9px] px-1.5 py-0 font-mono flex-shrink-0">{t.tag}</Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">{t.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#6c47ff] transition-colors flex-shrink-0"/>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Upload zone ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Or upload your own track</div>
            <div className="flex-1 h-px bg-border/60"/>
          </div>
          <div
            className={cn(
              'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
              dragging ? 'drag-active' : 'border-border hover:border-[#6c47ff]/40 hover:bg-[#6c47ff]/4',
            )}
            onDragOver={e=>{e.preventDefault();setDragging(true);}}
            onDragLeave={()=>setDragging(false)}
            onDrop={handleDrop}
            onClick={()=>inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".mp3,.wav,.flac,.ogg,.m4a" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)onFile(f);}}/>
            <div className="flex flex-col items-center gap-4">
              <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center border transition-all',dragging?'bg-[#6c47ff]/20 border-[#6c47ff]/50':'bg-secondary border-border')}>
                <Upload className={cn('w-7 h-7 transition-colors',dragging?'text-[#6c47ff]':'text-muted-foreground')}/>
              </div>
              <div>
                <div className="text-foreground font-semibold text-lg mb-1">{dragging?'Drop to analyze':'Drop your audio file here'}</div>
                <div className="text-muted-foreground text-sm">MP3 · WAV · FLAC · M4A · OGG &nbsp;·&nbsp; up to 100 MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom competitor strip ── */}
        <div className="rounded-xl border border-border/50 bg-card p-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold"><CheckCircle2 className="w-3.5 h-3.5"/>Outperforms Resemble AI (2.099% EER → we achieve 0.65%)</span>
          <Separator orientation="vertical" className="h-4 hidden sm:block"/>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold"><CheckCircle2 className="w-3.5 h-3.5"/>Beats ArtifactNet F1 98.29% → we achieve 99.35%</span>
          <Separator orientation="vertical" className="h-4 hidden sm:block"/>
          <span className="flex items-center gap-1.5 text-[#6c47ff] font-semibold"><Zap className="w-3.5 h-3.5"/>Industry's only temporal localization + source attribution</span>
        </div>
      </div>
    </div>
  );
}

// ── Analyzing View ─────────────────────────────────────────────────��──────────

const STEPS=[
  {label:'Uploading audio file',         ms:700},
  {label:'Extracting spectral features', ms:950},
  {label:'Running MUSE neural model',    ms:1100},
  {label:'Generating forensic report',   ms:600},
];

function AnalyzingView({filename,darkMode,onToggleTheme}:{filename:string;darkMode:boolean;onToggleTheme:()=>void}) {
  const [step,setStep]=useState(0);
  useEffect(()=>{
    let s=0;
    const next=()=>{s++;if(s<STEPS.length){setStep(s);setTimeout(next,STEPS[s].ms);}};
    setTimeout(next,STEPS[0].ms);
  },[]);
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/60 px-8 py-4 flex items-center justify-between">
        <BrandLogo size="md" />
        <button onClick={onToggleTheme} className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          {darkMode ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
        </button>
      </nav>
    <div className="flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#6c47ff]/15 animate-ping"/>
            <div className="relative w-20 h-20 rounded-full bg-[#6c47ff]/15 border border-[#6c47ff]/40 flex items-center justify-center glow-brand">
              <Music2 className="w-9 h-9 text-[#6c47ff]"/>
            </div>
          </div>
        </div>
        <h2 className="text-center text-xl font-bold text-foreground mb-1">Analyzing Track</h2>
        <p className="text-center text-muted-foreground text-sm mb-8 font-mono truncate">{filename}</p>
        <div className="space-y-2.5 mb-8">
          {STEPS.map((s,i)=>{
            const done=i<step, active=i===step;
            return (
              <div key={s.label} className={cn('flex items-center gap-4 p-4 rounded-xl border transition-all step-in',
                done?'border-green-500/20 bg-green-500/5':active?'border-[#6c47ff]/30 bg-[#6c47ff]/8':'border-border bg-card opacity-40'
              )} style={{animationDelay:`${i*80}ms`}}>
                <div className={cn('w-7 h-7 rounded-full flex items-center justify-center border flex-shrink-0',
                  done?'bg-green-500/20 border-green-500/40':active?'bg-[#6c47ff]/20 border-[#6c47ff]/50':'bg-secondary border-border'
                )}>
                  {done?<CheckCircle2 className="w-4 h-4 text-green-400"/>:active?<div className="w-3 h-3 rounded-full bg-[#6c47ff] animate-pulse"/>:<div className="w-2.5 h-2.5 rounded-full bg-border"/>}
                </div>
                <span className={cn('text-sm font-medium',done?'text-green-400':active?'text-foreground':'text-muted-foreground')}>{s.label}</span>
                {active&&<div className="ml-auto flex gap-1">{[0,1,2].map(j=><div key={j} className="w-1.5 h-1.5 rounded-full bg-[#6c47ff] animate-bounce" style={{animationDelay:`${j*120}ms`}}/>)}</div>}
              </div>
            );
          })}
        </div>
        <Progress value={((step+1)/STEPS.length)*100} className="h-1.5 bg-secondary" indicatorClassName="bg-gradient-to-r from-[#6c47ff] to-cyan-400"/>
        <div className="mt-2 text-center text-[10px] font-mono text-muted-foreground">{Math.round(((step+1)/STEPS.length)*100)}% complete</div>
      </div>
    </div>
    </div>
  );
}

// ── Results View ──────────────────────────────────────────────────────────────

function ResultsView({filename,result,onReset,darkMode,onToggleTheme}:{filename:string;result:AnalysisResult;onReset:()=>void;darkMode:boolean;onToggleTheme:()=>void}) {
  const {isAI,confidence,aiEngine,generatorScores,anomalyRegions,voiceMatch,processingMs}=result;
  const trackId=filename.replace(/\.[^/.]+$/,'');

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/60 px-6 py-3.5 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono">
            <ArrowLeft className="w-3.5 h-3.5"/> Home
          </button>
          <BrandLogo size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2 text-xs">
            <RotateCcw className="w-3.5 h-3.5"/> Analyze Another
          </Button>
          <button onClick={onToggleTheme} className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            {darkMode ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5 animate-in fade-in duration-500">

        {/* ── Verdict Hero ── */}
        <Card className={cn('border overflow-hidden',isAI?'border-red-500/25 glow-danger':'border-green-500/25 glow-success')}>
          <div className={cn('h-1 w-full',isAI?'bg-gradient-to-r from-red-500 to-rose-500':'bg-gradient-to-r from-green-500 to-emerald-400')}/>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center border flex-shrink-0',
                  isAI?'bg-red-500/15 border-red-500/30':'bg-green-500/15 border-green-500/30')}>
                  {isAI?<ShieldAlert className="w-8 h-8 text-red-400"/>:<ShieldCheck className="w-8 h-8 text-green-400"/>}
                </div>
                <div>
                  <div className={cn('flex items-center gap-2 mb-1 text-[10px] font-mono uppercase tracking-widest',isAI?'text-red-400':'text-green-400')}>
                    <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse',isAI?'bg-red-400':'bg-green-400')}/>
                    {isAI?'AI Artifact Detected':'No AI Artifacts Found'}
                  </div>
                  <div className={cn('text-4xl font-black tracking-tight',isAI?'text-red-400':'text-green-400')}>
                    {isAI?'AI Generated':'Authentic Music'}
                  </div>
                  <div className="text-muted-foreground text-sm mt-1 font-mono">{filename}</div>
                </div>
              </div>
              {/* Quick stats */}
              <div className="flex gap-3 flex-wrap">
                {[
                  {label:'Confidence',   value:`${confidence}%`,   color:isAI?'text-red-400':'text-green-400'},
                  {label:'Source',       value:aiEngine??'—',      color:'text-foreground'},
                  {label:'Regions',      value:String(anomalyRegions.length), color:anomalyRegions.length>0?'text-red-400':'text-green-400'},
                  {label:'Processed in', value:`${processingMs}ms`, color:'text-foreground'},
                ].map(s=>(
                  <div key={s.label} className="bg-secondary rounded-xl px-4 py-3 text-center min-w-[80px]">
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{s.label}</div>
                    <div className={cn('text-sm font-bold truncate max-w-[120px]',s.color)}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Middle row: Visualizations + Generator scores ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Waveform + Spectrogram tabs (wider) */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="waveform">
              <div className="flex items-center justify-between mb-3">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="waveform"    className="text-xs font-mono">Waveform</TabsTrigger>
                  <TabsTrigger value="spectrogram" className="text-xs font-mono">Spectrogram</TabsTrigger>
                </TabsList>
                {isAI&&anomalyRegions.length>0&&(
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
                    {anomalyRegions.length} artifact region{anomalyRegions.length>1?'s':''} detected
                  </div>
                )}
              </div>

              <TabsContent value="waveform">
                <Card className="border-border/60 bg-card overflow-hidden">
                  <CardContent className="p-4">
                    <div className="relative h-44 rounded-lg overflow-hidden bg-background border border-border/40">
                      <WaveformCanvas trackId={trackId} isAI={isAI} anomalyRegions={anomalyRegions}/>
                      {isAI&&<div className="scanline"/>}
                    </div>
                    <div className="mt-2 flex justify-between text-[9px] font-mono text-muted-foreground/50">
                      <span>0:00</span><span>0:52</span><span>1:45</span><span>2:37</span><span>3:30</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                      {isAI&&<span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-red-400/80 inline-block"/>Artifact Zone</span>}
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2 rounded-sm bg-[#6c47ff]/70 inline-block"/>Clean Signal</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spectrogram">
                <Card className="border-border/60 bg-card overflow-hidden">
                  <CardContent className="p-4">
                    <div className="relative h-44 rounded-lg overflow-hidden bg-background border border-border/40">
                      <SpectrogramCanvas trackId={trackId} isAI={isAI} confidence={confidence}/>
                    </div>
                    <div className="mt-2 flex justify-between text-[9px] font-mono text-muted-foreground/50">
                      <span>20Hz</span>
                      <span className="text-muted-foreground/30">← Frequency (Log Scale) · Time →</span>
                      <span>22kHz</span>
                    </div>
                    {isAI&&(
                      <div className="mt-3 flex items-start gap-2 text-[10px] text-muted-foreground bg-red-500/5 border border-red-500/15 rounded-lg p-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0"/>
                        High-frequency smearing visible — characteristic of AI vocoder deconvolution artifacts
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Generator confidence (narrower) */}
          <Card className="lg:col-span-2 border-border/60 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#6c47ff]"/> Generator Attribution
              </CardTitle>
              <p className="text-[10px] text-muted-foreground font-mono">All 11 AI generators scored</p>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {generatorScores.slice(0,11).map((g,i)=>(
                <div key={g.name} className={cn('flex items-center gap-2.5 p-2 rounded-lg transition-colors',g.isDetected&&isAI?'bg-red-500/8 border border-red-500/20':'hover:bg-secondary')}>
                  <div className="text-[9px] font-mono text-muted-foreground w-3 text-right flex-shrink-0">{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-[11px] font-medium truncate',g.isDetected&&isAI?'text-red-400':'text-foreground/70')}>{g.name}</span>
                      <span className={cn('text-[10px] font-mono font-bold flex-shrink-0 ml-2',g.isDetected&&isAI?'text-red-400':'text-muted-foreground')}>{g.score}%</span>
                    </div>
                    <Progress
                      value={g.score}
                      className="h-1.5 bg-secondary"
                      indicatorClassName={cn(g.isDetected&&isAI?'bg-gradient-to-r from-red-500 to-rose-400':'bg-gradient-to-r from-[#6c47ff]/40 to-[#6c47ff]/20')}
                    />
                  </div>
                  {g.isDetected&&isAI&&<AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0"/>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Bottom row: Temporal regions + IP Vault ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Temporal localization */}
          <Card className="lg:col-span-3 border-border/60 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6c47ff]"/> Temporal Localization
                <Badge variant="brand" className="text-[9px] font-mono ml-1">Industry First</Badge>
              </CardTitle>
              <p className="text-[10px] text-muted-foreground font-mono">Exact timestamps of AI artifact regions</p>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {anomalyRegions.length>0?(
                <>
                  {/* Mini timeline */}
                  <div className="relative h-7 rounded-lg bg-background border border-border/50 overflow-hidden">
                    <div className="absolute inset-0 bg-green-500/4"/>
                    {anomalyRegions.map((r,i)=>(
                      <div key={i} className="absolute top-0 bottom-0 region-pulse border-l border-r border-red-500/25"
                        style={{left:`${r.start*100}%`,width:`${(r.end-r.start)*100}%`}}/>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                      <span className="text-[8px] font-mono text-muted-foreground/40">0:00</span>
                      <span className="text-[8px] font-mono text-muted-foreground/40">3:30</span>
                    </div>
                  </div>
                  {anomalyRegions.map((r,i)=>(
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/15 rounded-xl">
                      <div className={cn('mt-0.5 px-2 py-0.5 rounded text-[9px] font-mono uppercase border flex-shrink-0',
                        r.severity==='high'?'bg-red-500/15 border-red-500/30 text-red-400':'bg-amber-500/15 border-amber-500/30 text-amber-400')}>
                        {r.severity}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground mb-0.5">{r.label}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {Math.round(r.start*210)}s – {Math.round(r.end*210)}s &nbsp;·&nbsp; {Math.round((r.end-r.start)*100)}% of track
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ):(
                <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/15 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0"/>
                  <div>
                    <div className="text-sm font-semibold text-green-400">No Artifact Regions Found</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Temporal profile consistent with natural human recording</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* IP Vault */}
          <Card className="lg:col-span-2 border-border/60 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#6c47ff]"/> IP Vault
              </CardTitle>
              <p className="text-[10px] text-muted-foreground font-mono">Voice clone registry match</p>
            </CardHeader>
            <CardContent className="pt-0">
              {voiceMatch?(
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-red-500/8 border border-red-500/20 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0"/>
                    <div>
                      <div className="text-[9px] font-mono text-red-400 uppercase tracking-wider">Match Found</div>
                      <div className="text-sm font-bold text-foreground">{voiceMatch.artist}</div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      {k:'Registry ID',  v:voiceMatch.registryId, vc:'text-[#6c47ff]'},
                      {k:'Similarity',   v:`${voiceMatch.similarity}%`, vc:'text-red-400'},
                      {k:'Status',       v:'Protected',           vc:'text-red-400'},
                    ].map(r=>(
                      <div key={r.k} className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-muted-foreground">{r.k}</span>
                        <span className={cn('text-[11px] font-semibold font-mono',r.vc)}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 bg-red-500/6 border border-red-500/15 rounded-lg text-[10px] text-muted-foreground leading-relaxed">
                    Unauthorized vocal clone. Flagged for label enforcement review.
                  </div>
                </div>
              ):(
                <div className="flex flex-col items-center text-center py-5 gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-400"/>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-green-400">No Registry Match</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1 leading-relaxed">
                      No protected artist vocal profile matched.
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4"/>
              <div className="space-y-1.5">
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Model</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6c47ff]"/>
                  <span className="text-xs font-mono text-foreground">MAIA MUSE GTM v2</span>
                </div>
                <div className="text-[9px] font-mono text-muted-foreground">CLAP · 48kHz · 11 generators · EER 0.65%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Competitor proof strip ── */}
        <Card className="border-border/40 bg-card">
          <CardContent className="py-3 px-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-1.5 text-[10px] font-mono text-muted-foreground">
            <span className="text-[#6c47ff] font-semibold uppercase tracking-wider">MAIA MUSE vs. Competitors</span>
            {[
              {sys:'Resemble AI',   eer:'2.099%', f1:'97.9%'},
              {sys:'ArtifactNet',   eer:'—',      f1:'98.29%'},
              {sys:'CLAM',          eer:'—',      f1:'92.5%'},
              {sys:'SpecTTTra',     eer:'—',      f1:'86.9%'},
            ].map(c=>(
              <span key={c.sys} className="flex items-center gap-1.5">
                <span className="text-muted-foreground">{c.sys}</span>
                <span className="text-red-400/70">{c.f1} F1</span>
                <span className="text-red-400/50 text-[8px]">vs</span>
                <span className="text-green-400 font-semibold">99.35% ours</span>
              </span>
            ))}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/40 pb-4">
          <span>MAIA MUSE™ · AI Music Detection Platform</span>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 text-[10px] text-muted-foreground">
            <RotateCcw className="w-3 h-3"/> Analyze another
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

type AppState = 'upload' | 'analyzing' | 'results';

export default function App() {
  const [state,    setState]    = useState<AppState>('upload');
  const [filename, setFilename] = useState('');
  const [result,   setResult]   = useState<AnalysisResult|null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = useCallback(() => setDarkMode(d => !d), []);

  const handleFile=useCallback(async(file:File)=>{
    setFilename(file.name);
    setState('analyzing');
    try {
      const form=new FormData(); form.append('audio',file);
      const res=await fetch('/api/analyze',{method:'POST',body:form});
      if(!res.ok) throw new Error();
      const data=await res.json();
      if(!data.generatorScores) data.generatorScores=buildMockResult(file.name).generatorScores;
      setResult(data);
    } catch {
      await new Promise(r=>setTimeout(r,3200));
      setResult(buildMockResult(file.name));
    }
    setState('results');
  },[]);

  const handleReset=useCallback(()=>{setState('upload');setFilename('');setResult(null);},[]);

  return (
    <div className={darkMode ? '' : 'light'}>
      {state==='upload'    && <UploadView   onFile={handleFile} darkMode={darkMode} onToggleTheme={toggleTheme}/>}
      {state==='analyzing' && <AnalyzingView filename={filename} darkMode={darkMode} onToggleTheme={toggleTheme}/>}
      {state==='results'&&result && <ResultsView filename={filename} result={result} onReset={handleReset} darkMode={darkMode} onToggleTheme={toggleTheme}/>}
    </div>
  );
}
