import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/i18n.js'; // ✅ Load i18n before anything
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { HelmetProvider } from 'react-helmet-async';

/* ================================
   🛡️ Soft-Handle removeChild Errors
================================ */
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

/* ================================
   🚀 Render App
================================ */
createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
      <HelmetProvider>
        <Suspense fallback={<div className="text-center py-10">Loading Wahret Zmen...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </HelmetProvider>
    </Provider>
  
);
