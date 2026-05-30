'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedValue?: number;
  onSelect: (rating: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

const LIKERT_OPTIONS = [
  { value: 1, emoji: '💅', label: 'Gar nicht ich', color: 'bg-neo-pink text-black' },
  { value: 2, emoji: '🙄', label: 'Eher weniger', color: 'bg-[#ffc6ff] text-black' },
  { value: 3, emoji: '😐', label: 'Schon neutral', color: 'bg-neo-cream text-black' },
  { value: 4, emoji: '😏', label: 'Schon sehr', color: 'bg-[#98f5e1] text-black' },
  { value: 5, emoji: '🤪', label: 'Absolut ich', color: 'bg-neo-lime text-black' },
];

const MOTIVATORS = [
  'Vibe-Check startet... 🔍',
  'Mal gucken wie mausig du bist... 🐀',
  'Die Atzen-Maus-Analyse läuft... ⚡',
  'Bisher sehr stabiles Auftreten! 💅',
  'Deine Aura stabilisiert sich... 🔮',
  'Deepes Zeug, ehrlich... 🧠',
  'Schwierige Frage, fühl rein... 🤔',
  'Mause-Energie steigt... 📈',
  'Atzen-Pegel wird gemessen... 🧪',
  'Halbzeit! Du ziehst gut durch 🏆',
  'Müsli oder Schampus? 🥣🥂',
  'Folgst du der inneren Boss-Bitch? 🕶️',
  'Social Battery wird berechnet... 🔋',
  'Keine Lügen jetzt, BeReal style! 📸',
  'Overthinking-Spitze erkannt... 📈',
  'Fast geschafft, bleib fokussiert! 🔥',
  'Bist du die Endgegner-Maus? 👾',
  'Fühle diese Antwort hart... 🤝',
  'Letzte Meter, zieh durch! 🏁',
  'Das große Finale... 🎬',
];

export default React.memo(function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  selectedValue,
  onSelect,
  onBack,
  canGoBack,
}: QuizQuestionProps) {
  const progressPercent = (currentIndex / totalQuestions) * 100;

  const getMotivatorText = (idx: number) => {
    return MOTIVATORS[idx] || 'Vibe-Check läuft... 🔮';
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3 sm:gap-6">
      {/* Brutalist Progress Section */}
      <div className="w-full border-4 border-black bg-white p-3 sm:p-4 shadow-brutal flex flex-col gap-2 relative overflow-hidden">
        <div className="flex justify-between items-center font-mono font-black text-xs md:text-sm uppercase">
          <span className="flex items-center gap-1.5 text-black">
            <Sparkles size={16} className="text-neo-orange animate-spin shrink-0" style={{ animationDuration: '6s' }} />
            <span className="truncate max-w-[200px] sm:max-w-xs">{getMotivatorText(currentIndex)}</span>
          </span>
          <span className="bg-black text-white px-2 py-0.5 text-xs shrink-0">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        
        {/* Giant chunky progress tube */}
        <div className="w-full h-6 sm:h-8 bg-[#FAF6EE] border-4 border-black rounded-none relative overflow-hidden flex items-center">
          <motion.div
            className="h-full bg-neo-orange border-r-4 border-black"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", damping: 15, stiffness: 80 }}
          />
          {/* Subtle percentage overlay */}
          <span className="absolute left-1/2 -translate-x-1/2 font-mono font-black text-xs mix-blend-difference text-white">
            {Math.round(progressPercent)}% geladen
          </span>
        </div>
      </div>

      {/* Main Question Card with sliding transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
          className="neo-card p-5 sm:p-8 md:p-10 bg-white relative"
        >
          <p className="text-[17px] sm:text-xl md:text-2xl font-black leading-snug text-black select-none">
            „{question.text}“
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Last Question Warning */}
      {currentIndex === totalQuestions - 1 && (
        <div className="bg-neo-yellow border-2 border-black py-2 px-4 text-center font-mono font-black text-xs uppercase animate-pulse">
          Letzte Frage! Deine Antwort startet die Auswertung.
        </div>
      )}

      {/* Answer Likert Scale Grid */}
      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-5 mt-1 sm:mt-2">
        {LIKERT_OPTIONS.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96, y: 2 }}
              className={`neo-card flex md:flex-col items-center justify-between md:justify-center p-2.5 px-4 sm:p-4 gap-2 text-left md:text-center transition-all cursor-pointer ${
                isSelected 
                  ? `${opt.color} translate-x-1 translate-y-1 shadow-none` 
                  : 'bg-white hover:bg-neutral-50 shadow-brutal'
              }`}
              style={{
                boxShadow: isSelected ? 'none' : '4px 4px 0px 0px rgba(0,0,0,1)',
                borderWidth: '4px'
              }}
              id={`likert-btn-${question.id}-${opt.value}`}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none">
                {opt.emoji}
              </div>
              <div className="flex flex-col md:items-center">
                <span className="font-mono font-black text-[10px] sm:text-xs text-neutral-500 uppercase leading-none">
                  Punkt {opt.value}
                </span>
                <span className="font-black text-[11px] sm:text-xs md:text-sm uppercase text-black leading-tight">
                  {opt.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-2 sm:mt-4">
        {canGoBack ? (
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neo-btn px-4 py-2 text-sm bg-white flex items-center gap-2"
            id="back-btn"
          >
            <ArrowLeft size={16} />
            Zurück
          </motion.button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
});
