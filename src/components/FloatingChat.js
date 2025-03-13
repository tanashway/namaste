import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { FaComment, FaPaperPlane, FaTimes, FaPaw } from 'react-icons/fa';

// Styled components for the chat widget
const ChatButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 350px;
  height: 450px;
  background-color: ${props => props.theme.background};
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  margin-bottom: 5px;
  word-break: break-word;
  
  ${props => props.$isUser ? `
    background-color: ${props.theme.primary};
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  ` : `
    background-color: ${props.theme.secondary};
    color: ${props.theme.text};
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  `}
`;

const ChatInputContainer = styled.form`
  display: flex;
  padding: 15px;
  border-top: 1px solid ${props => props.theme.secondary};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid ${props => props.theme.secondary};
  border-radius: 20px;
  outline: none;
  font-family: inherit;
  
  &:focus {
    border-color: ${props => props.theme.primary};
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  font-size: 1.2rem;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// N8N workflow URL - replace with your actual workflow webhook URL
const PRODUCTION_WEBHOOK_URL = 'https://n8n.lucidsro.com/webhook/d7419ab0-97d5-4493-b58f-3cbf3e2cca25';

// In development, we'll use a relative URL that will be proxied
// The proxy will forward this to the production webhook URL
const DEVELOPMENT_WEBHOOK_URL = '/n8n-webhook/d7419ab0-97d5-4493-b58f-3cbf3e2cca25';

// Test webhook URL - only works after clicking "Test workflow" in n8n
// eslint-disable-next-line no-unused-vars
const TEST_WEBHOOK_URL = 'https://n8n.lucidsro.com/webhook-test/d7419ab0-97d5-4493-b58f-3cbf3e2cca25';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Use the appropriate webhook URL based on environment
const N8N_WORKFLOW_URL = isDevelopment ? DEVELOPMENT_WEBHOOK_URL : PRODUCTION_WEBHOOK_URL;

// Set this to false to use the real webhook in development mode
const useSimulatedResponsesInDev = false;

// Log the current environment and webhook URL
// console.log('Chat environment:', process.env.NODE_ENV);
// console.log('Using webhook URL:', N8N_WORKFLOW_URL);
// console.log('Simulated responses enabled:', isDevelopment && useSimulatedResponsesInDev);

// Function to extract keywords from user input
const extractKeywords = (input) => {
  if (!input) return 'general';
  
  const text = input.toLowerCase().trim();
  
  // Define keyword categories with related terms
  const keywordCategories = {
    buy: ['buy', 'purchase', 'get', 'acquire', 'obtain', 'exchange', 'swap', 'trade', 'invest', 'ico', 'sale'],
    price: ['price', 'worth', 'value', 'cost', 'rate', 'market', 'trading', 'chart', 'exchange rate', 'ada', 'dollar', 'usd', 'eur', 'euro', 'money', 'expensive', 'cheap'],
    tokenomics: ['tokenomics', 'distribution', 'supply', 'allocation', 'total supply', 'circulating', 'max supply', 'token', 'percentage', 'percent', '%', 'economics', 'inflation'],
    greeting: ['hello', 'hi', 'hey', 'greetings', 'howdy', 'good morning', 'good afternoon', 'good evening', 'namaste', 'hola', 'welcome', 'yo', 'sup'],
    staking: ['staking', 'stake', 'rewards', 'yield', 'interest', 'earn', 'passive', 'delegate', 'delegation', 'apy', 'apr', 'return'],
    roadmap: ['roadmap', 'future', 'plans', 'upcoming', 'next', 'development', 'timeline', 'milestones', 'goals', 'vision', 'project', 'progress'],
    team: ['team', 'developers', 'founders', 'creator', 'who', 'people', 'behind', 'company', 'organization', 'staff', 'ceo', 'lead'],
    wallet: ['wallet', 'connect', 'cardano', 'nami', 'eternl', 'flint', 'typhon', 'yoroi', 'daedalus', 'metamask', 'address', 'private key', 'seed'],
    general: ['what', 'how', 'when', 'where', 'why', 'who', 'which', 'tell', 'explain', 'about', 'info', 'information', 'details', 'help', 'namaste', 'token']
  };
  
  // Check each category for matches
  for (const [category, keywords] of Object.entries(keywordCategories)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Check for questions
  if (text.includes('?') || text.includes('what') || text.includes('how') || text.includes('when') || 
      text.includes('where') || text.includes('why') || text.includes('who') || text.includes('which')) {
    
    // Try to categorize questions
    if (text.includes('buy') || text.includes('get')) return 'buy';
    if (text.includes('price') || text.includes('worth') || text.includes('cost')) return 'price';
    if (text.includes('token') || text.includes('supply')) return 'tokenomics';
    if (text.includes('stake') || text.includes('reward')) return 'staking';
    if (text.includes('plan') || text.includes('future')) return 'roadmap';
    if (text.includes('team') || text.includes('who')) return 'team';
    if (text.includes('wallet') || text.includes('connect')) return 'wallet';
    
    return 'general';
  }
  
  // Default to general category if no specific category is found
  return 'general';
};

// Function to generate a response based on message category
const generateResponseByCategory = (category, message, currentTheme) => {
  let response = "Thanks for reaching out! I'm here to help with any questions about Namaste token.";
  
  switch(category) {
    case 'buy':
      response = "You can buy Namaste tokens on our partner exchanges like Minswap and SundaeSwap. Check our Linktr.ee (https://linktr.ee/namastecardano) for the latest listing information and direct links!";
      break;
    case 'price':
      response = "The price of Namaste token fluctuates based on market conditions. For the most current price information, please check our Linktr.ee (https://linktr.ee/namastecardano) which has links to price charts and exchanges.";
      break;
    case 'tokenomics':
      response = "Namaste token has a fair distribution model with no team allocation. Our tokenomics include: 40% for liquidity, 30% for staking rewards, 20% for community initiatives, and 10% for marketing. Check our tokenomics section for more details!";
      break;
    case 'greeting':
      response = currentTheme.name === 'namaste' ? "Meow! How can I help you today with Namaste token?" : "Namaste! How can I assist you with our token today?";
      break;
    case 'staking':
      response = "Staking Namaste tokens will be available soon! We're working on our staking platform that will offer competitive rewards. Join our Discord or follow us on X.com for announcements about staking.";
      break;
    case 'roadmap':
      response = "Our roadmap includes exchange listings, staking platform launch, community governance, and partnerships with other Cardano projects. Check our website for the detailed roadmap and timelines!";
      break;
    case 'team':
      response = "Namaste token is a community-driven project with a dedicated team passionate about Cardano. While our core team prefers to remain anonymous, we're fully committed to the project's success and transparency.";
      break;
    case 'wallet':
      response = "You can connect your Cardano wallet to our website using the 'Connect Wallet' button. We support Nami, Eternl, Flint, Typhon, and other popular Cardano wallets.";
      break;
    case 'general':
      // More varied general responses
      const generalResponses = [
        "Namaste token is a community-driven Cardano token focused on bringing positive energy to the crypto space. How can I help you learn more about it?",
        "Thanks for your interest in Namaste token! We're building a vibrant community on the Cardano blockchain. What would you like to know about our project?",
        "Namaste! Our token combines the spiritual principles of harmony with the innovation of blockchain technology. Is there something specific you'd like to know?",
        "Welcome to Namaste token! We're a Cardano-based project with a mission to create a positive and supportive crypto community. How can I assist you today?"
      ];
      // Select a random response for variety
      response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      break;
    default:
      // If no specific category is matched, check for common phrases
      if (message && message.length < 10) {
        response = "Hi there! How can I help you with Namaste token today?";
      } else if (message && message.includes('thank')) {
        response = "You're welcome! If you have any other questions about Namaste token, feel free to ask.";
      }
      break;
  }
  
  return response;
};

const FloatingChat = () => {
  const { currentTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! How can I help you with Namaste token today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isNamasteTheme = currentTheme.name === 'namaste';

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { text: inputValue, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // In development mode, simulate a response instead of making the actual API call
    // This is a temporary workaround until CORS is configured on the n8n server
    if (isDevelopment && useSimulatedResponsesInDev) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a response based on the message content
      const message = inputValue.toLowerCase();
      const category = extractKeywords(message) || 'general';
      let simulatedResponse = generateResponseByCategory(category, message, currentTheme);
      
      console.log('Message category:', category);
      setMessages(prev => [...prev, { text: simulatedResponse, isUser: false }]);
      setIsLoading(false);
    } else {
      // Production mode or development mode with real API calls
      const requestData = {
        message: inputValue,
        timestamp: new Date().toISOString(),
        theme: currentTheme.name,
        userId: 'website-visitor',
        source: isDevelopment ? 'website-chat-dev' : 'website-chat'
      };
      
      console.log('Sending message to n8n:', {
        url: N8N_WORKFLOW_URL,
        data: requestData
      });
      
      // Try with a simpler request format
      const simplifiedRequestData = {
        message: inputValue
      };
      
      console.log('Also trying with simplified data:', simplifiedRequestData);
      
      try {
        console.log('Sending fetch request to:', N8N_WORKFLOW_URL);
        
        // Create an AbortController to handle timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(N8N_WORKFLOW_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(simplifiedRequestData), // Use simplified data
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
        
        if (response.ok) {
          try {
            // Check if there's content to parse
            const contentLength = response.headers.get('content-length');
            const contentType = response.headers.get('content-type');
            
            // If we get an empty response but status is OK, generate a response based on the message
            if (!contentLength || parseInt(contentLength) === 0) {
              console.log('Empty response received, generating fallback response');
              
              // Generate a response based on the message content
              const message = inputValue.toLowerCase();
              const category = extractKeywords(message) || 'general';
              let generatedResponse = generateResponseByCategory(category, message, currentTheme);
              
              console.log('Message category (empty response):', category);
              setMessages(prev => [...prev, { 
                text: generatedResponse, 
                isUser: false 
              }]);
              setIsLoading(false);
              return; // Exit early
            }
            
            if (contentLength && parseInt(contentLength) > 0 && contentType && contentType.includes('application/json')) {
              const data = await response.json();
              console.log('Received response from n8n:', data);
              
              // Extract the response text from the data
              const responseText = data.response || data.text || data.message || data.output;
              
              if (responseText) {
                setMessages(prev => [...prev, { 
                  text: responseText, 
                  isUser: false 
                }]);
              } else {
                console.warn('Response from n8n did not contain expected fields:', data);
                // Generate a response based on the message content
                const message = inputValue.toLowerCase();
                const category = extractKeywords(message) || 'general';
                let generatedResponse = generateResponseByCategory(category, message, currentTheme);
                
                console.log('Message category (empty JSON response):', category);
                setMessages(prev => [...prev, { 
                  text: generatedResponse, 
                  isUser: false 
                }]);
              }
            } else {
              // Handle empty response or non-JSON response
              console.log('Empty or non-JSON response received');
              
              // For empty responses, generate a response based on the message content
              const message = inputValue.toLowerCase();
              const category = extractKeywords(message) || 'general';
              let generatedResponse = generateResponseByCategory(category, message, currentTheme);
              
              console.log('Message category (non-JSON response):', category);
              setMessages(prev => [...prev, { 
                text: generatedResponse, 
                isUser: false 
              }]);
            }
          } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            
            // Generate a helpful fallback response based on the message content
            const message = inputValue.toLowerCase();
            const category = extractKeywords(message) || 'general';
            let fallbackResponse = generateResponseByCategory(category, message, currentTheme);
            
            console.log('Message category (parse error):', category);
            setMessages(prev => [...prev, { 
              text: fallbackResponse, 
              isUser: false 
            }]);
          }
        } else {
          // Handle error with more details
          console.error('Error response from n8n:', {
            status: response.status,
            statusText: response.statusText
          });
          
          try {
            // Try to parse error response
            const errorData = await response.text();
            console.error('Error response body:', errorData);
            
            // Generate a response based on the message content
            const message = inputValue.toLowerCase();
            const category = extractKeywords(message) || 'general';
            let generatedResponse = generateResponseByCategory(category, message, currentTheme);
            
            console.log('Message category (error response):', category);
            setMessages(prev => [...prev, { 
              text: generatedResponse, 
              isUser: false 
            }]);
          } catch (parseError) {
            console.error('Could not parse error response');
            
            // Generate a response based on the message content
            const message = inputValue.toLowerCase();
            const category = extractKeywords(message) || 'general';
            let generatedResponse = generateResponseByCategory(category, message, currentTheme);
            
            console.log('Message category (parse error response):', category);
            setMessages(prev => [...prev, { 
              text: generatedResponse, 
              isUser: false 
            }]);
          }
        }
      } catch (error) {
        console.error('Error sending message to n8n:', error);
        
        // Check if this is a timeout error
        if (error.name === 'AbortError') {
          console.log('Request timed out');
          
          // Generate a response based on the message content
          const message = inputValue.toLowerCase();
          const category = extractKeywords(message) || 'general';
          let generatedResponse = generateResponseByCategory(category, message, currentTheme);
          
          console.log('Message category (timeout):', category);
          setMessages(prev => [...prev, { 
            text: generatedResponse, 
            isUser: false 
          }]);
        } else {
          // Generate a helpful fallback response based on the message content
          const message = inputValue.toLowerCase();
          const category = extractKeywords(message) || 'general';
          let fallbackResponse = generateResponseByCategory(category, message, currentTheme);
          
          console.log('Message category (error):', category);
          setMessages(prev => [...prev, { 
            text: fallbackResponse, 
            isUser: false 
          }]);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <ChatButton
        theme={currentTheme}
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaComment />
      </ChatButton>
      
      <AnimatePresence>
        {isOpen && (
          <ChatContainer
            theme={currentTheme}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ChatHeader theme={currentTheme}>
              <ChatTitle>
                {isNamasteTheme && <FaPaw />}
                {isNamasteTheme ? "Meow Chat" : "Namaste Chat"}
              </ChatTitle>
              <CloseButton onClick={toggleChat}>
                <FaTimes />
              </CloseButton>
            </ChatHeader>
            
            <ChatMessages>
              {messages.map((message, index) => (
                <Message 
                  key={index} 
                  $isUser={message.isUser} 
                  theme={currentTheme}
                >
                  {message.text}
                </Message>
              ))}
              {isLoading && (
                <Message theme={currentTheme}>
                  Typing...
                </Message>
              )}
              <div ref={messagesEndRef} />
            </ChatMessages>
            
            <ChatInputContainer onSubmit={handleSubmit}>
              <ChatInput
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={handleInputChange}
                theme={currentTheme}
              />
              <SendButton 
                type="submit" 
                theme={currentTheme}
                disabled={isLoading}
              >
                <FaPaperPlane />
              </SendButton>
            </ChatInputContainer>
          </ChatContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat; 