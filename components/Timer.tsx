import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalDuration: number;
  stepName: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer: React.FC<TimerProps> = ({ timeLeft, totalDuration, stepName }) => {
  const radius = 130;
  const strokeWidth = 10;
  const viewBoxSize = 300;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex flex-col items-center justify-center"
         style={{ width: 'min(72vw, 300px)', height: 'min(72vw, 300px)' }}>

      {/* Outer decorative ring — slow spin */}
      <div
        className="absolute animate-mandala-rotate"
        style={{ inset: '-14px', width: 'calc(100% + 28px)', height: 'calc(100% + 28px)' }}
      >
        <svg className="w-full h-full" viewBox="0 0 328 328">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 - 90) * (Math.PI / 180);
            const r = 158;
            const x = 164 + r * Math.cos(angle);
            const y = 164 + r * Math.sin(angle);
            const isAccent = i % 3 === 0;
            return (
              <circle
                key={i}
                cx={x} cy={y}
                r={isAccent ? 2.5 : 1.5}
                fill={isAccent ? '#FFD700' : '#B8860B'}
                opacity={isAccent ? 0.55 : 0.3}
              />
            );
          })}
        </svg>
      </div>

      {/* Progress rings */}
      <div className="absolute inset-0 animate-golden-glow">
        <svg className="w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          {/* Background track */}
          <circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} stroke="#2D1445" fill="transparent" />
          {/* Thin gold dashed ring */}
          <circle
            cx={center} cy={center} r={radius + 8}
            strokeWidth={1} stroke="#B8860B" fill="transparent"
            strokeDasharray="5 5" opacity="0.45"
          />
          {/* Progress arc */}
          <circle
            cx={center} cy={center} r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${center} ${center})`}
            stroke="#FBBF24"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Inner circle backdrop */}
      <div
        className="absolute rounded-full"
        style={{
          width: '76%', height: '76%',
          top: '12%', left: '12%',
          backgroundColor: 'rgba(13, 5, 32, 0.7)',
          border: '1px solid rgba(218,165,32,0.2)',
        }}
      />

      {/* Text */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-1 px-4">
        <h2
          className="font-cinzel font-semibold uppercase tracking-widest leading-tight"
          style={{
            fontSize: 'clamp(0.6rem, 2.5vw, 0.85rem)',
            color: '#FBBF24',
            textShadow: '0 0 10px rgba(251,191,36,0.4)',
            maxWidth: '80%',
            wordBreak: 'break-word',
            minHeight: '1.5em',
          }}
        >
          {stepName}
        </h2>
        <p
          className="font-cormorant font-light tabular-nums tracking-tighter"
          style={{
            fontSize: 'clamp(2rem, 11vw, 3.5rem)',
            color: '#FFF8E7',
            textShadow: '0 0 16px rgba(255,200,50,0.2)',
            lineHeight: 1,
          }}
        >
          {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
};

export default Timer;
