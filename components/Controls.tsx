import React from 'react';

interface ControlsProps {
  isActive: boolean;
  isStarted: boolean;
  hasAnySteps: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStepIndex: number;
  totalSteps: number;
}

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
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

const Controls: React.FC<ControlsProps> = ({
  isActive, isStarted, hasAnySteps,
  onStartPause, onReset, onNext, onPrevious,
  currentStepIndex, totalSteps,
}) => {
  const baseBtn = "transition-transform transform focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none";

  /** Skip buttons: deep maroon with gold border */
  const skipBtn = `${baseBtn} w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:scale-105 focus:ring-amber-400`;
  const skipStyle = {
    backgroundColor: '#2D1445',
    border: '1px solid rgba(184,134,11,0.5)',
    color: '#FBBF24',
  };
  const skipHoverStyle = { backgroundColor: '#3D1A6E' };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-3 sm:space-x-4">

        {isStarted && (
          <button
            onClick={onPrevious}
            disabled={currentStepIndex === 0}
            className={skipBtn}
            style={skipStyle}
            aria-label="Previous Step"
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, skipHoverStyle)}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, skipStyle)}
          >
            <PreviousIcon />
          </button>
        )}

        {/* Main play/pause — saffron/gold gradient */}
        <button
          onClick={onStartPause}
          disabled={!hasAnySteps}
          className={`${baseBtn} w-36 sm:w-40 px-5 sm:px-6 py-3 font-cinzel font-semibold rounded-full shadow-lg flex items-center justify-center text-sm tracking-wider hover:scale-105 focus:ring-amber-400`}
          style={{
            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 40%, #FF8C00 100%)',
            color: '#1A0B38',
            boxShadow: '0 0 18px rgba(218,165,32,0.4), 0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {isActive ? <PauseIcon /> : <PlayIcon />}
          <span className="ml-2">
            {isStarted ? (isActive ? 'Pause' : 'Resume') : 'Start'}
          </span>
        </button>

        {isStarted && (
          <button
            onClick={onNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className={skipBtn}
            style={skipStyle}
            aria-label="Next Step"
            onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, skipHoverStyle)}
            onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, skipStyle)}
          >
            <NextIcon />
          </button>
        )}
      </div>

      {isStarted && (
        <button
          onClick={onReset}
          className={`${baseBtn} px-5 py-2 rounded-full flex items-center text-sm font-cormorant tracking-wide hover:scale-105 focus:ring-amber-600`}
          style={{
            backgroundColor: 'rgba(45, 20, 69, 0.8)',
            border: '1px solid rgba(184,134,11,0.4)',
            color: '#FBBF24',
          }}
        >
          <ResetIcon />
          Reset
        </button>
      )}
    </div>
  );
};

export default Controls;
