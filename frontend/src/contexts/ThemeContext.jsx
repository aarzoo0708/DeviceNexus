import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Load saved theme from localStorage, default to 'dark' for first-time visitors
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("devicenexus_theme");
      return saved ? saved : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (themeName) => {
      let resolvedTheme = themeName;
      if (themeName === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        resolvedTheme = systemPrefersDark ? "dark" : "light";
      }

      root.setAttribute("data-theme", resolvedTheme);
      if (resolvedTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);

    try {
      localStorage.setItem("devicenexus_theme", theme);
    } catch (err) {
      console.warn("Could not save theme to localStorage:", err);
    }

    // If set to system, listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
