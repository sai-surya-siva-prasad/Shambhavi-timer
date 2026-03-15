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
  const radius = 140;
  const strokeWidth = 12;
  const viewBoxSize = 320;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  // Decorative outer mandala ring: 24 small dashes evenly spaced
  const outerRingDots = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 - 90) * (Math.PI / 180);
    const r = 155;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    const isAccent = i % 3 === 0;
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={isAccent ? 2.5 : 1.5}
        fill={isAccent ? '#FFD700' : '#B8860B'}
        opacity={isAccent ? 0.7 : 0.4}
      />
    );
  });

  return (
    <div className="relative flex flex-col items-center justify-center w-80 h-80 md:w-96 md:h-96">

      {/* Outermost decorative mandala ring — slow spin */}
      <div className="absolute inset-0 animate-mandala-rotate" style={{ top: '-12px', left: '-12px', right: '-12px', bottom: '-12px', width: 'calc(100% + 24px)', height: 'calc(100% + 24px)' }}>
        <svg className="w-full h-full" viewBox="0 0 344 344">
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 15 - 90) * (Math.PI / 180);
            const r = 165;
            const x = 172 + r * Math.cos(angle);
            const y = 172 + r * Math.sin(angle);
            const isAccent = i % 3 === 0;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={isAccent ? 3 : 1.8}
                fill={isAccent ? '#FFD700' : '#B8860B'}
                opacity={isAccent ? 0.6 : 0.35}
              />
            );
          })}
        </svg>
      </div>

      {/* SVG rings with golden glow */}
      <div className="absolute inset-0 animate-golden-glow">
        <svg className="w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          {/* Background track — deep maroon/indigo ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#2D1445"
            fill="transparent"
          />
          {/* Secondary decorative ring — thin gold */}
          <circle
            cx={center}
            cy={center}
            r={radius + 8}
            strokeWidth={1}
            stroke="#B8860B"
            fill="transparent"
            strokeDasharray="6 6"
            opacity="0.5"
          />
          {/* Progress ring — saffron-gold gradient via stroke */}
          <circle
            cx={center}
            cy={center}
            r={radius}
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

      {/* Inner glass-like circle — deep indigo with gold border */}
      <div
        className="absolute rounded-full backdrop-blur-sm"
        style={{
          width: '78%',
          height: '78%',
          top: '11%',
          left: '11%',
          backgroundColor: 'rgba(13, 5, 32, 0.65)',
          border: '1px solid rgba(218,165,32,0.25)',
        }}
      />

      {/* Text content */}
      <div className="relative z-10 text-center flex flex-col justify-center items-center w-full px-8">
        <h2
          className="font-cinzel text-base md:text-lg font-semibold uppercase tracking-widest leading-tight break-words min-h-[56px] flex items-center justify-center"
          style={{ color: '#FBBF24', textShadow: '0 0 12px rgba(251,191,36,0.4)' }}
        >
          {stepName}
        </h2>
        <p
          className="font-cormorant text-6xl md:text-7xl font-light tabular-nums my-2 tracking-tighter"
          style={{ color: '#FFF8E7', textShadow: '0 0 20px rgba(255,200,50,0.2)' }}
        >
          {formatTime(timeLeft)}
        </p>
        <p className="font-cormorant text-base italic" style={{ color: 'rgba(251,191,36,0.55)' }}>
          {stepDescription}
        </p>
      </div>
    </div>
  );
};

export default Timer;
