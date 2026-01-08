// src/App.jsx
// App layout (Arabic / RTL) + providers //

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [loading, setLoading] = useState(true);

  // Arabic + RTL
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.body.setAttribute("dir", "rtl");
    document.body.classList.add("rtl");
    document.body.classList.remove("ltr");
  }, []);

  // Splash loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen flex flex-col bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
    </AuthProvider>
  );
}

export default App;
