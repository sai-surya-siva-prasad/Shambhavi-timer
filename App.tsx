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

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSelectStartStep = useCallback((index: number) => {
    if (!steps[index]) return;

    setCurrentStepIndex(index);
    setTimeLeft(steps[index].duration);
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
          
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Error playing sound:", e));
          }

          const nextIndex = currentStepIndex + 1;
          if (nextIndex < steps.length) {
            setCurrentStepIndex(nextIndex);
            setTimeout(() => speak(steps[nextIndex].name), 400);
            return steps[nextIndex].duration;
          }

          setCurrentStepIndex(steps.length);
          setIsActive(false);
          setTimeout(() => speak("Practice Complete"), 400);
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
  }, [isActive, currentStepIndex, isCompleted, speak, steps]);
  
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
        <h2 className="text-3xl font-bold text-cyan-300">Practice Complete</h2>
        <p className="text-gray-400 mt-2">Well done.</p>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-sans animate-breathing-bg animate-fade-in">
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
            <h3 className="text-xl font-semibold mb-4 text-gray-300 tracking-wide text-center lg:text-left">Meditation Sequence</h3>
            <ul className="space-y-3">
                {steps.map((step, index) => (
                    <StepListItem
                        key={`${step.name}-${index}`}
                        index={index}
                        name={step.name}
                        duration={step.duration}
                        canSelect={true}
                        isActive={!isCompleted && index === currentStepIndex}
                        isCompleted={index < currentStepIndex}
                        onUpdateDuration={handleUpdateStepDuration}
                        onSelect={handleSelectStartStep}
                    />
                ))}
            </ul>
             <div className="mt-4 text-center lg:text-left">
                <p className="text-xs text-gray-500">
                    <span className="font-bold text-gray-400">Tip:</span> Click a step to start from there. Click the pencil icon to customize durations.
                </p>
            </div>
        </div>
      </main>
      <audio ref={audioRef} src={BELL_SOUND_B64} preload="auto" />
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Shambhavi Mahamudra Kriya Timer</p>
      </footer>
    </div>
  );
};

export default App;
