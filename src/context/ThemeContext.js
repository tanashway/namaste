import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Define theme colors
export const themes = {
  light: {
    name: 'light',
    background: '#ffffff',
    text: '#333333',
    primary: '#61dafb',
    secondary: '#f8f9fa',
    accent: '#ff6b6b',
    navBackground: 'rgba(255, 255, 255, 0.8)',
    cardBackground: '#f8f9fa',
    logoImage: '/transparent.png',
    showCatFrame: false,
    showCatElements: false
  },
  dark: {
    name: 'dark',
    background: '#121212',
    text: '#f1f1f1',
    primary: '#61dafb',
    secondary: '#1e1e1e',
    accent: '#ff6b6b',
    navBackground: 'rgba(30, 30, 30, 0.8)',
    cardBackground: '#1e1e1e',
    logoImage: '/black.png',
    showCatFrame: false,
    showCatElements: false
  },
  namaste: {
    name: 'namaste',
    background: '#61dafb',
    text: '#ffffff',
    primary: '#ffffff',
    secondary: '#4fa8c3',
    accent: '#ff6b6b',
    navBackground: 'rgba(97, 218, 251, 0.8)',
    cardBackground: '#4fa8c3',
    logoImage: '/transparent.png',
    showCatFrame: true,
    showCatElements: true,
    catFrameColor: '#ffffff',
    catFrameWidth: '15px',
    catPawColor: '#ffffff'
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user has a saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  const [currentTheme, setCurrentTheme] = useState(themes[savedTheme]);

  // Update theme
  const changeTheme = (themeName) => {
    setCurrentTheme(themes[themeName]);
    localStorage.setItem('theme', themeName);
  };

  // Apply theme to body
  useEffect(() => {
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.text;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
