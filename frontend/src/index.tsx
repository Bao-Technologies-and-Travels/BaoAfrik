import React from 'react';
import ReactDOM from 'react-dom/client';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import './index.css';
import './utils/globalApiInterceptor';
import App from './App';
import { SocketProvider } from './contexts/socketContext';

// Show flag emojis as icons on Windows (instead of "US", "GB" etc.)
polyfillCountryFlagEmojis();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);
