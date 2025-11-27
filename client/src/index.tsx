import React from 'react';
import ReactDOM from 'react-dom/client';
import { TaskPane } from './components/TaskPane';

/* global Office */

Office.onReady((info: { host: Office.HostType | null }) => {
  if (info.host === Office.HostType.Word) {
    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(
      <React.StrictMode>
        <TaskPane />
      </React.StrictMode>
    );
  }
});

