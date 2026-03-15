import React from 'react';

interface HomeScreenProps {
  onBegin: () => void;
}

/**
 * Minimal symbol: a soft ring with the Om (ॐ) at the centre.
 */
const OmSymbol = () => (
  <div className="relative w-36 h-36 mb-8 animate-subtle-pulse flex items-center justify-center">
    <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#FFD700" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft glow fill */}
      <circle cx="60" cy="60" r="54" fill="url(#ringGlow)" />
      {/* Single clean ring */}
      <circle cx="60" cy="60" r="50" fill="none" stroke="#B8860B" strokeWidth="0.8" opacity="0.55" />
      {/* Slightly inner ring for depth */}
      <circle cx="60" cy="60" r="44" fill="none" stroke="#FFD700" strokeWidth="0.4" opacity="0.25" />
    </svg>
    {/* Om glyph in the centre, rendered as text so it scales crisply */}
    <span
      className="relative font-cormorant select-none"
      style={{ fontSize: '4rem', lineHeight: 1, color: '#FFD700',
               textShadow: '0 0 20px rgba(255,180,0,0.5)' }}
    >
      ॐ
    </span>
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
      className="text-white min-h-screen flex flex-col items-center justify-center p-4 py-10 text-center animate-breathing-bg"
      style={{ backgroundColor: '#0D0520' }}
    >
      <main className="flex flex-col items-center animate-fade-in-slow w-full max-w-sm sm:max-w-md">

        {/* Sacred Om header */}
        <p className="font-cormorant text-amber-400/60 text-2xl tracking-[0.3em] mb-2 animate-text-shimmer">
          ॐ नमः शिवाय
        </p>

        <OmSymbol />

        {/* Title */}
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-semibold tracking-widest"
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
          className="mt-8 px-8 sm:px-10 py-3 sm:py-4 font-cinzel font-semibold text-base sm:text-lg tracking-widest rounded-full
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
