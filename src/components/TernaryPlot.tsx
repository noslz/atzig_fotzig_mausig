'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TernaryPlotProps {
  mausig: number; // 0 to 100
  atzig: number;  // 0 to 100
  fotzig: number; // 0 to 100
  userName?: string;
}

export default React.memo(function TernaryPlot({ mausig, atzig, fotzig, userName = 'Du' }: TernaryPlotProps) {
  // Normalize scores to sum to 1.0 (just in case they don't)
  const total = mausig + atzig + fotzig;
  const m = total > 0 ? mausig / total : 1/3;
  const a = total > 0 ? atzig / total : 1/3;
  const f = total > 0 ? fotzig / total : 1/3;

  // SVG dimensions
  const width = 460;
  const height = 360;

  // Vertices of the triangle
  // Fotzig (Top)
  const xF = width / 2;
  const yF = 50;

  // Mausig (Bottom Left)
  const xM = 80;
  const yM = 300;

  // Atzig (Bottom Right)
  const xA = 380;
  const yA = 300;

  // Calculated coordinates of the user's point
  const px = m * xM + a * xA + f * xF;
  const py = m * yM + a * yA + f * yF;

  // Intermediate grid lines (e.g. 33% lines) to make it look like a matrix
  // Center point
  const cx = (xF + xM + xA) / 3;
  const cy = (yF + yM + yA) / 3;

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white border-4 border-black p-6 shadow-brutal relative overflow-visible">
      {/* Neo-brutalist header banner inside the card */}
      <div className="absolute -top-4 left-6 bg-neo-yellow border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-wider rotate-[-1deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        Holy Trinity Matrix
      </div>

      <div className="pt-2 flex justify-center items-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Defs for shadows and glows */}
          <defs>
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Pattern for fill of the triangle to make it super retro */}
            <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Helper Grid lines for depth */}
          <line x1={xF} y1={yF} x2={cx} y2={cy} stroke="#000" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
          <line x1={xM} y1={yM} x2={cx} y2={cy} stroke="#000" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />
          <line x1={xA} y1={yA} x2={cx} y2={cy} stroke="#000" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.3" />

          {/* Concentric grid triangles for matrix details */}
          {[0.25, 0.5, 0.75].map((scale, i) => {
            const txF = cx + (xF - cx) * scale;
            const tyF = cy + (yF - cy) * scale;
            const txM = cx + (xM - cx) * scale;
            const tyM = cy + (yM - cy) * scale;
            const txA = cx + (xA - cx) * scale;
            const tyA = cy + (yA - cy) * scale;
            return (
              <polygon
                key={i}
                points={`${txF},${tyF} ${txA},${tyA} ${txM},${tyM}`}
                fill="none"
                stroke="#000000"
                strokeWidth="1.5"
                strokeDasharray="2 4"
                opacity="0.25"
              />
            );
          })}

          {/* Main Triangle — shadow polygon for html2canvas compatibility */}
          <polygon
            points={`${xF + 4},${yF + 4} ${xA + 4},${yA + 4} ${xM + 4},${yM + 4}`}
            fill="#000000"
            stroke="none"
          />
          <polygon
            points={`${xF},${yF} ${xA},${yA} ${xM},${yM}`}
            fill="#FAF6EE"
            stroke="#000000"
            strokeWidth="4"
          />

          {/* Inside areas indicators (subtle labels) - Removed per user request */}

          {/* Pull Vector Lines from Cursor to Vertices (Spider-web radar charts style) */}
          <line x1={px} y1={py} x2={xF} y2={yF} stroke="#000000" strokeWidth="2.5" strokeDasharray="3 4" opacity="0.65" />
          <line x1={px} y1={py} x2={xM} y2={yM} stroke="#000000" strokeWidth="2.5" strokeDasharray="3 4" opacity="0.65" />
          <line x1={px} y1={py} x2={xA} y2={yA} stroke="#000000" strokeWidth="2.5" strokeDasharray="3 4" opacity="0.65" />

          {/* Glowing user position path */}
          <g>
            {/* Outer animated target rings */}
            <motion.circle
              cx={px}
              cy={py}
              r="22"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.circle
              cx={px}
              cy={py}
              r="14"
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Glowing neon marker center */}
            <motion.circle
              cx={px}
              cy={py}
              r="8"
              fill="#FF007F"
              stroke="#000000"
              strokeWidth="3.5"
              className="shadow-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
            />

            {/* User tag tooltip */}
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              {/* Tooltip Background */}
              <rect
                x={px - 45}
                y={py - 38}
                width="90"
                height="22"
                rx="0"
                fill="#FFEE00"
                stroke="#000000"
                strokeWidth="2.5"
                className="drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              />
              {/* Tooltip text */}
              <text
                x={px}
                y={py - 24}
                textAnchor="middle"
                fontSize="10"
                fontWeight="900"
                fill="#000000"
                className="font-sans uppercase"
              >
                {userName.substring(0, 12)}
              </text>
            </motion.g>
          </g>

          {/* Labels & Anchors */}
          {/* FOTZIG (Top Node) */}
          <g transform={`translate(${xF}, ${yF - 28})`}>
            <rect
              x="-60"
              y="-12"
              width="120"
              height="28"
              fill="#8A2BE2"
              stroke="#000000"
              strokeWidth="3"
              className="drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            />
            <text
              x="0"
              y="7"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#ffffff"
              className="font-sans uppercase tracking-widest"
            >
              FOTZIG ({Math.round(f * 100)}%)
            </text>
          </g>

          {/* MAUSIG (Bottom Left Node) */}
          <g transform={`translate(${xM - 20}, ${yM + 25})`}>
            <rect
              x="-60"
              y="-12"
              width="120"
              height="28"
              fill="#FF69B4"
              stroke="#000000"
              strokeWidth="3"
              className="drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            />
            <text
              x="0"
              y="7"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#000000"
              className="font-sans uppercase tracking-widest"
            >
              MAUSIG ({Math.round(m * 100)}%)
            </text>
          </g>

          {/* ATZIG (Bottom Right Node) */}
          <g transform={`translate(${xA + 20}, ${yA + 25})`}>
            <rect
              x="-60"
              y="-12"
              width="120"
              height="28"
              fill="#39FF14"
              stroke="#000000"
              strokeWidth="3"
              className="drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            />
            <text
              x="0"
              y="7"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#000000"
              className="font-sans uppercase tracking-widest"
            >
              ATZIG ({Math.round(a * 100)}%)
            </text>
          </g>
        </svg>
      </div>

      {/* Tiny descriptive legend at the bottom */}
      <div className="mt-6 border-t-2 border-black pt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold leading-tight">
        <div className="flex flex-col items-center">
          <span className="w-3 h-3 bg-neo-purple border border-black mb-1"></span>
          <span>Fotzig: Sassy Boss</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-3 h-3 bg-neo-pink border border-black mb-1"></span>
          <span>Mausig: Soft Cutie</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="w-3 h-3 bg-neo-lime border border-black mb-1"></span>
          <span>Atzig: Wild Party</span>
        </div>
      </div>
    </div>
  );
});
