import React, { createContext, useState, useEffect } from "react";

type ThemeContextType = {
  theme: string;
  toggleColorMode: () => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const getInitialTheme = (): string => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme;

  return "light";
};

const defaultContext: ThemeContextType = {
  theme: "light",
  toggleColorMode: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(getInitialTheme());
  const themes = ["light", "dark", "blue"];

  useEffect(
    function setThemeToStorage() {
      localStorage.setItem("theme", theme);
    },
    [theme],
  );

  function toggleColorMode() {
    const themeIndex = themes.indexOf(theme);
    if (themeIndex === themes.length - 1) return setTheme(themes[0]);
    else {
      return setTheme(themes[themeIndex + 1]);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
