import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Tokenomics from './components/Tokenomics';
import Community from './components/Community';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CatThemeElements from './components/CatThemeElements';
import FloatingChat from './components/FloatingChat';

const AppContainer = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 100vh;
`;

function App() {
  const { currentTheme } = useContext(ThemeContext);

  // Track scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      // We're keeping the event listener but not using the scrollY value
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppContainer theme={currentTheme}>
      <CatThemeElements />
      <Navbar />
      <ScrollProgress />
      <Hero />
      <About />
      <Features />
      <Tokenomics />
      <Community />
      <Footer />
      <FloatingChat />
    </AppContainer>
  );
}

export default App; 