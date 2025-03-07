import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';
import { FaTwitter, FaTelegram, FaDiscord, FaReddit, FaMedium } from 'react-icons/fa';

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

const NewsletterContainer = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
  background-color: ${props => props.theme.background};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const NewsletterTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const NewsletterDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid ${props => props.theme.secondary};
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${props => props.theme.primary};
  }
`;

const SubscribeButton = styled(motion.button)`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.color};
  }
`;

const socialLinks = [
  {
    name: "Twitter",
    icon: <FaTwitter />,
    url: "#",
    color: "#1DA1F2"
  },
  {
    name: "Telegram",
    icon: <FaTelegram />,
    url: "#",
    color: "#0088cc"
  },
  {
    name: "Discord",
    icon: <FaDiscord />,
    url: "#",
    color: "#7289DA"
  },
  {
    name: "Reddit",
    icon: <FaReddit />,
    url: "#",
    color: "#FF4500"
  },
  {
    name: "Medium",
    icon: <FaMedium />,
    url: "#",
    color: "#00AB6C"
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert("Thank you for subscribing to our newsletter!");
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
          Become part of the Namaste family and connect with like-minded individuals who share our values of mindfulness, positivity, and community. Follow us on social media to stay updated on the latest news and developments.
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
        
        <NewsletterContainer
          theme={currentTheme}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NewsletterTitle>Subscribe to Our Newsletter</NewsletterTitle>
          <NewsletterDescription>
            Stay up to date with the latest news, updates, and announcements from the Namaste team.
          </NewsletterDescription>
          <NewsletterForm onSubmit={handleSubmit}>
            <NewsletterInput 
              type="email" 
              placeholder="Enter your email" 
              required 
              theme={currentTheme}
            />
            <SubscribeButton 
              type="submit" 
              theme={currentTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </SubscribeButton>
          </NewsletterForm>
        </NewsletterContainer>
      </ContentContainer>
    </CommunitySection>
  );
};

export default Community; 