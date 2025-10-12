import React from 'react';

interface HomeScreenProps {
  onBegin: () => void;
}

const LotusIcon = () => (
    <svg className="w-20 h-20 text-cyan-400/50 mb-6 animate-subtle-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z"></path>
        <path d="M2 12s2-3 5-3 5 3 5 3-3 3-5 3-5-3-5-3z"></path>
        <path d="M22 12s-2-3-5-3-5 3-5 3 3 3 5 3 5-3 5-3z"></path>
        <path d="M7 17s2-3 5-3 5 3 5 3-3 3-5 3-5-3-5-3z"></path>
    </svg>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ onBegin }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 text-center animate-breathing-bg">
      <main className="flex flex-col items-center animate-fade-in-slow">
        <LotusIcon />
        <h1 className="text-4xl md:text-5xl font-thin text-cyan-200 tracking-wider">
          Shambhavi Mahamudra Kriya
        </h1>
        <p className="text-lg text-gray-400 mt-4 max-w-lg">
          Welcome. This timer is a humble support for your daily practice.
          May it help you stay centered and focused.
        </p>
        <button
          onClick={onBegin}
          className="mt-12 px-8 py-4 font-semibold text-xl rounded-full shadow-lg flex items-center justify-center 
                     bg-cyan-600 text-white 
                     hover:bg-cyan-500 active:bg-cyan-700 
                     focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75
                     transition-all duration-300 transform hover:scale-105
                     shadow-cyan-500/20 hover:shadow-cyan-500/40"
        >
          Begin Practice
        </button>
      </main>
      <footer className="absolute bottom-8 text-center text-gray-600 text-sm">
        <p>Your journey begins with a single breath.</p>
      </footer>
    </div>
  );
};

export default HomeScreen;
