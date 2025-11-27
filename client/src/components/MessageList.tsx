import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <p>Выберите режим и отправьте запрос</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="message-list" ref={listRef}>
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.role}`}>
          {message.role === 'user' ? (
            <div className="user-block">
              <div className="user-message">
                {message.content}
              </div>
              {message.contextInfo && (
                <div className="context-preview">
                  {message.contextInfo}
                </div>
              )}
            </div>
          ) : (
            <div className="assistant-message">
              <Markdown>{message.content}</Markdown>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="message assistant">
          <div className="assistant-message loading">
            <div className="loading-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <style>{styles}</style>
    </div>
  );
};

const styles = `
  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .message-list.empty {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .empty-state {
    text-align: center;
    color: #999;
  }
  
  .empty-state p {
    font-size: 14px;
  }
  
  .message {
    margin-bottom: 16px;
  }
  
  .message:last-child {
    margin-bottom: 0;
  }
  
  .user-block {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }
  
  .user-message {
    max-width: 85%;
    padding: 10px 16px;
    background: #f3f4f6;
    border-radius: 16px;
    font-size: 14px;
    color: #333;
  }
  
  .context-preview {
    max-width: 85%;
    padding: 8px 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 12px;
    color: #6b7280;
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  .assistant-message {
    clear: both;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
  }
  
  .assistant-message.loading {
    padding: 12px 0;
  }
  
  .loading-indicator {
    display: flex;
    gap: 4px;
  }
  
  .loading-indicator span {
    width: 8px;
    height: 8px;
    background: #ccc;
    border-radius: 50%;
    animation: pulse 1.4s infinite ease-in-out;
  }
  
  .loading-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .loading-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes pulse {
    0%, 80%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    40% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Markdown styles */
  .assistant-message h1,
  .assistant-message h2,
  .assistant-message h3,
  .assistant-message h4 {
    margin: 16px 0 8px 0;
    font-weight: 600;
    color: #111;
  }
  
  .assistant-message h1:first-child,
  .assistant-message h2:first-child,
  .assistant-message h3:first-child {
    margin-top: 0;
  }
  
  .assistant-message h2 {
    font-size: 18px;
  }
  
  .assistant-message h3 {
    font-size: 16px;
  }
  
  .assistant-message h4 {
    font-size: 14px;
  }
  
  .assistant-message p {
    margin: 0 0 12px 0;
  }
  
  .assistant-message p:last-child {
    margin-bottom: 0;
  }
  
  .assistant-message strong {
    font-weight: 600;
  }
  
  .assistant-message ul,
  .assistant-message ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  .assistant-message li {
    margin: 4px 0;
  }
  
  .assistant-message li p {
    margin: 0;
    display: inline;
  }
  
  .assistant-message code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
  }
  
  .assistant-message pre {
    background: #f3f4f6;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 12px 0;
  }
  
  .assistant-message pre code {
    background: none;
    padding: 0;
  }
  
  .assistant-message blockquote {
    border-left: 3px solid #ddd;
    margin: 12px 0;
    padding-left: 12px;
    color: #666;
  }
`;
