import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import './index.css';
import { store } from './store';
import './utils/globalApiInterceptor';
import App from './App';
import { SocketProvider } from './contexts/socketContext';

polyfillCountryFlagEmojis();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SocketProvider>
  </React.StrictMode>
);
