// main.jsx
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/i18n.js';

import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.js'; // 🔁 import persistor
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react'; // 🔁 import PersistGate

/* ================================ */
/*    🛡️ Soft-Handle removeChild Errors */
/* ================================ */
const isRemoveChildError = (message) =>
  typeof message === 'string' && message.includes('removeChild');

window.addEventListener('error', (event) => {
  if (isRemoveChildError(event.message)) {
    event.preventDefault();
    console.warn('⚡ Soft-handled removeChild error:', event.message);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message && isRemoveChildError(event.reason.message)) {
    event.preventDefault();
    console.warn('⚡ Soft-handled Promise rejection (removeChild):', event.reason.message);
  }
});

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (args.some(arg => isRemoveChildError(arg))) return;
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (args.some(arg => isRemoveChildError(arg))) return;
  originalConsoleWarn(...args);
};

/* ================================ */
/*          🚀 Render App            */
/* ================================ */
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> {/* 🔁 Wrap here */}
      <HelmetProvider>
        <Suspense fallback={<div className="text-center py-10">Loading Wahret Zmen...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
