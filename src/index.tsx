import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { server } from './_tosslib/server/browser';
import { BrowserRouter as Router } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';

server.start({ onUnhandledRequest: 'bypass' });

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NuqsAdapter>
      <Router>
        <App />
      </Router>
    </NuqsAdapter>
  </React.StrictMode>
);
