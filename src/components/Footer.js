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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FooterDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.8;
`;

const FooterTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 30px;
    height: 2px;
    background-color: ${props => props.theme.primary};
    
    @media (max-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled(motion.a)`
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
    color: ${props => props.theme.primary};
  }
`;

const Copyright = styled.div`
  margin-top: 3rem;
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
        <FooterSection>
          <FooterLogo>
            <img src={currentTheme.logoImage} alt="Namaste Logo" />
            <span>Namaste</span>
          </FooterLogo>
          <FooterDescription>
            The chillest meme token on Cardano, bringing mindfulness and zen to the crypto space. Join our community and embrace the peaceful way of crypto.
          </FooterDescription>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle theme={currentTheme}>Quick Links</FooterTitle>
          <FooterLinks>
            <li>
              <FooterLink 
                href="#about" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                About Us
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#features" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Features
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#tokenomics" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Tokenomics
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#community" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Community
              </FooterLink>
            </li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle theme={currentTheme}>Resources</FooterTitle>
          <FooterLinks>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Whitepaper
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Documentation
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                FAQs
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Roadmap
              </FooterLink>
            </li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle theme={currentTheme}>Legal</FooterTitle>
          <FooterLinks>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Terms of Service
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Privacy Policy
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Disclaimer
              </FooterLink>
            </li>
            <li>
              <FooterLink 
                href="#" 
                theme={currentTheme}
                whileHover={{ x: 5 }}
              >
                Cookie Policy
              </FooterLink>
            </li>
          </FooterLinks>
        </FooterSection>
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