import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';

const TokenomicsSection = styled.section`
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

const TokenInfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled(motion.div)`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

const InfoTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};
`;

const InfoContent = styled.p`
  font-size: 1rem;
  line-height: 1.6;
`;

const ChartContainer = styled(motion.div)`
  position: relative;
`;

const PieChart = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.theme.primary} 0% 40%,
    ${props => props.theme.accent} 40% 60%,
    #9c88ff 60% 75%,
    #fbc531 75% 90%,
    #4cd137 90% 100%
  );
  margin: 0 auto;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background-color: ${props => props.theme.background};
    border-radius: 50%;
  }
`;

const ChartLabels = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ChartLabel = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const LabelColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background-color: ${props => props.color};
`;

const LabelText = styled.span`
  font-size: 1rem;
`;

const LabelPercentage = styled.span`
  font-weight: 600;
  margin-left: auto;
`;

const DetailBox = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.secondary};
  border-radius: 5px;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const tokenomicsData = [
  {
    title: "Total Supply",
    content: "1,000,000,000 NAMASTE tokens have been minted, with no ability to mint additional tokens."
  },
  {
    title: "Token Utility",
    content: "NAMASTE tokens can be used for governance voting, accessing premium community features, and participating in our staking rewards program."
  },
  {
    title: "Deflationary Mechanism",
    content: "A small percentage of each transaction is automatically burned, creating a deflationary effect that increases scarcity over time."
  }
];

const distributionData = [
  {
    label: "Community & Airdrops",
    percentage: "40%",
    color: "#61dafb",
    details: "40% of the total supply is allocated to community initiatives, airdrops, and rewards for active participation in the ecosystem."
  },
  {
    label: "Liquidity Pool",
    percentage: "20%",
    color: "#ff6b6b",
    details: "20% is locked in liquidity pools to ensure trading stability and reduce price volatility."
  },
  {
    label: "Development Fund",
    percentage: "15%",
    color: "#9c88ff",
    details: "15% is allocated to fund ongoing development, improvements, and new features for the Namaste ecosystem."
  },
  {
    label: "Marketing",
    percentage: "15%",
    color: "#fbc531",
    details: "15% is dedicated to marketing efforts, partnerships, and community growth initiatives."
  },
  {
    label: "Team & Advisors",
    percentage: "10%",
    color: "#4cd137",
    details: "10% is allocated to the team and advisors, with a vesting period to ensure long-term commitment."
  }
];

const Tokenomics = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [selectedDistribution, setSelectedDistribution] = useState(null);
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
  
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <TokenomicsSection id="tokenomics" ref={ref}>
      <TitleContainer>
        <SectionTitle
          theme={currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Tokenomics
        </SectionTitle>
      </TitleContainer>
      
      <ContentContainer>
        <TokenInfoContainer
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {tokenomicsData.map((item, index) => (
            <InfoCard 
              key={index} 
              theme={currentTheme}
              variants={itemVariants}
            >
              <InfoTitle theme={currentTheme}>{item.title}</InfoTitle>
              <InfoContent>{item.content}</InfoContent>
            </InfoCard>
          ))}
        </TokenInfoContainer>
        
        <ChartContainer
          variants={chartVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <PieChart theme={currentTheme} />
          
          <ChartLabels>
            {distributionData.map((item, index) => (
              <React.Fragment key={index}>
                <ChartLabel 
                  theme={currentTheme}
                  onClick={() => setSelectedDistribution(selectedDistribution === index ? null : index)}
                  whileHover={{ x: 5 }}
                >
                  <LabelColor color={item.color} />
                  <LabelText>{item.label}</LabelText>
                  <LabelPercentage>{item.percentage}</LabelPercentage>
                </ChartLabel>
                
                {selectedDistribution === index && (
                  <DetailBox
                    theme={currentTheme}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.details}
                  </DetailBox>
                )}
              </React.Fragment>
            ))}
          </ChartLabels>
        </ChartContainer>
      </ContentContainer>
    </TokenomicsSection>
  );
};

export default Tokenomics; 