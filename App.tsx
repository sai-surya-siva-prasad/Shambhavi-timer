import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MeditationStep } from './types';
import { MEDITATION_STEPS as DEFAULT_MEDITATION_STEPS, BELL_SOUND_B64 } from './constants';
import Timer from './components/Timer';
import StepListItem from './components/StepListItem';
import Controls from './components/Controls';
import HomeScreen from './components/HomeScreen';
import EditStepModal from './components/EditStepModal';

const getStepEnabled = (step: MeditationStep): boolean => step.enabled ?? true;

const App: React.FC = () => {
  const [appState, setAppState] = useState<'home' | 'practice'>('home');

  const [steps, setSteps] = useState<MeditationStep[]>(() => {
    try {
      const savedSteps = localStorage.getItem('meditation-steps');
      const parsed = savedSteps ? (JSON.parse(savedSteps) as MeditationStep[]) : DEFAULT_MEDITATION_STEPS;
      return parsed.map((s) => ({ ...s, enabled: getStepEnabled(s) }));
    } catch {
      return DEFAULT_MEDITATION_STEPS.map((s) => ({ ...s, enabled: getStepEnabled(s) }));
    }
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0]?.duration ?? 0);
  const [isActive, setIsActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(
    () => localStorage.getItem('voice-enabled') !== 'false'
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<number | null>(null);
  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      const next = !prev;
      localStorage.setItem('voice-enabled', String(next));
      if (!next) window.speechSynthesis.cancel();
      return next;
    });
  }, []);

  const totalDuration = steps[currentStepIndex]?.duration || 0;
  const currentStep = steps[currentStepIndex];
  const isCompleted = currentStepIndex >= steps.length;
  const hasAnySteps = steps.length > 0;

  useEffect(() => {
    localStorage.setItem('meditation-steps', JSON.stringify(steps));
  }, [steps]);

  const handleUpdateStepDuration = useCallback((index: number, newDurationInSeconds: number) => {
    setSteps(currentSteps => {
      const updatedSteps = [...currentSteps];
      updatedSteps[index] = { ...updatedSteps[index], duration: newDurationInSeconds };
      if (index === currentStepIndex) {
        setTimeLeft(prev => Math.min(prev, newDurationInSeconds));
      }
      return updatedSteps;
    });
  }, [currentStepIndex, isActive]);

  const handleEditStep = useCallback((index: number) => {
    setEditingStepIndex(index);
  }, []);

  const handleEditSave = useCallback((newDurationInSeconds: number) => {
    if (editingStepIndex !== null) {
      handleUpdateStepDuration(editingStepIndex, newDurationInSeconds);
    }
    setEditingStepIndex(null);
  }, [editingStepIndex, handleUpdateStepDuration]);

  const handleEditClose = useCallback(() => {
    setEditingStepIndex(null);
  }, []);

  /** Play the bell sound `count` times, `gapMs` apart. */
  const playBellTimes = useCallback((count: number, gapMs = 1400) => {
    const ring = (remaining: number) => {
      if (remaining <= 0 || !audioRef.current) return;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error('Bell error:', e));
      if (remaining > 1) {
        setTimeout(() => ring(remaining - 1), gapMs);
      }
    };
    ring(count);
  }, []);

  const speak = useCallback((text: string) => {
    if (!voiceEnabledRef.current) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    // Try to find an Indian English female voice
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const indianFemale =
          voices.find(v => v.lang === 'en-IN' && /female|woman|girl/i.test(v.name)) ||
          voices.find(v => v.name === 'Lekha') ||
          voices.find(v => v.name === 'Veena') ||
          voices.find(v => v.lang === 'en-IN');
        if (indianFemale) utterance.voice = indianFemale;
      }
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      // Voices not yet loaded — wait for event (fires at most once)
      const onVoicesChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        trySpeak();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    } else {
      trySpeak();
    }
  }, []);

  const handleSelectStartStep = useCallback((index: number) => {
    if (!steps[index]) return;
    setCurrentStepIndex(index);
    setTimeLeft(steps[index].duration);
    setCompletedSteps(prev => {
      const next = new Set(prev);
      for (let i = index; i < steps.length; i++) next.delete(i);
      return next;
    });
    if (isActive) setIsActive(false);
    // Always play bell; additionally speak step name when voice is on
    playBellTimes(1);
    if (voiceEnabledRef.current) {
      speak(steps[index].name);
    }
  }, [isActive, steps, speak, playBellTimes]);

  const handleResetToDefaults = useCallback(() => {
    setSteps(DEFAULT_MEDITATION_STEPS.map((s) => ({ ...s, enabled: getStepEnabled(s) })));
    setCurrentStepIndex(0);
    setTimeLeft(DEFAULT_MEDITATION_STEPS[0].duration);
    setIsActive(false);
    setCompletedSteps(new Set());
  }, []);

  useEffect(() => {
    if (isActive && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 1) return prevTime - 1;

          const nextIndex = currentStepIndex + 1;
          setCompletedSteps(prev => new Set(prev).add(currentStepIndex));

          if (nextIndex < steps.length) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => console.error("Bell error:", e));
            }
            setCurrentStepIndex(nextIndex);
            setTimeout(() => speak(steps[nextIndex].name), 400);
            return steps[nextIndex].duration;
          }

          playBellTimes(3, 1400);
          setCurrentStepIndex(steps.length);
          setIsActive(false);
          setTimeout(() => speak("Practice Complete"), 5000);
          return 0;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, currentStepIndex, isCompleted, speak, steps, playBellTimes]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleStartPause = useCallback(() => {
    if (isCompleted || !hasAnySteps) return;
    if (!isStarted) {
      setIsStarted(true);
      const startIdx = currentStepIndex < steps.length ? currentStepIndex : 0;
      setCurrentStepIndex(startIdx);
      setTimeLeft(steps[startIdx].duration);
      speak(steps[startIdx].name);
    }
    if (isActive) window.speechSynthesis.cancel();
    setIsActive(prev => !prev);
  }, [currentStepIndex, hasAnySteps, isCompleted, isStarted, isActive, speak, steps]);

  const handleReset = useCallback(() => {
    window.speechSynthesis.cancel();
    if (isCompleted) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentStepIndex(0);
      setTimeLeft(steps[0]?.duration ?? 0);
      setIsActive(false);
      setIsStarted(false);
      setCompletedSteps(new Set());
    } else {
      setTimeLeft(steps[currentStepIndex].duration);
      setIsActive(true);
      speak(steps[currentStepIndex].name);
    }
  }, [isCompleted, steps, currentStepIndex, speak]);

  const handleNextStep = useCallback(() => {
    if (isCompleted) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStepIndex(nextIndex);
      setTimeLeft(steps[nextIndex].duration);
      speak(steps[nextIndex].name);
      setIsActive(true);
    } else {
      setCurrentStepIndex(steps.length);
      setIsActive(false);
      setTimeLeft(0);
      speak("Practice Complete");
    }
  }, [currentStepIndex, isCompleted, speak, steps]);

  const handlePreviousStep = useCallback(() => {
    if (isCompleted || currentStepIndex <= 0) return;
    const prevIndex = currentStepIndex - 1;
    setCurrentStepIndex(prevIndex);
    setTimeLeft(steps[prevIndex].duration);
    speak(steps[prevIndex].name);
    setIsActive(true);
  }, [currentStepIndex, isCompleted, speak, steps]);

  if (appState === 'home') {
    return <HomeScreen onBegin={() => setAppState('practice')} />;
  }

  const completionMessage = (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: 'min(72vw, 300px)' }}
    >
      <h2
        className="font-cinzel text-2xl sm:text-3xl font-semibold tracking-widest mb-2"
        style={{ color: '#FBBF24', textShadow: '0 0 20px rgba(251,191,36,0.5)' }}
      >
        Practice Complete
      </h2>
      <p className="font-cormorant text-base italic" style={{ color: 'rgba(251,191,36,0.55)' }}>
        Remain in the stillness.
      </p>
    </div>
  );

  return (
    <div
      className="text-white animate-breathing-bg animate-fade-in"
      style={{
        backgroundColor: '#0D0520',
        fontFamily: "'Cormorant Garamond', serif",
        minHeight: '100vh',
        paddingBottom: 'env(safe-area-inset-bottom, 24px)',
      }}
    >
      {/* Edit popup */}
      {editingStepIndex !== null && steps[editingStepIndex] && (
        <EditStepModal
          stepName={steps[editingStepIndex].name}
          durationInSeconds={steps[editingStepIndex].duration}
          onSave={handleEditSave}
          onClose={handleEditClose}
        />
      )}

      <main
        className="w-full flex flex-col items-center gap-6 px-4 pt-6 pb-8"
        style={{ maxWidth: '480px', margin: '0 auto' }}
      >
        {/* Voice toggle */}
        <div className="w-full flex justify-end">
          <button
            onClick={toggleVoice}
            aria-label={voiceEnabled ? 'Turn off voice' : 'Turn on voice'}
            title={voiceEnabled ? 'Voice on' : 'Voice off'}
            className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all active:scale-95"
            style={{
              backgroundColor: voiceEnabled ? 'rgba(45,20,69,0.7)' : 'rgba(26,11,56,0.5)',
              border: `1px solid ${voiceEnabled ? 'rgba(218,165,32,0.4)' : 'rgba(100,60,150,0.35)'}`,
              color: voiceEnabled ? '#FBBF24' : 'rgba(184,134,11,0.35)',
            }}
          >
            {voiceEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
            <span className="font-cinzel text-xs tracking-widest">
              {voiceEnabled ? 'Voice' : 'Muted'}
            </span>
          </button>
        </div>

        {/* Timer or Completion */}
        <div className="flex flex-col items-center w-full">
          {isCompleted ? completionMessage : (
            <Timer
              timeLeft={timeLeft}
              totalDuration={totalDuration}
              stepName={currentStep?.name ?? ''}
            />
          )}

          {/* Controls directly below timer */}
          <div className="mt-5 w-full">
            <Controls
              isActive={isActive}
              isStarted={isStarted}
              onStartPause={handleStartPause}
              onReset={handleReset}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              hasAnySteps={hasAnySteps}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.4))' }} />
          <span className="font-cinzel text-xs tracking-widest" style={{ color: 'rgba(251,191,36,0.6)', whiteSpace: 'nowrap' }}>
            SEQUENCE
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(184,134,11,0.4))' }} />
        </div>

        {/* Reset to defaults */}
        <div className="w-full flex justify-end">
          <button
            onClick={handleResetToDefaults}
            className="font-cinzel text-xs tracking-widest px-3 py-1 rounded border"
            style={{
              color: 'rgba(251,191,36,0.7)',
              borderColor: 'rgba(184,134,11,0.35)',
              background: 'rgba(0,0,0,0.25)',
            }}
          >
            Reset to Defaults
          </button>
        </div>

        {/* Step list — full height, page scrolls */}
        <ul className="w-full space-y-2">
          {steps.map((step, index) => (
            <StepListItem
              key={`${step.name}-${index}`}
              index={index}
              name={step.name}
              duration={step.duration}
              canSelect={true}
              isActive={!isCompleted && index === currentStepIndex}
              isCompleted={completedSteps.has(index)}
              onEdit={handleEditStep}
              onSelect={handleSelectStartStep}
            />
          ))}
        </ul>
      </main>

      <audio ref={audioRef} src={BELL_SOUND_B64} preload="auto" />
    </div>
  );
};

export default App;
