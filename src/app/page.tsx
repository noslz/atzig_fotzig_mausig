'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle, Activity, Award, User, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';

import questionsData from '../data/quiz-data.json';
import { Question, Answers, ResultProfile } from '../types/quiz';
import { calculateResults } from '../utils/personality';
import QuizQuestion from '../components/QuizQuestion';
import ResultCard from '../components/ResultCard';

const questions = questionsData as Question[];

const LOADING_MESSAGES = [
  'Verbinde mit dem Atzen-Netzwerk...',
  'Errechne deinen Arroganz-Quotienten...',
  'Scanne deinen Kleiderschrank nach Beige...',
  'Analysiere Instagram-Overthinking-Frequenzen...',
  'Messe Social-Battery Widerstand...',
  'Trinke einen virtuellen Aperol...',
  'Prüfe Excel-Tabellen-Affinität...',
  'Lade Maus-Koordinaten...',
  'Generiere deine Holy Trinity Matrix Aura...',
];

export default function Home() {
  // Application Screens: 'welcome' | 'quiz' | 'calculating' | 'result'
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'calculating' | 'result'>(() => {
    if (typeof window !== 'undefined') return (sessionStorage.getItem('ht_screen') as any) || 'welcome';
    return 'welcome';
  });
  
  // Quiz State
  const [name, setName] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('ht_name') || '';
    return '';
  });
  const [currentIdx, setCurrentIdx] = useState(() => {
    if (typeof window !== 'undefined') return Number(sessionStorage.getItem('ht_currentIdx')) || 0;
    return 0;
  });
  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('ht_answers');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [resultProfile, setResultProfile] = useState<ResultProfile | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Form validation
  const isNameValid = name.trim().length >= 2;

  // Sync state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ht_name', name);
      sessionStorage.setItem('ht_currentIdx', String(currentIdx));
      sessionStorage.setItem('ht_answers', JSON.stringify(answers));
      // Don't save 'calculating' or 'result', fallback to 'quiz' if they reload
      sessionStorage.setItem('ht_screen', (screen === 'calculating' || screen === 'result') ? 'quiz' : screen);
    }
  }, [name, currentIdx, answers, screen]);

  // Use refs to prevent calculateResults useEffect from re-triggering mid-calculation
  const nameRef = useRef(name);
  const answersRef = useRef(answers);
  useEffect(() => {
    nameRef.current = name;
    answersRef.current = answers;
  }, [name, answers]);

  // Handles loading messages carousel during calculations
  useEffect(() => {
    if (screen !== 'calculating') return;

    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 450);

    const timer = setTimeout(() => {
      // Complete calculations using refs (safe from mid-calc state updates)
      const profile = calculateResults(nameRef.current.trim(), answersRef.current);
      setResultProfile(profile);
      setScreen('result');
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [screen]);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid) return;
    setScreen('quiz');
    setCurrentIdx(0);
    setAnswers({});
  };

  const handleAnswerSelect = (rating: number) => {
    const questionId = questions[currentIdx].id;
    const updatedAnswers = { ...answers, [questionId]: rating };
    setAnswers(updatedAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Start calculating screen
      setScreen('calculating');
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleRestart = () => {
    setName('');
    setAnswers({});
    setCurrentIdx(0);
    setResultProfile(null);
    setScreen('welcome');
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  };

  const handleExport = async () => {
    const element = document.getElementById('share-card');
    if (!element) return;
    
    setIsExporting(true);
    
    // Save original styles to restore after capture
    const originalStyle = element.getAttribute('style') || '';
    
    // Move card off-screen at desktop width for consistent high-quality export
    // This prevents the jarring layout flash visible on mobile devices
    element.style.cssText = 'width:880px;min-width:880px;position:absolute;left:-9999px;top:0;';
    
    // Allow layout reflow (400ms for older devices)
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(element, {
          scale: 2.5, // Ultra high quality
          useCORS: true,
          backgroundColor: '#FAF6EE',
          logging: false,
          windowWidth: 1200,
        });
        
        const image = canvas.toDataURL('image/png', 1.0);
        
        // Convert to Blob for Web Share API
        const response = await fetch(image);
        const blob = await response.blob();
        const filename = `${name.toLowerCase().replace(/\s+/g, '_')}-holy-trinity-matrix.png`;
        const file = new File([blob], filename, { type: 'image/png' });
        
        // Try native Web Share API first (great for mobile)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Meine Holy Trinity Matrix',
              text: 'Ich hab den Vibe-Check gemacht! Bist du atzig, mausig oder fotzig?',
              files: [file]
            });
          } catch (shareErr: any) {
            // Ignore abort errors (user cancelled share)
            if (shareErr.name !== 'AbortError') {
              throw shareErr;
            }
          }
        } else {
          // Fallback: Download file
          const link = document.createElement('a');
          link.download = filename;
          link.href = image;
          link.click();
        }
      } catch (err) {
        console.error('Error generating result image:', err);
      } finally {
        // Restore original styles — card returns to normal position
        element.setAttribute('style', originalStyle);
        setIsExporting(false);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen relative w-full px-4 py-8 md:py-16 justify-center items-center overflow-x-hidden">
      
      {/* Neo-Brutalist Ambient Floating Background Items */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-neo-pink border-4 border-black rotate-[12deg] shadow-brutal pointer-events-none hidden lg:block animate-float-slow"></div>
      <div className="absolute bottom-16 right-12 w-20 h-20 bg-neo-lime border-4 border-black rounded-none -rotate-[15deg] shadow-brutal pointer-events-none hidden lg:block animate-float-medium"></div>
      <div className="absolute top-1/4 right-20 w-14 h-14 bg-neo-blue border-4 border-black rotate-[8deg] shadow-brutal pointer-events-none hidden lg:block animate-float-medium"></div>
      <div className="absolute bottom-1/4 left-16 w-16 h-16 bg-neo-orange border-4 border-black rotate-[-10deg] shadow-brutal pointer-events-none hidden lg:block animate-float-slow"></div>

      <main className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {/* SCREEN 1: WELCOME SCREEN */}
          {screen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}
              className="w-full max-w-xl text-center flex flex-col gap-8"
            >
              {/* Title Section */}
              <div className="flex flex-col items-center">
                
                <h1 className="text-4xl md:text-6xl font-black uppercase text-black leading-none select-none tracking-tight">
                  Die Holy Trinity Matrix
                </h1>
                
                <p className="mt-6 text-base md:text-lg font-bold text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Bist du{' '}
                  <span className="bg-neo-lime px-1.5 border-2 border-black font-black uppercase text-xs rotate-[-1deg] inline-block mr-1 select-none">
                    atzig 🤪
                  </span>
                  ,{' '}
                  <span className="bg-neo-pink px-1.5 border-2 border-black font-black uppercase text-xs rotate-[2deg] inline-block mr-1 select-none">
                    mausig 🐀
                  </span>{' '}
                  oder{' '}
                  <span className="bg-neo-purple text-white px-1.5 border-2 border-black font-black uppercase text-xs rotate-[-2deg] inline-block mr-1.5 select-none">
                    fotzig 💅
                  </span>
                  ?
                  <br />
                  Mach den 20-Fragen-Vibecheck und finde deinen Typ heraus!
                </p>
              </div>

              {/* Start Quiz Form Card */}
              <form onSubmit={handleStartQuiz} className="neo-card p-6 md:p-8 bg-white flex flex-col gap-6 text-left">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name-input" className="font-mono font-black text-sm uppercase tracking-wider text-black flex items-center gap-2">
                    <User size={16} />
                    Gib deinen Vor- oder Spitznamen ein:
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z.B. Max, Noah oder falscher Füffi"
                    className="neo-input w-full text-black placeholder-neutral-400"
                    maxLength={20}
                  />
                  <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">
                    Wird auf deinem sharebaren Ergebnis-Bild abgebildet!
                  </span>
                </div>

                <motion.button
                  type="submit"
                  disabled={!isNameValid}
                  whileHover={isNameValid ? { scale: 1.03 } : {}}
                  whileTap={isNameValid ? { scale: 0.97 } : {}}
                  className={`neo-btn py-4 w-full text-lg uppercase flex items-center justify-center gap-2 transition-all ${
                    isNameValid 
                      ? 'bg-neo-lime text-black hover:bg-[#2eff05] cursor-pointer' 
                      : 'bg-neutral-200 text-neutral-400 border-neutral-300 shadow-none pointer-events-none'
                  }`}
                  style={{
                    boxShadow: isNameValid ? '4px 4px 0px 0px rgba(0,0,0,1)' : 'none',
                    borderWidth: '4px'
                  }}
                  id="start-quiz-btn"
                >
                  LET'S GO!
                  <Activity size={20} className="animate-pulse" />
                </motion.button>
              </form>

              {/* Quality Seal */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-black text-neutral-500 uppercase">
                <HelpCircle size={14} />
                100% Client-Side • Keine Datenspeicherung
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: ACTIVE QUIZ SCREEN */}
          {screen === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <QuizQuestion
                question={questions[currentIdx]}
                currentIndex={currentIdx}
                totalQuestions={questions.length}
                selectedValue={answers[questions[currentIdx].id]}
                onSelect={handleAnswerSelect}
                onBack={handleBack}
                canGoBack={currentIdx > 0}
              />
            </motion.div>
          )}

          {/* SCREEN 3: CALCULATING / LOADING SCREEN */}
          {screen === 'calculating' && (
            <motion.div
              key="calculating"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md text-center flex flex-col gap-6 py-12"
            >
              <div className="neo-card bg-white p-8 md:p-12 flex flex-col items-center gap-6 justify-center">
                {/* Custom Big Spinner */}
                <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                  {/* Background pulse */}
                  <motion.div 
                    className="absolute inset-2 rounded-full bg-neo-lime opacity-20"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                  {/* Outer Ring */}
                  <motion.div 
                    className="absolute w-full h-full rounded-full border-[3px] border-dashed border-black/20"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  />
                  {/* Inner Colored Ring */}
                  <motion.div 
                    className="absolute w-24 h-24 rounded-full border-8 border-black border-t-neo-lime border-r-neo-pink border-b-neo-purple border-l-neo-orange shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  />
                  {/* Center Icon */}
                  <div className="absolute z-10 bg-black text-white p-2.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                    <Sparkles size={24} className="text-neo-yellow" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-black uppercase text-black">
                    Berechne Matrix...
                  </h3>
                  <div className="h-10 flex items-center justify-center">
                    <motion.p 
                      key={loadingMsg}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-mono text-sm font-black text-neo-purple uppercase tracking-wider"
                    >
                      {loadingMsg}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 4: RESULTS SCREEN */}
          {screen === 'result' && resultProfile && (
            <motion.div
              key="result"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="w-full"
            >
              <ResultCard
                profile={resultProfile}
                onRestart={handleRestart}
                onExport={handleExport}
                isExporting={isExporting}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

    </div>
  );
}
