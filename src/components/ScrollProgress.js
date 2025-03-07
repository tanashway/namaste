import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { FaPaw, FaCat } from 'react-icons/fa';

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: ${props => props.theme.primary};
  transform-origin: 0%;
  z-index: 1001;
`;

const PawIndicator = styled(motion.div)`
  position: fixed;
  top: 10px;
  color: ${props => props.theme.primary};
  font-size: 1.5rem;
  z-index: 1001;
`;

const CatIndicator = styled(motion.div)`
  position: fixed;
  top: 10px;
  color: ${props => props.theme.primary};
  font-size: 2rem;
  z-index: 1001;
  transform-origin: center bottom;
`;

const ScrollProgress = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const updateScrollPercentage = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / scrollHeight) * 100;
      setScrollPercentage(percentage);
    };

    window.addEventListener('scroll', updateScrollPercentage);
    return () => window.removeEventListener('scroll', updateScrollPercentage);
  }, []);

  // Use cat indicator for Namaste theme, paw for others
  const isNamasteTheme = currentTheme.name === 'namaste';

  return (
    <>
      <ProgressBar 
        style={{ scaleX }} 
        theme={currentTheme} 
      />
      
      {isNamasteTheme ? (
        <CatIndicator 
          theme={currentTheme}
          style={{ 
            left: `${scrollPercentage}%`,
            transform: 'translateX(-50%)'
          }}
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaCat />
        </CatIndicator>
      ) : (
        <PawIndicator 
          theme={currentTheme}
          style={{ 
            left: `${scrollPercentage}%`,
            transform: 'translateX(-50%)'
          }}
          animate={{
            y: [0, -5, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaPaw />
        </PawIndicator>
      )}
    </>
  );
};

export default ScrollProgress; 