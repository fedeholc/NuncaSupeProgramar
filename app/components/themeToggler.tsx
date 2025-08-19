"use client";

import { useEffect, useState, createContext, useContext } from "react";

// Context
const ThemeContext = createContext<
  | {
      theme: string;
      setTheme: (theme: string) => void;
      saveThemePreference: (theme: string) => void;
    }
  | undefined
>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>("light");

  async function saveThemePreference(newTheme: string) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    await fetch("/api/set-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    });
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute("data-theme", savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, saveThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeToggler() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeToggler must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeToggler() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;

  const { saveThemePreference } = useThemeToggler();
  const buttonStyle = {
    cursor: "pointer",
    padding: "0.3rem 0.7rem",
    fontSize: "0.9rem",
    borderRadius: "0.3rem",
  };
  let buttonSystemStyle = {};
  if (prefersDark) {
    buttonSystemStyle = {
      background: "var(--dark-th-background-color)",
      color: "var(--dark-th-text-color)",
      border: "2px dashed var(--dark-th-border-color)",
    };
  }
  if (prefersLight) {
    buttonSystemStyle = {
      background: "var(--light-th-background-color)",
      color: "var(--light-th-text-color)",
      border: "2px dashed var(--light-th-border-color)",
    };
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
      <button
        style={{
          ...buttonStyle,
          ...buttonSystemStyle,
        }}
        onClick={() => saveThemePreference("system")}
      >
        System Default
      </button>
      <button
        style={{
          ...buttonStyle,
          background: "var(--light-th-background-color)",
          color: "var(--light-th-text-color)",
          border: "2px solid var(--light-th-border-color)",
        }}
        onClick={() => saveThemePreference("light")}
      >
        Light Theme
      </button>
      <button
        style={{
          ...buttonStyle,
          background: "var(--lightlow-th-background-color)",
          color: "var(--lightlow-th-text-color)",
          border: "2px solid var(--lightlow-th-border-color)",
        }}
        onClick={() => saveThemePreference("low-contrast")}
      >
        Low Contrast
      </button>
      <button
        style={{
          ...buttonStyle,
          background: "var(--dark-th-background-color)",
          color: "var(--dark-th-text-color)",
          border: "2px solid var(--dark-th-border-color)",
        }}
        onClick={() => saveThemePreference("dark")}
      >
        Dark Theme
      </button>
      <button
        style={{
          ...buttonStyle,
          background: "var(--darkhigh-th-background-color)",
          color: "var(--darkhigh-th-text-color)",
          border: "2px solid var(--darkhigh-th-border-color)",
        }}
        onClick={() => saveThemePreference("high-contrast")}
      >
        High Contrast
      </button>
    </div>
  );
}
