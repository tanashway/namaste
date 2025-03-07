import React, { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { FaPaw, FaCat } from 'react-icons/fa';

// Cat frame animation
const pawPrintAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-800px) rotate(360deg);
    opacity: 0;
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const wiggleEarsAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

// Frame container
const FrameContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
`;

// Top frame with cat ears
const TopFrame = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${props => props.theme.catFrameWidth};
  background-color: ${props => props.theme.catFrameColor};
  z-index: 9999;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: -20px;
    width: 40px;
    height: 40px;
    background-color: ${props => props.theme.catFrameColor};
    border-radius: 50% 50% 0 0;
    z-index: 9999;
    animation: ${wiggleEarsAnimation} 3s infinite;
  }
  
  &:before {
    left: 20px;
    transform-origin: bottom left;
  }
  
  &:after {
    right: 20px;
    transform-origin: bottom right;
  }
`;

// Bottom frame with tail
const BottomFrame = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.theme.catFrameWidth};
  background-color: ${props => props.theme.catFrameColor};
  z-index: 9999;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 30px;
    width: 60px;
    height: 80px;
    border-radius: 50% 50% 0 0;
    border: 10px solid ${props => props.theme.catFrameColor};
    border-bottom: none;
    transform-origin: bottom center;
    animation: ${wiggleEarsAnimation} 5s infinite;
  }
`;

// Left frame
const LeftFrame = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${props => props.theme.catFrameWidth};
  background-color: ${props => props.theme.catFrameColor};
  z-index: 9999;
`;

// Right frame
const RightFrame = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: ${props => props.theme.catFrameWidth};
  background-color: ${props => props.theme.catFrameColor};
  z-index: 9999;
`;

// Floating cat elements
const FloatingCat = styled(motion.div)`
  position: fixed;
  font-size: 2rem;
  color: ${props => props.theme.catPawColor};
  opacity: 0.7;
  z-index: 9998;
  pointer-events: none;
  animation: ${floatAnimation} ${props => props.duration || '6s'} infinite ease-in-out;
`;

// Falling paw prints
const PawPrint = styled.div`
  position: fixed;
  color: ${props => props.theme.catPawColor};
  font-size: 1.5rem;
  opacity: 0.5;
  z-index: 9997;
  pointer-events: none;
  animation: ${pawPrintAnimation} ${props => props.duration || '10s'} linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  left: ${props => props.left || '10%'};
`;

const CatThemeElements = () => {
  const { currentTheme } = useContext(ThemeContext);
  
  // Only render if in Namaste theme
  if (!currentTheme.showCatFrame && !currentTheme.showCatElements) {
    return null;
  }
  
  // Generate random positions for floating cats
  const floatingCats = [
    { top: '15%', left: '5%', duration: '7s', rotate: 15 },
    { top: '25%', right: '8%', duration: '9s', rotate: -10 },
    { top: '60%', left: '7%', duration: '8s', rotate: 5 },
    { top: '75%', right: '10%', duration: '6s', rotate: -5 },
  ];
  
  // Generate random positions for falling paw prints
  const pawPrints = [
    { left: '10%', delay: '0s', duration: '10s' },
    { left: '25%', delay: '2s', duration: '12s' },
    { left: '40%', delay: '5s', duration: '9s' },
    { left: '60%', delay: '1s', duration: '11s' },
    { left: '75%', delay: '3s', duration: '13s' },
    { left: '90%', delay: '6s', duration: '8s' },
  ];

  return (
    <>
      {currentTheme.showCatFrame && (
        <FrameContainer>
          <TopFrame theme={currentTheme} />
          <BottomFrame theme={currentTheme} />
          <LeftFrame theme={currentTheme} />
          <RightFrame theme={currentTheme} />
        </FrameContainer>
      )}
      
      {currentTheme.showCatElements && (
        <>
          {floatingCats.map((cat, index) => (
            <FloatingCat
              key={index}
              theme={currentTheme}
              style={{
                top: cat.top,
                left: cat.left,
                right: cat.right,
                animationDuration: cat.duration
              }}
              animate={{ rotate: [0, cat.rotate, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              <FaCat />
            </FloatingCat>
          ))}
          
          {pawPrints.map((paw, index) => (
            <PawPrint
              key={index}
              theme={currentTheme}
              left={paw.left}
              delay={paw.delay}
              duration={paw.duration}
            >
              <FaPaw />
            </PawPrint>
          ))}
        </>
      )}
    </>
  );
};

export default CatThemeElements; 