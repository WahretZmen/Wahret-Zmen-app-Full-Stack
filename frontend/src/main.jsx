// src/main.jsx

/* =========================================================
   🧱 Core React / App Imports
   - Keep App-level styles and i18n init early
========================================================= */
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; // (Imported but routing renders <RouterProvider/>)
import "./index.css";
import "../src/i18n.js"; // Ensure i18n is initialized before render

/* =========================================================
   🌐 Routing
========================================================= */
import { RouterProvider } from "react-router-dom";
import router from "./routers/router.jsx";

/* =========================================================
   🎨 Global Styles (3rd-party)
========================================================= */
import "bootstrap/dist/css/bootstrap.min.css";

/* =========================================================
   🗃️ State Management (Redux + Persist)
========================================================= */
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

/* =========================================================
   🪪 Head Management
========================================================= */
import { HelmetProvider } from "react-helmet-async";

/* =========================================================
   🛡️ Soft-Handle `removeChild` Errors
   - Filters known noisy runtime errors without crashing UX
   - Does NOT alter app logic; only suppresses specific logs
========================================================= */
const isRemoveChildError = (message) =>
  typeof message === "string" && message.includes("removeChild");

window.addEventListener("error", (event) => {
  if (isRemoveChildError(event.message)) {
    event.preventDefault();
    console.warn("⚡ Soft-handled removeChild error:", event.message);
  }
});

window.addEventListener("unhandledrejection", (event) => {
  if (event.reason?.message && isRemoveChildError(event.reason.message)) {
    event.preventDefault();
    console.warn(
      "⚡ Soft-handled Promise rejection (removeChild):",
      event.reason.message
    );
  }
});

// Wrap console methods to hide only targeted noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (args.some((arg) => isRemoveChildError(arg))) return;
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (args.some((arg) => isRemoveChildError(arg))) return;
  originalConsoleWarn(...args);
};

/* =========================================================
   🚀 Render App
   - Provider → PersistGate → HelmetProvider → Suspense → Router
   - Keep structure identical to your original (no logic changes)
========================================================= */
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <Suspense fallback={<div className="text-center py-10">Loading Wahret Zmen...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
