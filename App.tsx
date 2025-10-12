import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MEDITATION_STEPS, BELL_SOUND_B64 } from './constants';
import Timer from './components/Timer';
import StepListItem from './components/StepListItem';
import Controls from './components/Controls';
import VolumeControl from './components/VolumeControl';

const App: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MEDITATION_STEPS[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const savedVolume = localStorage.getItem('meditation-volume');
      return savedVolume !== null ? JSON.parse(savedVolume) : 0.5;
    } catch {
      return 0.5;
    }
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = MEDITATION_STEPS[currentStepIndex]?.duration || 0;
  const currentStep = MEDITATION_STEPS[currentStepIndex];
  const isCompleted = currentStepIndex >= MEDITATION_STEPS.length;

  // Memoized speech function
  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Effect for the main timer logic
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

          const nextStepIndex = currentStepIndex + 1;
          if (nextStepIndex < MEDITATION_STEPS.length) {
            setCurrentStepIndex(nextStepIndex);
            setTimeout(() => speak(MEDITATION_STEPS[nextStepIndex].name), 400);
            return MEDITATION_STEPS[nextStepIndex].duration;
          } else {
            setCurrentStepIndex(MEDITATION_STEPS.length);
            setIsActive(false);
            setTimeout(() => speak("Practice Complete"), 400);
            return 0;
          }
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
  }, [isActive, currentStepIndex, isCompleted, speak]);
  
  // Effect to update audio volume and save to localStorage
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    localStorage.setItem('meditation-volume', JSON.stringify(volume));
  }, [volume]);
  
  // Effect to clean up speech synthesis on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleStartPause = useCallback(() => {
    if (isCompleted) return;
    if (!isStarted) {
      setIsStarted(true);
      speak(MEDITATION_STEPS[0].name);
    }
    
    if (isActive) {
      window.speechSynthesis.cancel();
    }

    setIsActive(prev => !prev);
  }, [isCompleted, isStarted, isActive, speak]);

  const handleReset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    window.speechSynthesis.cancel();
    setCurrentStepIndex(0);
    setTimeLeft(MEDITATION_STEPS[0].duration);
    setIsActive(false);
    setIsStarted(false);
  }, []);
  
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);

  const handleNextStep = useCallback(() => {
    if (isCompleted) return;
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < MEDITATION_STEPS.length) {
        setCurrentStepIndex(nextStepIndex);
        setTimeLeft(MEDITATION_STEPS[nextStepIndex].duration);
        speak(MEDITATION_STEPS[nextStepIndex].name);
    } else {
        setCurrentStepIndex(MEDITATION_STEPS.length);
        setIsActive(false);
        setTimeLeft(0);
        speak("Practice Complete");
    }
  }, [currentStepIndex, isCompleted, speak]);

  const handlePreviousStep = useCallback(() => {
    if (isCompleted) return;
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
        setCurrentStepIndex(prevStepIndex);
        setTimeLeft(MEDITATION_STEPS[prevStepIndex].duration);
        speak(MEDITATION_STEPS[prevStepIndex].name);
    }
  }, [currentStepIndex, isCompleted, speak]);

  const completionMessage = (
    <div className="text-center h-80 md:h-96 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-cyan-300">Practice Complete</h2>
        <p className="text-gray-400 mt-2">Well done.</p>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <main className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        
        <div className="flex flex-col items-center">
            {isCompleted ? completionMessage : (
                <Timer
                    timeLeft={timeLeft}
                    totalDuration={totalDuration}
                    stepName={currentStep.name}
                    stepDescription={currentStep.description}
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
                totalSteps={MEDITATION_STEPS.length}
            />
            <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>

        <div className="w-full max-w-md lg:max-w-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-300 tracking-wide text-center lg:text-left">Meditation Sequence</h3>
            <ul className="space-y-3">
                {MEDITATION_STEPS.map((step, index) => (
                    <StepListItem
                        key={`${step.name}-${index}`}
                        name={step.name}
                        duration={step.duration}
                        isActive={!isCompleted && index === currentStepIndex}
                        isCompleted={index < currentStepIndex}
                    />
                ))}
            </ul>
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