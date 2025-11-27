import React, { useState, useRef, useEffect } from 'react';
import { Mode, MODE_LABELS } from '../types';

interface ModeSelectorProps {
  value: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}

const modes: Mode[] = [
  'chat',
  'rewrite',
  'compress',
  'expand',
  'summarize',
  'generate_section',
];

const MODE_ICONS: Record<Mode, string> = {
  chat: '💬',
  rewrite: '✏️',
  compress: '📉',
  expand: '📈',
  summarize: '📋',
  generate_section: '✨',
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (mode: Mode) => {
    onChange(mode);
    setIsOpen(false);
  };

  return (
    <div className="mode-selector" ref={ref}>
      <button 
        className="mode-button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="mode-icon">{MODE_ICONS[value]}</span>
        <span className="mode-label">{MODE_LABELS[value]}</span>
        <svg className="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="mode-dropdown">
          {modes.map((mode) => (
            <button
              key={mode}
              className={`mode-option ${mode === value ? 'active' : ''}`}
              onClick={() => handleSelect(mode)}
            >
              <span className="mode-icon">{MODE_ICONS[mode]}</span>
              <span>{MODE_LABELS[mode]}</span>
            </button>
          ))}
        </div>
      )}
      
      <style>{`
        .mode-selector {
          position: relative;
          display: inline-block;
        }
        
        .mode-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 16px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .mode-button:hover:not(:disabled) {
          background: #e5e7eb;
        }
        
        .mode-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .mode-icon {
          font-size: 14px;
        }
        
        .mode-label {
          font-weight: 500;
        }
        
        .chevron {
          color: #9ca3af;
          margin-left: 2px;
        }
        
        .mode-dropdown {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 4px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 6px;
          min-width: 180px;
          z-index: 100;
          animation: slideUp 0.15s ease;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mode-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 10px;
          background: none;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          text-align: left;
          transition: background 0.1s;
        }
        
        .mode-option:hover {
          background: #f3f4f6;
        }
        
        .mode-option.active {
          background: #f3f4f6;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

// Helper to detect mode from user prompt
export function detectModeFromPrompt(prompt: string): Mode | null {
  const p = prompt.toLowerCase();
  
  if (p.includes('суммар') || p.includes('резюме') || p.includes('кратко') || p.includes('итог')) {
    return 'summarize';
  }
  if (p.includes('переформул') || p.includes('перепиши') || p.includes('переписать') || p.includes('иначе')) {
    return 'rewrite';
  }
  if (p.includes('сократи') || p.includes('сжать') || p.includes('короче') || p.includes('уменьши')) {
    return 'compress';
  }
  if (p.includes('расширь') || p.includes('подробн') || p.includes('добавь') || p.includes('дополни')) {
    return 'expand';
  }
  if (p.includes('сгенерир') || p.includes('создай') || p.includes('напиши раздел') || p.includes('добавь раздел')) {
    return 'generate_section';
  }
  
  return null;
}
