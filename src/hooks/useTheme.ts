"use client";
import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext';

// Hook personalizado para usar o tema com funcionalidades extras
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  const { theme, toggleTheme } = context;

  // Funcionalidades extras do hook
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  
  const setTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark' || newTheme === 'light') {
      if (newTheme !== theme) {
        toggleTheme();
      }
    }
  };

  const getThemeClass = (baseClass = '') => {
    return baseClass ? `${baseClass} ${baseClass}--${theme}` : `theme-${theme}`;
  };

  const getThemeColors = () => {
    const colors = {
      light: {
        primary: '#772adc',
        secondary: '#3a8dde',
        background: '#ffffff',
        text: '#171717',
        surface: '#f8f9fa'
      },
      dark: {
        primary: '#a855f7',
        secondary: '#06b6d4',
        background: '#0a0a0a',
        text: '#ededed',
        surface: '#1a1a1a'
      }
    };
    return colors[theme as 'light' | 'dark'];
  };

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark,
    isLight,
    getThemeClass,
    getThemeColors
  };
};

export default useTheme;