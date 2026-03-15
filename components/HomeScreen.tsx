import React from 'react';

interface HomeScreenProps {
  onBegin: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onBegin }) => {
  return (
    <div
      className="text-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-breathing-bg"
      style={{ backgroundColor: '#0D0520' }}
    >
      <main className="flex flex-col items-center animate-fade-in-slow w-full max-w-xs">

        {/* Title */}
        <h1
          className="font-cinzel text-2xl sm:text-3xl font-semibold tracking-widest mb-2"
          style={{ color: '#FFD700', textShadow: '0 0 24px rgba(255,165,0,0.4)' }}
        >
          Shambhavi Mahamudra
        </h1>
        <h2
          className="font-cinzel text-base sm:text-lg font-normal tracking-[0.3em] mb-10"
          style={{ color: '#FFAA00' }}
        >
          Kriya Timer
        </h2>

        {/* Begin button */}
        <button
          onClick={onBegin}
          className="w-full py-4 font-cinzel font-semibold text-base tracking-widest rounded-2xl
                     transition-all duration-300 active:scale-95 focus:outline-none
                     focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
          style={{
            background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 40%, #FF8C00 100%)',
            color: '#1A0B38',
            boxShadow: '0 0 24px rgba(218,165,32,0.45), 0 4px 16px rgba(0,0,0,0.5)',
            minHeight: '56px',
          }}
        >
          Begin Practice
        </button>
      </main>
    </div>
  );
};

export default HomeScreen;
