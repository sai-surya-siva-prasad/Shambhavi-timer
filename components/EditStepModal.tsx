import React, { useState, useEffect, useRef } from 'react';

interface EditStepModalProps {
  stepName: string;
  durationInSeconds: number;
  onSave: (newDurationInSeconds: number) => void;
  onClose: () => void;
}

const EditStepModal: React.FC<EditStepModalProps> = ({ stepName, durationInSeconds, onSave, onClose }) => {
  const initialMins = Math.floor(durationInSeconds / 60);
  const initialSecs = durationInSeconds % 60;

  const [minutes, setMinutes] = useState(String(initialMins));
  const [seconds, setSeconds] = useState(String(initialSecs));
  const minsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    minsRef.current?.focus();
  }, []);

  const handleSave = () => {
    const mins = Math.max(0, parseInt(minutes, 10) || 0);
    const secs = Math.max(0, Math.min(59, parseInt(seconds, 10) || 0));
    const total = mins * 60 + secs;
    if (total > 0) onSave(total);
    else onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'rgba(26, 11, 56, 0.95)',
    color: '#FFF8E7',
    border: '1px solid rgba(218,165,32,0.5)',
    borderRadius: '0.75rem',
    padding: '0.75rem',
    fontSize: '1.5rem',
    textAlign: 'center',
    width: '100%',
    outline: 'none',
    fontFamily: 'monospace',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#100525',
          border: '1px solid rgba(218,165,32,0.35)',
          borderRadius: '1.25rem',
          padding: '1.75rem 1.5rem',
          width: '100%',
          maxWidth: '340px',
          boxShadow: '0 0 40px rgba(0,0,0,0.7), 0 0 20px rgba(184,134,11,0.15)',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Step name */}
        <p
          className="font-cinzel text-center uppercase tracking-widest mb-5"
          style={{ color: '#FBBF24', fontSize: '0.75rem' }}
        >
          {stepName}
        </p>

        {/* Time inputs */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex flex-col items-center gap-1">
            <label className="font-cormorant text-xs tracking-widest" style={{ color: 'rgba(184,134,11,0.7)' }}>
              MINUTES
            </label>
            <input
              ref={minsRef}
              type="number"
              min="0"
              max="99"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>

          <span
            className="font-cormorant font-light"
            style={{ color: 'rgba(251,191,36,0.5)', fontSize: '2rem', paddingTop: '1.4rem' }}
          >
            :
          </span>

          <div className="flex-1 flex flex-col items-center gap-1">
            <label className="font-cormorant text-xs tracking-widest" style={{ color: 'rgba(184,134,11,0.7)' }}>
              SECONDS
            </label>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={e => setSeconds(e.target.value)}
              style={inputStyle}
              placeholder="0"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 font-cinzel tracking-widest rounded-xl transition-all active:scale-95"
            style={{
              backgroundColor: 'rgba(45,20,69,0.6)',
              color: 'rgba(251,191,36,0.6)',
              border: '1px solid rgba(184,134,11,0.3)',
              fontSize: '0.8rem',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 font-cinzel tracking-widest rounded-xl transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 40%, #FF8C00 100%)',
              color: '#1A0B38',
              fontSize: '0.8rem',
              boxShadow: '0 0 16px rgba(218,165,32,0.3)',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStepModal;
