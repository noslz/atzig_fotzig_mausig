'use client';

import React from 'react';
import { Download, RefreshCw, Sparkles, AlertCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResultProfile } from '../types/quiz';
import TernaryPlot from './TernaryPlot';

/**
 * Safely renders a string containing only <strong> tags as React elements.
 * No arbitrary HTML is allowed — only bold formatting is parsed.
 * This replaces dangerouslySetInnerHTML for security and html2canvas compatibility.
 */
function renderSafeHTML(html: string): React.ReactNode[] {
  const parts = html.split(/(<strong>.*?<\/strong>)/g);
  return parts.map((part, i) => {
    const match = part.match(/^<strong>(.*?)<\/strong>$/);
    if (match) {
      return <strong key={i}>{match[1]}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

interface ResultCardProps {
  profile: ResultProfile;
  onRestart: () => void;
  onExport: () => void;
  isExporting: boolean;
}

function ResultCardComponent({
  profile,
  onRestart,
  onExport,
  isExporting,
}: ResultCardProps) {
  const { name, scores, dimensions, primaryArchetype, hybridTitle, hybridDescription, colorTheme } = profile;

  // Render descriptive tags for dimensions
  const getDimensionCommentary = (dim: string, value: number) => {
    switch (dim) {
      case 'Neurotizismus':
        return value > 3.5 
          ? 'Schnell gestresst / Nimmt sich alles zu Herzen 🥺' 
          : 'Chillig AF / Lässt sich nicht stressen 🧘‍♂️';
      case 'Extraversion':
        return value > 3.5 
          ? 'Sehr extrovertiert / Braucht viel Action 🗣️' 
          : 'Eher introvertiert / Braucht Me-Time 🦥';
      case 'Verträglichkeit':
        return value > 3.5 
          ? 'Team Mom / Kümmerer-Syndrom 🫂' 
          : 'Sehr direkt / Sagt was Sache ist 💅';
      case 'Gewissenhaftigkeit':
        return value > 3.5 
          ? 'Sehr organisiert / Plant gerne im Voraus 🗃️' 
          : 'Eher chaotisch / Lebt im Moment 🌀';
      case 'Offenheit':
        return value > 3.5 
          ? 'Sehr offen für Neues / Kreativer Freigeist 🎨' 
          : 'Mag Routine / Braucht keine großen Experimente 🍕';
      default:
        return '';
    }
  };

  const getDimensionBarColor = (dim: string) => {
    switch (dim) {
      case 'Neurotizismus': return 'bg-neo-pink';
      case 'Extraversion': return 'bg-neo-lime';
      case 'Verträglichkeit': return 'bg-neo-blue';
      case 'Gewissenhaftigkeit': return 'bg-neo-orange';
      case 'Offenheit': return 'bg-neo-yellow';
      default: return 'bg-black';
    }
  };

  const getArchetypeLabel = (arch: 'mausig' | 'atzig' | 'fotzig') => {
    switch (arch) {
      case 'atzig': return '🤪 ATZIG';
      case 'mausig': return '🐀 MAUSIG';
      case 'fotzig': return '💅 FOTZIG';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      {/* EXPORT CONTAINER (This specific block will be screenshotted by html2canvas) */}
      <div 
        id="share-card" 
        className="w-full bg-[#FAF6EE] border-8 border-black p-8 md:p-12 flex flex-col gap-10 relative overflow-hidden select-none"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {/* Retro Diagonal Stripe Border Overlay for Neo-Brutalist look */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neo-yellow opacity-10 rotate-45 transform translate-x-12 -translate-y-12 border-4 border-black pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-neo-pink opacity-10 -rotate-45 transform -translate-x-8 translate-y-8 border-4 border-black pointer-events-none"></div>

        {/* Card Header Stamp */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black pb-8">
          <div>
            <span className="font-mono font-black bg-black text-white text-xs px-2 py-1 uppercase tracking-widest select-none">
              Offizielle Auswertung
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-black mt-2 leading-none tracking-tight select-none">
              Die Matrix-Aura
            </h2>
          </div>
          
          <div className="border-4 border-black bg-white p-3 flex flex-col items-end rotate-[1.5deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-mono text-xs font-black text-neutral-400">PROFIL-ID</span>
            <span className="font-mono text-base font-black text-black tracking-wider">
              #{name.toUpperCase()}-{Math.floor(scores.atzig)}{Math.floor(scores.mausig)}{Math.floor(scores.fotzig)}
            </span>
          </div>
        </div>

        {/* Main Grid: Ternary Plot on Left, Text Archetype details on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Ternary Matrix Grid (Col Span 5) */}
          <div className="md:col-span-5 flex justify-center w-full">
            <TernaryPlot 
              mausig={scores.mausig} 
              atzig={scores.atzig} 
              fotzig={scores.fotzig} 
              userName={name}
            />
          </div>

          {/* Right Column: Archetype Details (Col Span 7) */}
          <div className="md:col-span-7 flex flex-col gap-6 w-full">
            
            {/* The Main Badge & Combination Name */}
            <div className={`border-4 border-black p-8 md:p-10 ${colorTheme.bg} shadow-brutal flex flex-col gap-3 relative overflow-visible`}>
              {/* Clean absolute badge label floating above the border */}
              <div className="absolute -top-6 right-6 bg-black text-white border-4 border-black px-5 py-1.5 text-sm md:text-base font-mono font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none">
                Hauptvibe: {getArchetypeLabel(primaryArchetype)}
              </div>

              <span className="font-mono text-xs font-black text-neutral-500 uppercase tracking-widest select-none">
                Dein Charakter-Typ:
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-black leading-none uppercase tracking-tight select-none">
                „{hybridTitle}“
              </h3>
              
              {/* Description Body — rendered via safe parser, no dangerouslySetInnerHTML */}
              <div className="mt-3 text-black">
                <p className="text-sm md:text-base font-semibold leading-relaxed">
                  {renderSafeHTML(hybridDescription)}
                </p>
              </div>
            </div>

            {/* Detailed Big 5 Breakdown */}
            <div className="border-4 border-black bg-white p-8 shadow-brutal flex flex-col gap-6">
              <h4 className="font-mono font-black text-sm uppercase tracking-wider text-black flex items-center gap-2 border-b-2 border-black pb-2 select-none">
                <AlertCircle size={16} />
                Psychometrisches BFI-20 Protokoll
              </h4>

              <div className="flex flex-col gap-5">
                {Object.entries(dimensions).map(([dim, val]) => {
                  const percent = (val / 5) * 100;
                  const barColor = getDimensionBarColor(dim);
                  return (
                    <div key={dim} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          {/* Sarcastic commentary is now the visual focus */}
                          <span className="text-sm font-black text-black uppercase tracking-tight leading-tight">
                            {getDimensionCommentary(dim, val)}
                          </span>
                          {/* Scientific dimension is smaller and grayed out */}
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-0.5">
                            {dim}
                          </span>
                        </div>
                        {/* Numerical score tag */}
                        <span className="bg-black text-white px-2 py-0.5 font-mono text-[10px] font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none shrink-0">
                          {val.toFixed(1)} / 5.0
                        </span>
                      </div>
                      
                      {/* Heavy progress bar border */}
                      <div className="w-full h-6 bg-[#FAF6EE] border-4 border-black rounded-none relative overflow-hidden flex items-center">
                        <div 
                          className={`h-full ${barColor} border-r-4 border-black`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Footer Barcode Vibe */}
        <div className="border-t-4 border-black pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Funny barcode representation */}
            <div className="flex gap-[2px] items-stretch h-8 opacity-70">
              {[2, 4, 1, 3, 2, 5, 1, 4, 2, 1, 3, 5, 2, 4, 1, 3].map((w, idx) => (
                <div key={idx} className="bg-black" style={{ width: `${w}px` }}></div>
              ))}
            </div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Holy Trinity Matrix quiz SPA • BFI-20 Certified
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono font-black text-xs uppercase bg-neo-yellow border-2 border-black px-2 py-0.5">
            <Sparkles size={12} className="animate-pulse" />
            100% Client-Side Aura
          </div>
        </div>

      </div>

      {/* ACTION BUTTONS (Outside of the screenshot container so they don't get captured!) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        
        {/* Restart Button */}
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="neo-btn px-6 py-4 bg-white text-base flex items-center gap-2 w-full sm:w-auto justify-center animate-none"
          id="restart-btn"
        >
          <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '8s' }} />
          Quiz neu starten
        </motion.button>

        {/* Download Share Image Button */}
        <motion.button
          onClick={onExport}
          disabled={isExporting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="neo-btn px-6 py-4 bg-neo-lime text-base flex items-center gap-2 w-full sm:w-auto justify-center"
          id="export-btn"
        >
          <Share2 size={20} className={isExporting ? 'animate-bounce' : ''} />
          {isExporting ? 'Generiere Bild...' : 'Ergebnis direkt teilen'}
        </motion.button>

      </div>
    </div>
  );
}

export default React.memo(ResultCardComponent);
