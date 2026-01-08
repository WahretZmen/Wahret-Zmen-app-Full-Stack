// src/main.jsx
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import router from "./routers/router.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

import { HelmetProvider } from "react-helmet-async";

const isRemoveChildError = (message) =>
  typeof message === "string" && message.includes("removeChild");

window.addEventListener("error", (event) => {
  if (isRemoveChildError(event.message)) {
    event.preventDefault();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  if (event.reason?.message && isRemoveChildError(event.reason.message)) {
    event.preventDefault();
  }
});

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

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <Suspense fallback={<div style={{ padding: 24, textAlign: "center" }}>جاري التحميل...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </HelmetProvider>
    </PersistGate>
  </Provider>
);
