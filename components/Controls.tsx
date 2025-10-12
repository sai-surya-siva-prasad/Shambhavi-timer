import React from 'react';

interface ControlsProps {
  isActive: boolean;
  isStarted: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStepIndex: number;
  totalSteps: number;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
    </svg>
);

const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);

const PreviousIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);

const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
);


const Controls: React.FC<ControlsProps> = ({ isActive, isStarted, onStartPause, onReset, onNext, onPrevious, currentStepIndex, totalSteps }) => {
  const baseButtonClasses = "transition-transform transform focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none";
  const mainButtonClasses = "w-36 px-6 py-3 font-semibold rounded-full shadow-lg flex items-center justify-center";
  const skipButtonClasses = "w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-600 active:bg-gray-800 focus:ring-gray-500 hover:scale-105";

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <div className="flex items-center space-x-4">
        {isStarted && (
            <button onClick={onPrevious} disabled={currentStepIndex === 0} className={`${baseButtonClasses} ${skipButtonClasses}`} aria-label="Previous Step">
                <PreviousIcon />
            </button>
        )}

        <button
          onClick={onStartPause}
          className={`${baseButtonClasses} ${mainButtonClasses} bg-cyan-600 text-white hover:bg-cyan-500 active:bg-cyan-700 focus:ring-cyan-400 hover:scale-105 w-40`}
        >
          {isActive ? <PauseIcon /> : <PlayIcon />}
          <span className="ml-2">{isStarted ? (isActive ? 'Pause' : 'Resume') : 'Start'}</span>
        </button>

        {isStarted && (
            <button onClick={onNext} disabled={currentStepIndex >= totalSteps - 1} className={`${baseButtonClasses} ${skipButtonClasses}`} aria-label="Next Step">
                <NextIcon />
            </button>
        )}
      </div>

      {isStarted && (
         <button
            onClick={onReset}
            className={`${baseButtonClasses} ${mainButtonClasses} bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800 focus:ring-gray-500 hover:scale-105 text-sm w-auto px-4 py-2`}
        >
            <ResetIcon />
            Reset
        </button>
      )}
    </div>
  );
};

export default Controls;