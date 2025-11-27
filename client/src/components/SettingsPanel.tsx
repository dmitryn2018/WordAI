import React, { useState, useEffect } from 'react';
import { Settings, DEFAULT_SETTINGS } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Настройки</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <label htmlFor="llmModel">Модель</label>
            <input
              id="llmModel"
              type="text"
              value={localSettings.llmModel}
              onChange={(e) => setLocalSettings({ ...localSettings, llmModel: e.target.value })}
              placeholder="gpt-4o-mini"
            />
          </div>
          
          <div className="setting-group">
            <label htmlFor="maxContextChars">Макс. символов контекста</label>
            <input
              id="maxContextChars"
              type="number"
              min={1000}
              max={50000}
              step={1000}
              value={localSettings.maxContextChars}
              onChange={(e) => setLocalSettings({ 
                ...localSettings, 
                maxContextChars: parseInt(e.target.value) || DEFAULT_SETTINGS.maxContextChars 
              })}
            />
          </div>
          
          <div className="setting-group">
            <label className="checkbox-setting">
              <input
                type="checkbox"
                checked={localSettings.legalStyleEnabled}
                onChange={(e) => setLocalSettings({ 
                  ...localSettings, 
                  legalStyleEnabled: e.target.checked 
                })}
              />
              <span>Юридический стиль</span>
            </label>
          </div>
        </div>
        
        <div className="settings-footer">
          <button className="btn-secondary" onClick={handleReset}>
            Сбросить
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
      
      <style>{`
        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.15s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .settings-panel {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 340px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .settings-header h2 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: #111;
        }
        
        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        
        .close-btn:hover {
          background: #f5f5f5;
          color: #333;
        }
        
        .settings-content {
          padding: 20px;
        }
        
        .setting-group {
          margin-bottom: 16px;
        }
        
        .setting-group:last-child {
          margin-bottom: 0;
        }
        
        .setting-group > label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }
        
        .setting-group input[type="text"],
        .setting-group input[type="number"] {
          width: 100%;
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.15s;
        }
        
        .setting-group input:focus {
          border-color: #333;
        }
        
        .checkbox-setting {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        
        .checkbox-setting input {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #333;
        }
        
        .checkbox-setting span {
          font-size: 14px;
          color: #333;
        }
        
        .settings-footer {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid #eee;
        }
        
        .btn-primary,
        .btn-secondary {
          flex: 1;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }
        
        .btn-primary {
          background: #333;
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background: #000;
        }
        
        .btn-secondary {
          background: white;
          color: #333;
          border: 1px solid #e5e5e5;
        }
        
        .btn-secondary:hover {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
};
