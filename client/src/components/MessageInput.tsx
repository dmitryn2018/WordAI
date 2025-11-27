import React, { useState, useRef } from 'react';
import { Mode, MODE_REQUIRES_SELECTION } from '../types';

interface MessageInputProps {
  mode: Mode;
  onSend: (
    userPrompt: string,
    useSelection: boolean,
    replaceSelection: boolean
  ) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  mode,
  onSend,
  onStop,
  isLoading,
  disabled = false,
}) => {
  const [prompt, setPrompt] = useState('');
  const [useSelection, setUseSelection] = useState(true);
  const [replaceSelection, setReplaceSelection] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const requiresSelection = MODE_REQUIRES_SELECTION[mode];

  const handleSubmit = () => {
    if (isLoading || disabled || !prompt.trim()) return;
    onSend(prompt, useSelection || requiresSelection, replaceSelection);
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="message-input">
      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите запрос..."
          disabled={isLoading || disabled}
          rows={1}
          className="prompt-textarea"
        />
        {isLoading ? (
          <button onClick={onStop} className="btn btn-stop" title="Остановить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2"/>
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={disabled || !prompt.trim()}
            className="btn btn-send"
            title="Отправить"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        )}
      </div>
      
      <div className="input-options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={useSelection || requiresSelection}
            onChange={(e) => setUseSelection(e.target.checked)}
            disabled={requiresSelection || isLoading}
          />
          <span>Из выделения</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={replaceSelection}
            onChange={(e) => setReplaceSelection(e.target.checked)}
            disabled={isLoading}
          />
          <span>Заменить в документе</span>
        </label>
      </div>
      
      <style>{`
        .message-input {
          padding: 12px 16px 16px;
        }
        
        .input-container {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          margin-bottom: 10px;
        }
        
        .prompt-textarea {
          flex: 1;
          padding: 12px 14px;
          font-size: 14px;
          font-family: inherit;
          border: 1px solid #e5e5e5;
          border-radius: 20px;
          resize: none;
          outline: none;
          transition: border-color 0.15s;
          line-height: 1.4;
          min-height: 44px;
          max-height: 120px;
        }
        
        .prompt-textarea:focus {
          border-color: #333;
        }
        
        .prompt-textarea:disabled {
          background: #f9f9f9;
          color: #999;
        }
        
        .prompt-textarea::placeholder {
          color: #999;
        }
        
        .btn {
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .btn-send {
          background: #333;
          color: white;
        }
        
        .btn-send:hover:not(:disabled) {
          background: #000;
        }
        
        .btn-stop {
          background: #dc2626;
          color: white;
        }
        
        .btn-stop:hover {
          background: #b91c1c;
        }
        
        .input-options {
          display: flex;
          gap: 16px;
          padding: 0 4px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666;
          cursor: pointer;
          user-select: none;
        }
        
        .checkbox-label input {
          width: 14px;
          height: 14px;
          cursor: pointer;
          accent-color: #333;
        }
        
        .checkbox-label input:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
