import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'light' | 'dark' | 'nebula';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    try {
      const savedTheme = localStorage.getItem('nebulastock-theme');
      return (savedTheme as ThemeType) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nebulastock-theme', theme);
      
      document.body.classList.remove('dark-theme', 'nebula-theme');
      
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else if (theme === 'nebula') {
        document.body.classList.add('nebula-theme');
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }, [theme]);

  const contextValue = React.useMemo(() => ({
    theme,
    setTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};