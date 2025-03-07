import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';
import { FaPlus, FaMinus } from 'react-icons/fa';

const AboutSection = styled.section`
  padding: 6rem 2rem;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AboutText = styled(motion.div)`
  font-size: 1.1rem;
  line-height: 1.8;
`;

const Paragraph = styled(motion.p)`
  margin-bottom: 1.5rem;
`;

const FAQContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled(motion.div)`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FAQQuestion = styled.div`
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 1.2rem;
  line-height: 1.6;
  font-size: 1rem;
  overflow: hidden;
`;

const AnswerContent = styled.div`
  padding-bottom: 1.2rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const faqData = [
  {
    question: "What is Namaste Token?",
    answer: "Namaste Token is a meme token on the Cardano blockchain that embodies the spirit of mindfulness and zen. It's a community-driven project that aims to bring a sense of calm and positivity to the crypto space."
  },
  {
    question: "How can I buy Namaste Token?",
    answer: "You can buy Namaste Token on decentralized exchanges that support Cardano tokens. Connect your wallet, swap ADA for Namaste, and join our peaceful community."
  },
  {
    question: "What makes Namaste different from other meme tokens?",
    answer: "Unlike many meme tokens that focus on hype and FOMO, Namaste promotes mindfulness, community, and long-term value. We're building a sustainable ecosystem with real utility and a focus on positive vibes."
  },
  {
    question: "Is there a whitepaper?",
    answer: "Yes, we have a comprehensive whitepaper that outlines our vision, tokenomics, roadmap, and utility. You can download it from our website or access it through our community channels."
  },
  {
    question: "How can I join the Namaste community?",
    answer: "You can join our community through our social media channels, Discord server, and Telegram group. We welcome everyone who shares our values of mindfulness and positivity."
  }
];

const About = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
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
    <AboutSection id="about" ref={ref}>
      <TitleContainer>
        <SectionTitle
          theme={currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          About Namaste
        </SectionTitle>
      </TitleContainer>
      
      <ContentContainer>
        <AboutText
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Paragraph variants={itemVariants}>
            Namaste Token is more than just a meme coin – it's a movement. Born from the idea that crypto doesn't have to be stressful, Namaste brings a sense of calm and mindfulness to the blockchain.
          </Paragraph>
          
          <Paragraph variants={itemVariants}>
            Our community values peace, positivity, and patience. In a market often driven by FOMO and anxiety, we're creating a space where holders can find balance and tranquility.
          </Paragraph>
          
          <Paragraph variants={itemVariants}>
            Built on Cardano, one of the most sustainable and environmentally friendly blockchains, Namaste Token aligns with our values of mindfulness and responsibility.
          </Paragraph>
          
          <Paragraph variants={itemVariants}>
            Join us on this journey as we build a community that celebrates the zen approach to crypto – where holding is a form of meditation, and every transaction is made with intention.
          </Paragraph>
        </AboutText>
        
        <FAQContainer
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {faqData.map((faq, index) => (
            <FAQItem 
              key={index} 
              theme={currentTheme}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <FAQQuestion onClick={() => toggleFAQ(index)}>
                {faq.question}
                <IconButton theme={currentTheme}>
                  {activeIndex === index ? <FaMinus /> : <FaPlus />}
                </IconButton>
              </FAQQuestion>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <FAQAnswer
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnswerContent>{faq.answer}</AnswerContent>
                  </FAQAnswer>
                )}
              </AnimatePresence>
            </FAQItem>
          ))}
        </FAQContainer>
      </ContentContainer>
    </AboutSection>
  );
};

export default About; 