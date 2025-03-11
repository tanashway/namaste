import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { FaPaw } from 'react-icons/fa';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 800px;
  z-index: 1;
`;

const CatImage = styled(motion.img)`
  width: 250px;
  height: auto;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    width: 180px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  background: ${props => props.theme.primary};
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  margin-top: 2rem;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.2);
  }
`;

const BackgroundCircle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  opacity: 0.1;
  z-index: 0;
`;

const CatPawPrints = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  color: ${props => props.color || props.theme.primary};
  opacity: 0.6;
  z-index: 0;
`;

const TypedText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);
  
  return <span>{displayText}</span>;
};

const Hero = () => {
  const { currentTheme } = useContext(ThemeContext);
  const isNamasteTheme = currentTheme.name === 'namaste';
  
  const floatAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const circles = [
    { size: 300, x: '10%', y: '20%', delay: 0 },
    { size: 200, x: '70%', y: '15%', delay: 0.5 },
    { size: 150, x: '25%', y: '60%', delay: 1 },
    { size: 250, x: '80%', y: '70%', delay: 1.5 },
  ];

  // Cat paw prints positions for Namaste theme
  const pawPrints = [
    { top: '20%', left: '15%', rotate: 15 },
    { top: '30%', right: '20%', rotate: -20 },
    { top: '50%', left: '25%', rotate: 30 },
    { top: '70%', right: '15%', rotate: -15 },
    { top: '85%', left: '40%', rotate: 10 },
  ];

  return (
    <HeroSection>
      {circles.map((circle, index) => (
        <BackgroundCircle
          key={index}
          theme={currentTheme}
          style={{
            width: circle.size,
            height: circle.size,
            left: circle.x,
            top: circle.y
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ 
            duration: 1.5, 
            delay: circle.delay,
            ease: "easeOut"
          }}
        />
      ))}
      
      {isNamasteTheme && pawPrints.map((paw, index) => (
        <CatPawPrints
          key={`paw-${index}`}
          theme={currentTheme}
          style={{
            top: paw.top,
            left: paw.left,
            right: paw.right,
            rotate: `${paw.rotate}deg`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.5
          }}
        >
          <FaPaw />
        </CatPawPrints>
      ))}
      
      <HeroContent
        as={motion.div}
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <CatImage 
          src={currentTheme.logoImage} 
          alt="Namaste Cat" 
          variants={floatAnimation}
          animate="animate"
        />
        
        <HeroTitle
          variants={fadeInUp}
        >
          <TypedText text={isNamasteTheme ? "Meow to Namaste" : "Welcome to Namaste"} />
        </HeroTitle>
        
        <HeroSubtitle
          variants={fadeInUp}
        >
          {isNamasteTheme ? "The purr-fectly zen meme token on Cardano" : "The chillest meme token on Cardano"}
        </HeroSubtitle>
        
        <CTAButton
          href="https://linktr.ee/namastecardano"
          target="_blank"
          rel="noopener noreferrer"
          theme={currentTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isNamasteTheme ? "Explore Meowmaste" : "Explore Namaste"}
        </CTAButton>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero; 