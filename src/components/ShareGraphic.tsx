'use client';

import React from 'react';
import { ResultProfile } from '../types/quiz';
import TernaryPlot from './TernaryPlot';

interface ShareGraphicProps {
  profile: ResultProfile;
}

export default function ShareGraphic({ profile }: ShareGraphicProps) {
  return (
    <div className="fixed top-0 left-0 w-[1080px] h-[1920px] pointer-events-none z-[9998]">
      <div 
        id="export-poster"
        className="bg-[#FAF6EE] flex flex-col items-center justify-between overflow-hidden w-[1080px] h-[1920px]"
        style={{ width: '1080px', height: '1920px', padding: '100px 80px' }}
      >
      {/* Background Graphic Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-neo-pink border-[8px] border-black rotate-[15deg] opacity-80" />
      <div className="absolute bottom-40 right-10 w-60 h-60 bg-neo-lime border-[8px] border-black rounded-full -rotate-[15deg] opacity-80" />
      <div className="absolute top-1/4 right-[-40px] w-48 h-48 bg-neo-blue border-[8px] border-black rotate-[45deg] opacity-80" />

      {/* Header Section */}
      <div className="z-10 flex flex-col items-center gap-6 w-full mt-10">
        <h1 className="text-[90px] font-black uppercase text-black leading-none tracking-tighter text-center">
          Die Matrix-Aura
        </h1>
        <div className="bg-black text-white px-8 py-3 text-[40px] font-mono font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(255,105,180,1)] rotate-[-2deg]">
          PROFIL-ID: {profile.name}
        </div>
      </div>

      {/* Matrix (Ternary Plot) Section */}
      <div className="z-10 w-full flex-1 flex flex-col items-center justify-center scale-125 origin-center my-10">
        <div className="w-[700px] pointer-events-none">
          <TernaryPlot 
            mausig={profile.scores.mausig} 
            atzig={profile.scores.atzig} 
            fotzig={profile.scores.fotzig} 
            userName={profile.name}
          />
        </div>
      </div>

      {/* Result Archetype Badge */}
      <div className="z-10 w-full border-[12px] border-black bg-white p-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-8 relative mt-16 mb-20">
        
        {/* Giant Top Badge */}
        <div 
          className={`absolute -top-16 left-1/2 -translate-x-1/2 border-[8px] border-black px-12 py-4 text-[45px] font-black uppercase whitespace-nowrap shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${profile.colorTheme} text-black rotate-[2deg]`}
        >
          Hauptvibe: {profile.primaryArchetype}
        </div>

        {/* Title */}
        <div className="mt-10 flex items-center gap-6">
          <span className="text-[70px]">🎯</span>
          <h2 className="text-[55px] font-black uppercase text-black leading-tight">
            {profile.hybridTitle}
          </h2>
        </div>

        {/* Description */}
        <p className="text-[35px] font-bold text-neutral-800 leading-snug">
          {profile.hybridDescription}
        </p>
      </div>

      {/* Footer Branding */}
      <div className="z-10 mt-auto text-center font-mono text-[30px] font-black uppercase text-black/50 tracking-widest">
        Mach den Test auf atzigfotzigmausig.vercel.app
      </div>
    </div>
    </div>
  );
}
