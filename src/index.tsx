import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as Sentry from '@sentry/react';

// Initialize Sentry for frontend error monitoring
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  enabled: !!process.env.REACT_APP_SENTRY_DSN,
  // Adjust sample rates as needed for performance and replay (optional)
  tracesSampleRate: 0.2,
  release: process.env.REACT_APP_SENTRY_RELEASE,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<div>Something went wrong. Please refresh.</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
