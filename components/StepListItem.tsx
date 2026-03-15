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
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"
       style={{ color: 'rgba(184,134,11,0.5)' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
       style={{ color: '#DAA520' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-diya-flicker" fill="none" viewBox="0 0 24 24" stroke="currentColor"
       style={{ color: '#FBBF24' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DotIcon = () => (
  <div className="h-6 w-6 flex items-center justify-center">
    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(184,134,11,0.35)' }} />
  </div>
);

const StepListItem: React.FC<StepListItemProps> = ({
  index, name, duration, canSelect, isActive, isCompleted,
  onUpdateDuration, onSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDuration, setNewDuration] = useState(String(duration / 60));

  useEffect(() => {
    if (!isEditing) setNewDuration(String(duration / 60));
  }, [duration, isEditing]);

  const handleSave = () => {
    const minutes = parseFloat(newDuration);
    if (!isNaN(minutes) && minutes >= 0) {
      onUpdateDuration(index, Math.round(minutes * 60));
    } else {
      setNewDuration(String(duration / 60));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') { setNewDuration(String(duration / 60)); setIsEditing(false); }
  };

  // ── Style variants ──────────────────────────────────────────────
  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease-in-out',
    borderLeft: '4px solid transparent',
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(45, 20, 69, 0.75)',
    borderLeftColor: '#FBBF24',
    transform: 'scale(1.03)',
    boxShadow: '0 4px 20px rgba(251,191,36,0.2)',
  };

  const completedStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(20, 12, 35, 0.5)',
    borderLeftColor: 'rgba(218,165,32,0.35)',
    opacity: 0.65,
  };

  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'rgba(26, 11, 56, 0.5)',
    borderLeftColor: 'rgba(184,134,11,0.2)',
  };

  const rowStyle = isActive ? activeStyle : isCompleted ? completedStyle : inactiveStyle;

  const nameColor = isCompleted ? 'rgba(184,134,11,0.55)' : isActive ? '#FFF8E7' : 'rgba(255,230,150,0.75)';
  const durationColor = isCompleted ? 'rgba(184,134,11,0.4)' : isActive ? '#FBBF24' : 'rgba(184,134,11,0.6)';

  const getStatusIcon = () => {
    if (isCompleted) return <CheckIcon />;
    if (isActive) return <PlayIcon />;
    return <DotIcon />;
  };

  const isEditable = !isActive && !isCompleted;

  const handleRowClick = () => { if (canSelect) onSelect(index); };

  return (
    <li
      role="button"
      tabIndex={canSelect ? 0 : undefined}
      onClick={handleRowClick}
      onKeyDown={e => canSelect && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleRowClick())}
      style={{ ...rowStyle, cursor: canSelect ? 'pointer' : 'default' }}
      aria-label={canSelect ? `Select ${name}` : name}
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {getStatusIcon()}
        <span
          className="font-cormorant font-semibold text-base"
          style={{ color: nameColor, textDecoration: isCompleted ? 'line-through' : 'none' }}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center space-x-2 group" onClick={e => e.stopPropagation()}>
        {isEditing ? (
          <input
            type="number"
            value={newDuration}
            onChange={e => setNewDuration(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-16 text-right font-mono text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'rgba(45,20,69,0.9)',
              color: '#FBBF24',
              border: '1px solid rgba(184,134,11,0.5)',
            }}
          />
        ) : (
          <span className="font-mono text-sm" style={{ color: durationColor }}>
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
