import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MeditationStep } from './types';
import { MEDITATION_STEPS as DEFAULT_MEDITATION_STEPS, BELL_SOUND_B64 } from './constants';
import Timer from './components/Timer';
import StepListItem from './components/StepListItem';
import Controls from './components/Controls';
import HomeScreen from './components/HomeScreen';

const getStepEnabled = (step: MeditationStep): boolean => step.enabled ?? true;

const App: React.FC = () => {
  const [appState, setAppState] = useState<'home' | 'practice'>('home');

  const [steps, setSteps] = useState<MeditationStep[]>(() => {
    try {
      const savedSteps = localStorage.getItem('meditation-steps');
      const parsed = savedSteps ? (JSON.parse(savedSteps) as MeditationStep[]) : DEFAULT_MEDITATION_STEPS;
      // Back-compat: old saved data won't have `enabled`
      return parsed.map((s) => ({ ...s, enabled: getStepEnabled(s) }));
    } catch {
      return DEFAULT_MEDITATION_STEPS.map((s) => ({ ...s, enabled: getStepEnabled(s) }));
    }
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0]?.duration ?? 0);
  const [isActive, setIsActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  // Only steps whose timer ran to zero — manual navigation does NOT mark steps complete
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement>(null);
  // FIX: In browser environments, setInterval returns a number, not a NodeJS.Timeout object.
  const intervalRef = useRef<number | null>(null);

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
        if (index === currentStepIndex && !isActive) {
            setTimeLeft(newDurationInSeconds);
        }
        return updatedSteps;
    });
  }, [currentStepIndex, isActive]);

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
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSelectStartStep = useCallback((index: number) => {
    if (!steps[index]) return;

    setCurrentStepIndex(index);
    setTimeLeft(steps[index].duration);
    // Un-complete any steps from this index onward (user is re-doing them)
    setCompletedSteps(prev => {
      const next = new Set(prev);
      for (let i = index; i < steps.length; i++) next.delete(i);
      return next;
    });
    if (isActive) {
      setIsActive(false);
    }
  }, [isActive, steps]);

  useEffect(() => {
    if (isActive && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 1) {
            return prevTime - 1;
          }
          
          const nextIndex = currentStepIndex + 1;
          // Mark this step as naturally completed
          setCompletedSteps(prev => new Set(prev).add(currentStepIndex));

          if (nextIndex < steps.length) {
            // Single bell for a regular step transition
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => console.error("Bell error:", e));
            }
            setCurrentStepIndex(nextIndex);
            setTimeout(() => speak(steps[nextIndex].name), 400);
            return steps[nextIndex].duration;
          }

          // Triple bell for end-of-practice
          playBellTimes(3, 1400);
          setCurrentStepIndex(steps.length);
          setIsActive(false);
          setTimeout(() => speak("Practice Complete"), 5000); // after bells finish
          return 0;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentStepIndex, isCompleted, speak, steps, playBellTimes]);
  
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleStartPause = useCallback(() => {
    if (isCompleted) return;
    if (!hasAnySteps) return;
    if (!isStarted) {
      setIsStarted(true);
      const startIdx = currentStepIndex < steps.length ? currentStepIndex : 0;
      setCurrentStepIndex(startIdx);
      setTimeLeft(steps[startIdx].duration);
      speak(steps[startIdx].name);
    }
    if (isActive) {
      window.speechSynthesis.cancel();
    }
    setIsActive(prev => !prev);
  }, [currentStepIndex, hasAnySteps, isCompleted, isStarted, isActive, speak, steps]);

  const handleReset = useCallback(() => {
    window.speechSynthesis.cancel();
    if (isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
    if (isCompleted) return;
    if (currentStepIndex <= 0) return;
    const prevIndex = currentStepIndex - 1;
    setCurrentStepIndex(prevIndex);
    setTimeLeft(steps[prevIndex].duration);
    speak(steps[prevIndex].name);
    setIsActive(true);
  }, [currentStepIndex, isCompleted, speak, steps]);

  const handleBeginPractice = () => {
    setAppState('practice');
  };

  if (appState === 'home') {
    return <HomeScreen onBegin={handleBeginPractice} />;
  }

  const completionMessage = (
    <div className="text-center h-80 md:h-96 flex flex-col items-center justify-center">
      <p className="font-cormorant text-4xl mb-3 animate-diya-flicker" style={{ color: '#FFD700' }}>ॐ</p>
      <h2 className="font-cinzel text-3xl font-semibold tracking-widest"
          style={{ color: '#FBBF24', textShadow: '0 0 20px rgba(251,191,36,0.5)' }}>
        Practice Complete
      </h2>
      <p className="font-cormorant text-lg italic mt-3" style={{ color: 'rgba(251,191,36,0.55)' }}>
        Well done. Remain in the stillness.
      </p>
    </div>
  );

  return (
    <div
      className="text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 animate-breathing-bg animate-fade-in"
      style={{ backgroundColor: '#0D0520', fontFamily: "'Cormorant Garamond', serif" }}
    >
      <main className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">

        <div className="flex flex-col items-center">
          {isCompleted ? completionMessage : (
            <Timer
              timeLeft={timeLeft}
              totalDuration={totalDuration}
              stepName={currentStep?.name ?? 'No steps selected'}
              stepDescription={currentStep?.description ?? 'Select at least one step to begin.'}
            />
          )}
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

        <div className="w-full max-w-md lg:max-w-sm">
          {/* Section header with ornate divider */}
          <div className="flex items-center mb-5">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(184,134,11,0.5))' }} />
            <h3 className="font-cinzel text-sm font-semibold tracking-widest mx-4 text-center"
                style={{ color: 'rgba(251,191,36,0.75)' }}>
              MEDITATION SEQUENCE
            </h3>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(184,134,11,0.5))' }} />
          </div>

          <ul className="space-y-3">
            {steps.map((step, index) => (
              <StepListItem
                key={`${step.name}-${index}`}
                index={index}
                name={step.name}
                duration={step.duration}
                canSelect={true}
                isActive={!isCompleted && index === currentStepIndex}
                isCompleted={completedSteps.has(index)}
                onUpdateDuration={handleUpdateStepDuration}
                onSelect={handleSelectStartStep}
              />
            ))}
          </ul>

          <div className="mt-4 text-center lg:text-left">
            <p className="font-cormorant text-xs italic" style={{ color: 'rgba(184,134,11,0.5)' }}>
              <span className="not-italic" style={{ color: 'rgba(184,134,11,0.7)' }}>Tip:</span>{' '}
              Click a step to start from there. Click the pencil icon to customise durations.
            </p>
          </div>
        </div>
      </main>

      <audio ref={audioRef} src={BELL_SOUND_B64} preload="auto" />

      <footer className="mt-8 text-center font-cormorant text-sm tracking-widest"
              style={{ color: 'rgba(184,134,11,0.4)' }}>
        <p>ॐ Shambhavi Mahamudra Kriya Timer ॐ</p>
      </footer>
    </div>
  );
};

export default App;
