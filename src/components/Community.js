import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import { FaLink } from 'react-icons/fa';

const CommunitySection = styled.section`
  padding: 6rem 2rem;
  background-color: ${props => props.theme.secondary};
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.theme.primary};
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 3rem;
`;

const SocialLinksContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.text};
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const SocialIcon = styled.div`
  font-size: 2.5rem;
  background-color: ${props => props.theme.background};
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  ${SocialLink}:hover & {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    background-color: ${props => props.theme.primary};
    color: white;
  }
`;

const SocialName = styled.span`
  font-weight: 500;
`;

const socialLinks = [
  {
    name: "X.com",
    icon: <FaTwitter />,
    url: "https://x.com/namastecardano",
    color: "#1DA1F2"
  },
  {
    name: "Discord",
    icon: <FaDiscord />,
    url: "https://discord.gg/7ZyWUGaYJF",
    color: "#7289DA"
  },
  {
    name: "Linktr.ee",
    icon: <FaLink />,
    url: "https://linktr.ee/namastecardano",
    color: "#43e660"
  }
];

const Community = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <CommunitySection id="community" theme={currentTheme} ref={ref}>
      <TitleContainer>
        <SectionTitle
          theme={currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Join Our Community
        </SectionTitle>
      </TitleContainer>
      
      <ContentContainer>
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Join the Namaste party on X for chill vibes, or hop into the Discord to connect. Check out our Linktr.ee for all important links and resources. Grab your Namaste tokens and rise with us!
        </Description>
        
        <SocialLinksContainer
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {socialLinks.map((link, index) => (
            <SocialLink 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              theme={currentTheme}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SocialIcon theme={currentTheme}>
                {link.icon}
              </SocialIcon>
              <SocialName>{link.name}</SocialName>
            </SocialLink>
          ))}
        </SocialLinksContainer>
      </ContentContainer>
    </CommunitySection>
  );
};

export default Community; 