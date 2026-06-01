import { ResultProfile } from '../types/quiz';

/**
 * Renders the share poster directly onto a <canvas> element.
 * This approach works on EVERY browser (including Safari iOS) because
 * it doesn't rely on html2canvas or hidden DOM elements.
 * Instead, we draw everything pixel-by-pixel using the Canvas 2D API.
 */
export function renderPoster(profile: ResultProfile): string {
  const W = 1080;
  const H = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background ──
  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, W, H);

  // ── Decorative shapes ──
  // Pink square (top-left, rotated)
  ctx.save();
  ctx.translate(80, 120);
  ctx.rotate(15 * Math.PI / 180);
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(-60, -60, 120, 120);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.strokeRect(-60, -60, 120, 120);
  ctx.restore();

  // Lime circle (bottom-right)
  ctx.save();
  ctx.translate(W - 120, H - 300);
  ctx.fillStyle = '#39FF14';
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // Blue square (right side)
  ctx.save();
  ctx.translate(W - 60, H * 0.25);
  ctx.rotate(45 * Math.PI / 180);
  ctx.fillStyle = '#00BFFF';
  ctx.fillRect(-70, -70, 140, 140);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.strokeRect(-70, -70, 140, 140);
  ctx.restore();

  // ── Title ──
  ctx.fillStyle = '#000';
  ctx.font = '900 82px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIE MATRIX-AURA', W / 2, 220);

  // ── Name badge ──
  const nameText = profile.name.toUpperCase();
  ctx.font = '900 38px monospace';
  const nameWidth = ctx.measureText(nameText).width + 60;
  const nameX = (W - nameWidth) / 2;
  const nameY = 260;

  // Shadow
  ctx.fillStyle = '#FF69B4';
  ctx.fillRect(nameX + 8, nameY + 8, nameWidth, 60);
  // Box
  ctx.fillStyle = '#000';
  ctx.fillRect(nameX, nameY, nameWidth, 60);
  // Text
  ctx.fillStyle = '#FFF';
  ctx.textAlign = 'center';
  ctx.fillText(nameText, W / 2, nameY + 43);

  // ── Ternary Plot (Triangle) ──
  const total = profile.scores.mausig + profile.scores.atzig + profile.scores.fotzig;
  const m = total > 0 ? profile.scores.mausig / total : 1/3;
  const a = total > 0 ? profile.scores.atzig / total : 1/3;
  const f = total > 0 ? profile.scores.fotzig / total : 1/3;

  // Triangle vertices (centered in the middle area)
  const triCX = W / 2;
  const triTop = 420;
  const triBot = 920;
  const triHalfW = 300;

  const xF = triCX;          // Fotzig = top
  const yF = triTop;
  const xM = triCX - triHalfW; // Mausig = bottom-left
  const yM = triBot;
  const xA = triCX + triHalfW; // Atzig = bottom-right
  const yA = triBot;

  // Shadow triangle
  ctx.beginPath();
  ctx.moveTo(xF + 6, yF + 6);
  ctx.lineTo(xA + 6, yA + 6);
  ctx.lineTo(xM + 6, yM + 6);
  ctx.closePath();
  ctx.fillStyle = '#000';
  ctx.fill();

  // Main triangle
  ctx.beginPath();
  ctx.moveTo(xF, yF);
  ctx.lineTo(xA, yA);
  ctx.lineTo(xM, yM);
  ctx.closePath();
  ctx.fillStyle = '#FAF6EE';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Grid lines (center + concentric triangles)
  const cx = (xF + xM + xA) / 3;
  const cy = (yF + yM + yA) / 3;

  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';

  // Lines from vertices to center
  [{ x: xF, y: yF }, { x: xM, y: yM }, { x: xA, y: yA }].forEach(v => {
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(cx, cy);
    ctx.stroke();
  });

  // Concentric triangles
  [0.25, 0.5, 0.75].forEach(scale => {
    const txF = cx + (xF - cx) * scale;
    const tyF = cy + (yF - cy) * scale;
    const txM = cx + (xM - cx) * scale;
    const tyM = cy + (yM - cy) * scale;
    const txA = cx + (xA - cx) * scale;
    const tyA = cy + (yA - cy) * scale;
    ctx.beginPath();
    ctx.moveTo(txF, tyF);
    ctx.lineTo(txA, tyA);
    ctx.lineTo(txM, tyM);
    ctx.closePath();
    ctx.stroke();
  });

  ctx.setLineDash([]);

  // User dot position
  const px = m * xM + a * xA + f * xF;
  const py = m * yM + a * yA + f * yF;

  // Dashed lines from dot to vertices
  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  [{ x: xF, y: yF }, { x: xM, y: yM }, { x: xA, y: yA }].forEach(v => {
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(v.x, v.y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Outer ring
  ctx.beginPath();
  ctx.arc(px, py, 20, 0, Math.PI * 2);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner dot
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#FF007F';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.stroke();

  // User name tooltip
  ctx.font = '900 14px system-ui, sans-serif';
  const tooltipText = profile.name.substring(0, 12).toUpperCase();
  const tooltipW = ctx.measureText(tooltipText).width + 24;
  // Shadow
  ctx.fillStyle = '#000';
  ctx.fillRect(px - tooltipW / 2 + 3, py - 42 + 3, tooltipW, 26);
  // Box
  ctx.fillStyle = '#FFEE00';
  ctx.fillRect(px - tooltipW / 2, py - 42, tooltipW, 26);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeRect(px - tooltipW / 2, py - 42, tooltipW, 26);
  // Text
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText(tooltipText, px, py - 23);

  // ── Vertex labels ──
  const drawLabel = (x: number, y: number, text: string, bgColor: string, textColor: string) => {
    ctx.font = '900 16px system-ui, sans-serif';
    const lw = ctx.measureText(text).width + 40;
    // Shadow
    ctx.fillStyle = '#000';
    ctx.fillRect(x - lw / 2 + 4, y - 14 + 4, lw, 32);
    // Box
    ctx.fillStyle = bgColor;
    ctx.fillRect(x - lw / 2, y - 14, lw, 32);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.strokeRect(x - lw / 2, y - 14, lw, 32);
    // Text
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y + 8);
  };

  drawLabel(xF, yF - 35, `FOTZIG (${Math.round(f * 100)}%)`, '#8A2BE2', '#FFF');
  drawLabel(xM - 20, yM + 35, `MAUSIG (${Math.round(m * 100)}%)`, '#FF69B4', '#000');
  drawLabel(xA + 20, yA + 35, `ATZIG (${Math.round(a * 100)}%)`, '#39FF14', '#000');

  // ── Legend ──
  const legendY = triBot + 80;
  const legends = [
    { color: '#8A2BE2', label: 'Fotzig: Sassy Boss' },
    { color: '#FF69B4', label: 'Mausig: Soft Cutie' },
    { color: '#39FF14', label: 'Atzig: Wild Party' },
  ];
  const legSpacing = W / 3;
  legends.forEach((leg, i) => {
    const lx = legSpacing * i + legSpacing / 2;
    ctx.fillStyle = leg.color;
    ctx.fillRect(lx - 8, legendY, 16, 16);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(lx - 8, legendY, 16, 16);
    ctx.fillStyle = '#000';
    ctx.font = '700 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(leg.label, lx, legendY + 38);
  });

  // ── Result Box ──
  const boxTop = 1100;
  const boxLeft = 80;
  const boxW = W - 160;
  const boxH = 500;

  // Shadow
  ctx.fillStyle = '#000';
  ctx.fillRect(boxLeft + 16, boxTop + 16, boxW, boxH);
  // Box
  ctx.fillStyle = '#FFF';
  ctx.fillRect(boxLeft, boxTop, boxW, boxH);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 10;
  ctx.strokeRect(boxLeft, boxTop, boxW, boxH);

  // Hauptvibe badge
  const archLabel = `HAUPTVIBE: ${profile.primaryArchetype.toUpperCase()}`;
  ctx.font = '900 32px system-ui, sans-serif';
  const badgeW = ctx.measureText(archLabel).width + 50;
  const badgeX = W / 2 - badgeW / 2;
  const badgeY = boxTop - 28;
  // Shadow
  ctx.fillStyle = '#000';
  ctx.fillRect(badgeX + 6, badgeY + 6, badgeW, 56);
  // Badge background
  const archBg = profile.primaryArchetype === 'mausig' ? '#FF69B4'
    : profile.primaryArchetype === 'atzig' ? '#39FF14'
    : '#8A2BE2';
  ctx.fillStyle = archBg;
  ctx.fillRect(badgeX, badgeY, badgeW, 56);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 6;
  ctx.strokeRect(badgeX, badgeY, badgeW, 56);
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText(archLabel, W / 2, badgeY + 40);

  // Title inside box
  ctx.fillStyle = '#000';
  ctx.font = '900 42px system-ui, sans-serif';
  ctx.textAlign = 'left';
  
  // Word-wrap the title
  const titleLines = wrapText(ctx, `🎯 „${profile.hybridTitle}"`, boxW - 80);
  let titleY = boxTop + 90;
  titleLines.forEach(line => {
    ctx.fillText(line, boxLeft + 40, titleY);
    titleY += 52;
  });

  // Description inside box (smaller font, remove HTML tags)
  ctx.font = '600 26px system-ui, sans-serif';
  ctx.fillStyle = '#333';
  const cleanDesc = profile.hybridDescription.replace(/<[^>]*>/g, '');
  const descLines = wrapText(ctx, cleanDesc, boxW - 80);
  let descY = titleY + 20;
  descLines.forEach(line => {
    if (descY < boxTop + boxH - 20) {
      ctx.fillText(line, boxLeft + 40, descY);
      descY += 34;
    }
  });

  // ── Footer ──
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.font = '900 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MACH DEN TEST AUF ATZIGFOTZIGMAUSIG.VERCEL.APP', W / 2, H - 80);

  return canvas.toDataURL('image/png', 1.0);
}

/** Helper: word-wrap text to fit within maxWidth */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}
