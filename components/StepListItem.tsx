
import React from 'react';

interface StepListItemProps {
  name: string;
  duration: number;
  isActive: boolean;
  isCompleted: boolean;
}

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins} min`;
    return `${mins} min ${secs} sec`;
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DotIcon = () => (
    <div className="h-6 w-6 flex items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-gray-600"></div>
    </div>
);


const StepListItem: React.FC<StepListItemProps> = ({ name, duration, isActive, isCompleted }) => {
    
    const baseClasses = "flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out border-l-4";
    const inactiveClasses = "bg-gray-800/60 border-gray-700 hover:bg-gray-700/60";
    const activeClasses = "bg-cyan-900/50 border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20";
    const completedClasses = "bg-gray-800/40 border-green-500/50 opacity-70";

    const getStatusIcon = () => {
        if (isCompleted) return <CheckIcon />;
        if (isActive) return <PlayIcon />;
        return <DotIcon />;
    };

    const nameTextClasses = isCompleted ? 'text-gray-400 line-through' : isActive ? 'text-white' : 'text-gray-300';
    const durationTextClasses = isCompleted ? 'text-gray-500' : isActive ? 'text-cyan-300' : 'text-gray-400';

    return (
        <li className={`${baseClasses} ${isActive ? activeClasses : isCompleted ? completedClasses : inactiveClasses}`}>
            <div className="flex items-center space-x-4">
                {getStatusIcon()}
                <span className={`font-medium ${nameTextClasses}`}>{name}</span>
            </div>
            <span className={`font-mono text-sm ${durationTextClasses}`}>
                {formatDuration(duration)}
            </span>
        </li>
    );
};

export default StepListItem;
