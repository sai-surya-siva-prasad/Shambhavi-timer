import React, { useState, useEffect } from 'react';

interface StepListItemProps {
  index: number;
  name: string;
  duration: number; // in seconds
  canSelect: boolean;
  isActive: boolean;
  isCompleted: boolean;
  onUpdateDuration: (index: number, newDurationInSeconds: number) => void;
  onSelect: (index: number) => void;
}

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0 && secs === 0) return `${mins} min`;
    if (mins > 0 && secs > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
};

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
    </svg>
);

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


const StepListItem: React.FC<StepListItemProps> = ({ index, name, duration, canSelect, isActive, isCompleted, onUpdateDuration, onSelect }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newDuration, setNewDuration] = useState(String(duration / 60));
    
    useEffect(() => {
        // If external duration changes (e.g. reset), update the input field value if not editing
        if (!isEditing) {
            setNewDuration(String(duration / 60));
        }
    }, [duration, isEditing]);

    const handleSave = () => {
        const minutes = parseFloat(newDuration);
        if (!isNaN(minutes) && minutes >= 0) {
            onUpdateDuration(index, Math.round(minutes * 60));
        } else {
            // Reset to original value if input is invalid
            setNewDuration(String(duration / 60));
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setNewDuration(String(duration / 60));
            setIsEditing(false);
        }
    };
    
    const baseClasses = "flex items-center justify-between p-4 rounded-lg transition-all duration-300 ease-in-out border-l-4";
    const inactiveClasses = "bg-gray-800/60 border-gray-700 hover:bg-gray-700/60";
    const activeClasses = "bg-cyan-900/50 border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20";
    const completedClasses = "bg-gray-800/40 border-green-500/50 opacity-70";

    const getStatusIcon = () => {
        if (isCompleted) return <CheckIcon />;
        if (isActive) return <PlayIcon />;
        return <DotIcon />;
    };

    const isEditable = !isActive && !isCompleted;

    const nameTextClasses = isCompleted ? 'text-gray-400 line-through' : isActive ? 'text-white' : 'text-gray-300';
    const durationTextClasses = isCompleted ? 'text-gray-500' : isActive ? 'text-cyan-300' : 'text-gray-400';

    const handleRowClick = () => {
        if (canSelect) onSelect(index);
    };

    return (
        <li
            role="button"
            tabIndex={canSelect ? 0 : undefined}
            onClick={handleRowClick}
            onKeyDown={(e) => canSelect && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleRowClick())}
            className={`${baseClasses} ${isActive ? activeClasses : isCompleted ? completedClasses : inactiveClasses} ${canSelect ? 'cursor-pointer' : ''}`}
            aria-label={canSelect ? `Select ${name}` : name}
        >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                {getStatusIcon()}
                <span className={`font-medium ${nameTextClasses}`}>{name}</span>
            </div>
            <div className="flex items-center space-x-2 group" onClick={(e) => e.stopPropagation()}>
                {isEditing ? (
                    <input
                        type="number"
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-16 text-right font-mono text-sm bg-gray-700 text-white rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                ) : (
                    <span className={`font-mono text-sm ${durationTextClasses}`}>
                        {formatDuration(duration)}
                    </span>
                )}
                {isEditable && !isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="opacity-40 group-hover:opacity-100 transition-opacity" 
                        aria-label="Edit duration"
                        title="Edit duration"
                    >
                        <EditIcon />
                    </button>
                )}
            </div>
        </li>
    );
};

export default StepListItem;