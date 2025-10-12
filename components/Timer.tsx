import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalDuration: number;
  stepName: string;
  stepDescription: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer: React.FC<TimerProps> = ({ timeLeft, totalDuration, stepName, stepDescription }) => {
  // Constants for the circular progress bar
  const radius = 140;
  const strokeWidth = 12; // Thinner stroke for a more refined look
  const viewBoxSize = 320;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    // Main container with relative positioning
    <div className="relative flex flex-col items-center justify-center w-80 h-80 md:w-96 md:h-96">
      
      {/* SVG Container for the rings. Using a drop-shadow for the glow effect. */}
      <div className="absolute inset-0 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
        <svg className="w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          {/* Background Track Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-gray-800"
            fill="transparent"
          />
          
          {/* Progress Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${center} ${center})`}
            className="stroke-cyan-400"
            style={{ transition: 'stroke-dashoffset 1s linear' }} // Smoother transition
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Inner decorative element for a layered, glass-like look */}
      <div className="absolute w-[80%] h-[80%] bg-gray-900/50 rounded-full border border-white/10 backdrop-blur-sm"></div>

      {/* Text content, layered on top */}
      <div className="relative z-10 text-center flex flex-col justify-center items-center w-full px-8">
        <h2 className="text-lg md:text-xl font-light text-cyan-300 uppercase tracking-normal leading-tight break-words min-h-[56px] flex items-center justify-center">
          {stepName}
        </h2>
        <p className="text-7xl md:text-8xl font-thin text-white tabular-nums my-2 tracking-tighter">
          {formatTime(timeLeft)}
        </p>
        <p className="text-sm text-gray-400">
          {stepDescription}
        </p>
      </div>
    </div>
  );
};

export default Timer;