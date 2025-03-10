import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon, FaYinYang, FaPaw } from 'react-icons/fa';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${props => props.theme.navBackground};
  backdrop-filter: blur(8px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  cursor: pointer;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  position: relative;
  font-weight: 500;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: ${props => props.theme.primary};
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.navBackground};
  backdrop-filter: blur(8px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const MobileNavLink = styled(motion.a)`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ConnectButton = styled(motion.button)`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(97, 218, 251, 0.4);
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ThemeButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  font-size: 1.2rem;
  opacity: ${props => props.active ? 1 : 0.5};
  position: relative;
  
  &:hover {
    opacity: 1;
  }
`;

const CatPawIndicator = styled(motion.span)`
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 0.8rem;
  color: ${props => props.theme.accent};
`;

const Navbar = () => {
  const { currentTheme, changeTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isNamasteTheme = currentTheme.name === 'namaste';
  
  // Track scroll for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <NavContainer theme={currentTheme} style={{ 
      backgroundColor: scrolled ? currentTheme.navBackground : 'transparent',
      boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'
    }}>
      <Logo 
        variants={logoVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <img src={currentTheme.logoImage} alt="Namaste Logo" />
        <span>{isNamasteTheme ? "Meowmaste" : "Namaste"}</span>
      </Logo>
      
      <NavLinks theme={currentTheme}>
        <NavLink 
          href="#about" 
          theme={currentTheme}
          whileHover={{ y: -2 }}
        >
          {isNamasteTheme ? "Meow-bout" : "About"}
        </NavLink>
        <NavLink 
          href="#features" 
          theme={currentTheme}
          whileHover={{ y: -2 }}
        >
          {isNamasteTheme ? "Paw-tures" : "Features"}
        </NavLink>
        <NavLink 
          href="#tokenomics" 
          theme={currentTheme}
          whileHover={{ y: -2 }}
        >
          {isNamasteTheme ? "Token-meow-mics" : "Tokenomics"}
        </NavLink>
        <NavLink 
          href="#community" 
          theme={currentTheme}
          whileHover={{ y: -2 }}
        >
          {isNamasteTheme ? "Cat-munity" : "Community"}
        </NavLink>
      </NavLinks>
      
      <ButtonGroup>
        <ThemeToggle>
          <ThemeButton 
            theme={currentTheme}
            active={currentTheme.name === 'light'}
            onClick={() => changeTheme('light')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSun />
          </ThemeButton>
          <ThemeButton 
            theme={currentTheme}
            active={currentTheme.name === 'dark'}
            onClick={() => changeTheme('dark')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaMoon />
          </ThemeButton>
          <ThemeButton 
            theme={currentTheme}
            active={currentTheme.name === 'namaste'}
            onClick={() => changeTheme('namaste')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaYinYang />
            {currentTheme.name === 'namaste' && (
              <CatPawIndicator 
                theme={currentTheme}
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaPaw />
              </CatPawIndicator>
            )}
          </ThemeButton>
        </ThemeToggle>
        
        <ConnectButton 
          theme={currentTheme}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isNamasteTheme ? "Connect Paw-let" : "Connect Wallet"}
        </ConnectButton>
        
        <MobileMenuButton 
          theme={currentTheme} 
          onClick={toggleMenu}
        >
          {isOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </ButtonGroup>
      
      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            theme={currentTheme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MobileNavLink 
              href="#about" 
              theme={currentTheme}
              onClick={() => setIsOpen(false)}
              whileHover={{ x: 5 }}
            >
              {isNamasteTheme ? "Meow-bout" : "About"}
            </MobileNavLink>
            <MobileNavLink 
              href="#features" 
              theme={currentTheme}
              onClick={() => setIsOpen(false)}
              whileHover={{ x: 5 }}
            >
              {isNamasteTheme ? "Paw-tures" : "Features"}
            </MobileNavLink>
            <MobileNavLink 
              href="#tokenomics" 
              theme={currentTheme}
              onClick={() => setIsOpen(false)}
              whileHover={{ x: 5 }}
            >
              {isNamasteTheme ? "Token-meow-mics" : "Tokenomics"}
            </MobileNavLink>
            <MobileNavLink 
              href="#community" 
              theme={currentTheme}
              onClick={() => setIsOpen(false)}
              whileHover={{ x: 5 }}
            >
              {isNamasteTheme ? "Cat-munity" : "Community"}
            </MobileNavLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default Navbar; 