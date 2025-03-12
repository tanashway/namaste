import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  padding: 3rem 2rem;
  background-color: ${props => props.theme.background};
  border-top: 1px solid ${props => props.theme.secondary};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  justify-content: center;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const FooterDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
`;

const Copyright = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.secondary};
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const HeartIcon = styled(motion.span)`
  color: ${props => props.theme.accent};
  display: inline-flex;
`;

const Footer = () => {
  const { currentTheme } = useContext(ThemeContext);
  
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer theme={currentTheme}>
      <FooterContent>
        <FooterLogo>
          <img src={currentTheme.logoImage} alt="Namaste Logo" />
          <span>Namaste</span>
        </FooterLogo>
        <FooterDescription>
          The chillest meme token on Cardano, bringing mindfulness and zen to the crypto space. Join our community and embrace the peaceful way of crypto.
        </FooterDescription>
      </FooterContent>
      
      <Copyright>
        <span>© {currentYear} Namaste Token. All rights reserved. Made with</span>
        <HeartIcon 
          theme={currentTheme}
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        >
          <FaHeart />
        </HeartIcon>
        <span>and mindfulness.</span>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 