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
  const { saveThemePreference } = useThemeToggler();
  return (
    <div>
      <button onClick={() => saveThemePreference("dark")}>Dark Theme</button>
      <button onClick={() => saveThemePreference("light")}>Light Theme</button>
      <button onClick={() => saveThemePreference("low-contrast")}>
        Low Contrast
      </button>
      <button onClick={() => saveThemePreference("high-contrast")}>
        High Contrast
      </button>
      <button onClick={() => saveThemePreference("system")}>
        System Default
      </button>
    </div>
  );
}
