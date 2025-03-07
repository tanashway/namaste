import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';
import { FaYinYang, FaHandHoldingHeart, FaUsers, FaShieldAlt } from 'react-icons/fa';

const FeaturesSection = styled.section`
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

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: ${props => props.theme.background};
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.theme.primary}22, transparent);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover:before {
    opacity: 1;
  }
`;

const IconContainer = styled(motion.div)`
  font-size: 3rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1.5rem;
  background-color: ${props => props.theme.secondary};
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const FeatureDetails = styled(motion.div)`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
  
  ${FeatureCard}:hover & {
    max-height: 200px;
  }
`;

const featuresData = [
  {
    icon: <FaYinYang />,
    title: "Mindful Tokenomics",
    description: "A balanced approach to token distribution and utility.",
    details: "Our tokenomics are designed with sustainability in mind. With a focus on long-term growth rather than short-term gains, we've created a token that rewards patience and community participation."
  },
  {
    icon: <FaHandHoldingHeart />,
    title: "Community Governance",
    description: "Your voice matters in the Namaste ecosystem.",
    details: "Token holders can participate in key decisions through our governance system. We believe in the wisdom of the community and value every voice in shaping the future of Namaste."
  },
  {
    icon: <FaUsers />,
    title: "Zen Community",
    description: "Join a community that values peace and positivity.",
    details: "Our community is built on principles of respect, support, and shared growth. We're creating a space where members can learn, share, and grow together in their crypto journey."
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure & Transparent",
    description: "Built on Cardano for reliability and transparency.",
    details: "We've chosen Cardano for its security, scalability, and environmental sustainability. All our smart contracts are audited and our operations are fully transparent to the community."
  }
];

const Features = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <FeaturesSection id="features" theme={currentTheme} ref={ref}>
      <TitleContainer>
        <SectionTitle
          theme={currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          What We Offer
        </SectionTitle>
      </TitleContainer>
      
      <FeaturesContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {featuresData.map((feature, index) => (
          <FeatureCard 
            key={index} 
            theme={currentTheme}
            variants={itemVariants}
            whileHover={{ y: -10 }}
          >
            <IconContainer 
              theme={currentTheme}
              variants={iconVariants}
            >
              {feature.icon}
            </IconContainer>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
            <FeatureDetails>
              {feature.details}
            </FeatureDetails>
          </FeatureCard>
        ))}
      </FeaturesContainer>
    </FeaturesSection>
  );
};

export default Features; 