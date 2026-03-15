import React from 'react';

interface HomeScreenProps {
  onBegin: () => void;
}

/**
 * Ornate lotus with 8 outer petals, 8 inner petals, decorative rings
 * and the sacred Om (ॐ) symbol at the centre.
 */
const OrnateLotus = () => (
  <div className="relative w-40 h-40 mb-8 animate-subtle-pulse">
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <defs>
        {/* Saffron-to-deep-orange gradient for outer petals */}
        <radialGradient id="outerPetalGrad" cx="50%" cy="75%" r="65%">
          <stop offset="0%"   stopColor="#FFAA00" />
          <stop offset="100%" stopColor="#CC5500" />
        </radialGradient>
        {/* Gold gradient for inner petals */}
        <radialGradient id="innerPetalGrad" cx="50%" cy="75%" r="65%">
          <stop offset="0%"   stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>
        {/* Deep centre gradient */}
        <radialGradient id="centreGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%"   stopColor="#3D1A6E" />
          <stop offset="100%" stopColor="#1A0B38" />
        </radialGradient>
      </defs>

      {/* Outermost decorative dashed ring */}
      <circle cx="60" cy="60" r="57" stroke="#FBBF24" strokeWidth="0.6"
              fill="none" opacity="0.25" strokeDasharray="3 5" />
      {/* Second decorative ring */}
      <circle cx="60" cy="60" r="52" stroke="#FF9500" strokeWidth="0.5"
              fill="none" opacity="0.2" />

      {/* 8 outer petals – teardrop paths rotated 45° apart */}
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={`op-${i}`}
          d="M 60,60 C 51,40 49,22 60,10 C 71,22 69,40 60,60"
          transform={`rotate(${i * 45}, 60, 60)`}
          fill="url(#outerPetalGrad)"
          opacity="0.82"
        />
      ))}

      {/* 8 inner petals – shorter, offset 22.5° */}
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={`ip-${i}`}
          d="M 60,60 C 55,46 54,34 60,26 C 66,34 65,46 60,60"
          transform={`rotate(${i * 45 + 22.5}, 60, 60)`}
          fill="url(#innerPetalGrad)"
          opacity="0.88"
        />
      ))}

      {/* Inner glow ring */}
      <circle cx="60" cy="60" r="18" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.5" />

      {/* Centre circle */}
      <circle cx="60" cy="60" r="14" fill="url(#centreGrad)" stroke="#FFD700" strokeWidth="1" />

      {/* Om symbol */}
      <text
        x="60" y="65"
        textAnchor="middle"
        fontSize="14"
        fill="#FFD700"
        fontFamily="serif"
        fontWeight="bold"
      >
        ॐ
      </text>
    </svg>
  </div>
);

/** Decorative horizontal rule with a central diamond */
const OrnateDivider = () => (
  <div className="flex items-center w-full max-w-xs my-5">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-amber-500/70" />
    <span className="mx-3 text-amber-400 text-base select-none">◆</span>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-700/40 to-amber-500/70" />
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onBegin }) => {
  return (
    <div
      className="text-white min-h-screen flex flex-col items-center justify-center p-4 text-center animate-breathing-bg"
      style={{ backgroundColor: '#0D0520' }}
    >
      <main className="flex flex-col items-center animate-fade-in-slow">

        {/* Sacred Om header */}
        <p className="font-cormorant text-amber-400/60 text-2xl tracking-[0.3em] mb-2 animate-text-shimmer">
          ॐ नमः शिवाय
        </p>

        <OrnateLotus />

        {/* Title */}
        <h1 className="font-cinzel text-3xl md:text-4xl font-semibold tracking-widest"
            style={{ color: '#FFD700', textShadow: '0 0 24px rgba(255,165,0,0.4)' }}>
          Shambhavi Mahamudra
        </h1>
        <h2 className="font-cinzel text-lg md:text-xl font-normal tracking-[0.35em] mt-1"
            style={{ color: '#FFAA00' }}>
          Kriya Timer
        </h2>

        <OrnateDivider />

        <p className="font-cormorant text-lg text-amber-100/70 mt-2 max-w-md leading-relaxed italic">
          Welcome. This timer is a humble support for your daily practice.
          May it help you stay centred and in the divine flow.
        </p>

        {/* Begin button — saffron / golden */}
        <button
          onClick={onBegin}
          className="mt-10 px-10 py-4 font-cinzel font-semibold text-lg tracking-widest rounded-full
                     flex items-center justify-center
                     transition-all duration-300 transform hover:scale-105 focus:outline-none
                     focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
          style={{
            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 40%, #FF8C00 100%)',
            color: '#1A0B38',
            boxShadow: '0 0 24px rgba(218,165,32,0.45), 0 4px 16px rgba(0,0,0,0.5)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 40px rgba(218,165,32,0.7), 0 4px 20px rgba(0,0,0,0.5)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 0 24px rgba(218,165,32,0.45), 0 4px 16px rgba(0,0,0,0.5)';
          }}
        >
          ✦ Begin Practice ✦
        </button>
      </main>

      <footer className="absolute bottom-8 text-center text-amber-800/60 text-sm font-cormorant tracking-wider">
        <p>Your journey begins with a single breath.</p>
      </footer>
    </div>
  );
};

export default HomeScreen;
