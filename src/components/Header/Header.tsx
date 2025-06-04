import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Stars, Sparkles } from 'lucide-react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'nebula') => {
    setTheme(newTheme);
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Sparkles className={styles.logoIcon} />
        <h1 className={styles.logoText}>NebulaStock</h1>
      </div>
      
      <div className={styles.tagline}>
        AI-Powered Stock Market Forecaster
      </div>
      
      <div className={styles.themeToggle}>
        <button 
          className={`${styles.themeButton} ${theme === 'light' ? styles.active : ''}`}
          onClick={() => handleThemeChange('light')}
          aria-label="Light theme"
        >
          <Sun size={20} />
        </button>
        
        <button 
          className={`${styles.themeButton} ${theme === 'dark' ? styles.active : ''}`}
          onClick={() => handleThemeChange('dark')}
          aria-label="Dark theme"
        >
          <Moon size={20} />
        </button>
        
        <button 
          className={`${styles.themeButton} ${theme === 'nebula' ? styles.active : ''}`}
          onClick={() => handleThemeChange('nebula')}
          aria-label="Nebula theme"
        >
          <Stars size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;