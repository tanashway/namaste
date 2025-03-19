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
    answer: "Namaste Token is the chillest meme coin in the Cardano ecosystem, delivering good vibes and big dreams to the blockchain. Born from the belief that crypto can ditch the stress, we mix mindfulness, memes, and moonshots."
  },
  {
    question: "How can I buy Namaste Token?",
    answer: "Set up a Tokeo or Vesper wallet, Buy some $ADA, Head to SNEK.fun to grab Namaste Token on Cardano."
  },
  {
    question: "What makes Namaste different from other meme tokens?",
    answer: "Unlike chaotic meme coins, Namaste blends mindfulness with moonshots. Built on Cardano's eco-network and launched on SNEK.fun, we bring calm vibes and gains."
  },
  {
    question: "How can I join the Namaste community?",
    answer: "Join the Namaste party on X for chill vibes, or hop into the Discord to connect. Grab your Namaaste tokens and rise with us!"
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
            Spawned from the chaos of crypto hype, Namaste Token rises like a zen middle finger to the noise. No screeching 'MOON' or sweaty FOMO here, just a crew of chill degenerates vibing on Cardano's eco-friendly blockchain. Forged in dank memes and a disdain for drama, it's the token that smirks while markets sob.
          </Paragraph>
          
          <Paragraph variants={itemVariants}>
            The mission? To slap stress into submission and stack tokens with a laid-back swagger. Picture trolls melting as Namaste flips their panic into peace, one savage quip at a time. We're not just green—we're the smoothest operators in the game, holding hard while others chase pumps like headless chickens.
          </Paragraph>
          
          <Paragraph variants={itemVariants}>
            Namaste Token isn't just a coin—it's a vibe, a tribe of meme-wielding monks proving you can thrive in this madhouse without losing your soul—or your sense of humor.
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