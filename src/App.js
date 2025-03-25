import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Tokenomics from './components/Tokenomics';
import Community from './components/Community';
import Memes from './components/Memes';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CatThemeElements from './components/CatThemeElements';
import FloatingChat from './components/FloatingChat';
import { AuthProvider } from './context/AuthContext';
import { GlobalStyle } from './styles/GlobalStyle';

const AppContainerStyled = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
  min-height: 100vh;
`;

// Main page component
const MainPage = () => {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Tokenomics />
      <Community />
    </>
  );
};

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
    <ThemeProvider>
      <WalletProvider>
        <AuthProvider>
          <GlobalStyle />
          <Router>
            <AppContainerStyled>
              <CatThemeElements />
              <Navbar />
              <ScrollProgress />
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/memes" element={<Memes />} />
              </Routes>
              <Footer />
              <FloatingChat />
            </AppContainerStyled>
          </Router>
        </AuthProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App; 