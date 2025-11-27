import React, { useState, useCallback } from 'react';
import { Mode, Settings } from '../types';
import { useChat, loadSettings, saveSettings } from '../hooks/useChat';
import { ModeSelector, detectModeFromPrompt } from './ModeSelector';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { SettingsPanel } from './SettingsPanel';

export const TaskPane: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [mode, setMode] = useState<Mode>('chat');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stopRequest,
    clearMessages,
    clearError,
  } = useChat({ settings });

  const handleSend = useCallback((
    userPrompt: string,
    useSelection: boolean,
    replaceSelection: boolean
  ) => {
    // Auto-detect mode from prompt if possible
    const detectedMode = detectModeFromPrompt(userPrompt);
    const effectiveMode = detectedMode || mode;
    
    // Update mode selector to show detected mode
    if (detectedMode && detectedMode !== mode) {
      setMode(detectedMode);
    }
    
    sendMessage(effectiveMode, userPrompt, useSelection, replaceSelection);
  }, [mode, sendMessage]);

  const handleSettingsSave = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  return (
    <div className="task-pane">
      <header className="header">
        <div className="header-row">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#333" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" fill="#333"/>
            </svg>
          </div>
          <div className="header-actions">
            <button 
              className="icon-btn" 
              onClick={clearMessages}
              title="Очистить"
              disabled={isLoading || messages.length === 0}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/>
              </svg>
            </button>
            <button 
              className="icon-btn" 
              onClick={() => setSettingsOpen(true)}
              title="Настройки"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />

      <div className="input-area">
        <div className="input-toolbar">
          <ModeSelector
            value={mode}
            onChange={setMode}
            disabled={isLoading}
          />
        </div>
        <MessageInput
          mode={mode}
          onSend={handleSend}
          onStop={stopRequest}
          isLoading={isLoading}
        />
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSettingsSave}
      />

      <style>{`
        .task-pane {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .header {
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
        }
        
        .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .header-actions {
          display: flex;
          gap: 4px;
        }
        
        .icon-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: #666;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .icon-btn:hover:not(:disabled) {
          background: #f5f5f5;
          color: #333;
        }
        
        .icon-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: #fef2f2;
          border-bottom: 1px solid #fecaca;
          color: #dc2626;
          font-size: 13px;
        }
        
        .error-banner button {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          line-height: 1;
        }
        
        .input-area {
          border-top: 1px solid #eee;
          background: #fff;
        }
        
        .input-toolbar {
          padding: 12px 16px 0;
        }
      `}</style>
    </div>
  );
};
