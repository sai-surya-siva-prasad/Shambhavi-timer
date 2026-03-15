import React from 'react';

interface StepListItemProps {
  index: number;
  name: string;
  duration: number; // in seconds
  canSelect: boolean;
  isActive: boolean;
  isCompleted: boolean;
  onEdit: (index: number) => void;
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
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
       style={{ color: '#DAA520' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 animate-diya-flicker" fill="none" viewBox="0 0 24 24" stroke="currentColor"
       style={{ color: '#FBBF24' }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DotIcon = () => (
  <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(184,134,11,0.35)' }} />
  </div>
);

const StepListItem: React.FC<StepListItemProps> = ({
  index, name, duration, canSelect, isActive, isCompleted,
  onEdit, onSelect,
}) => {
  const isEditable = !isActive && !isCompleted;

  const nameColor = isCompleted ? 'rgba(184,134,11,0.5)' : isActive ? '#FFF8E7' : 'rgba(255,230,150,0.75)';
  const durationColor = isCompleted ? 'rgba(184,134,11,0.35)' : isActive ? '#FBBF24' : 'rgba(184,134,11,0.55)';

  const getStatusIcon = () => {
    if (isCompleted) return <CheckIcon />;
    if (isActive) return <PlayIcon />;
    return <DotIcon />;
  };

  const handleRowClick = () => {
    if (canSelect) onSelect(index);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(index);
  };

  return (
    <li
      role="button"
      tabIndex={canSelect ? 0 : undefined}
      onClick={handleRowClick}
      onKeyDown={e => canSelect && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleRowClick())}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1rem',
        borderRadius: '0.625rem',
        transition: 'all 0.25s ease-in-out',
        borderLeft: `4px solid ${isActive ? '#FBBF24' : isCompleted ? 'rgba(218,165,32,0.3)' : 'rgba(184,134,11,0.18)'}`,
        backgroundColor: isActive
          ? 'rgba(45, 20, 69, 0.75)'
          : isCompleted
          ? 'rgba(20, 12, 35, 0.45)'
          : 'rgba(26, 11, 56, 0.45)',
        boxShadow: isActive ? '0 4px 18px rgba(251,191,36,0.18)' : 'none',
        opacity: isCompleted ? 0.65 : 1,
        cursor: canSelect ? 'pointer' : 'default',
        minHeight: '52px',
      }}
      aria-label={canSelect ? `Select ${name}` : name}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getStatusIcon()}
        <span
          className="font-cormorant font-semibold text-base leading-tight"
          style={{
            color: nameColor,
            textDecoration: isCompleted ? 'line-through' : 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="font-mono text-sm" style={{ color: durationColor }}>
          {formatDuration(duration)}
        </span>
        {isEditable && (
          <button
            onClick={handleEditClick}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{
              color: 'rgba(184,134,11,0.6)',
              padding: '6px',
              minWidth: '32px',
              minHeight: '32px',
            }}
            aria-label="Edit duration"
          >
            <EditIcon />
          </button>
        )}
      </div>
    </li>
  );
};

export default StepListItem;
