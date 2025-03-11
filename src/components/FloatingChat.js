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
  
  ${props => props.isUser ? `
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
const PRODUCTION_WEBHOOK_URL = 'https://n8n.lucidsro.com/webhook/Rk5qA8T90dH6gy5V';

// In development, we'll use a relative URL that will be proxied
const DEVELOPMENT_WEBHOOK_URL = '/webhook/Rk5qA8T90dH6gy5V';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Use the appropriate webhook URL based on environment
const N8N_WORKFLOW_URL = isDevelopment ? DEVELOPMENT_WEBHOOK_URL : PRODUCTION_WEBHOOK_URL;

// Set this to false to use the real n8n webhook even in development mode
const useSimulatedResponsesInDev = false;

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
    
    try {
      // In development mode, simulate a response instead of making the actual API call
      // This is a temporary workaround until CORS is configured on the n8n server
      if (isDevelopment && useSimulatedResponsesInDev) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a simple response based on the message
        let simulatedResponse = "Thanks for your message! This is a simulated response for local development.";
        
        // Simple keyword matching for demo purposes
        const message = inputValue.toLowerCase();
        if (message.includes('buy') || message.includes('purchase')) {
          simulatedResponse = "You can buy Namaste tokens on our partner exchanges. Check our website for the latest listing information!";
        } else if (message.includes('price') || message.includes('worth')) {
          simulatedResponse = "The price of Namaste token fluctuates based on market conditions. Check our Linktr.ee for current price information.";
        } else if (message.includes('tokenomics')) {
          simulatedResponse = "Namaste token has a fair distribution model with no team allocation. Check our tokenomics section for more details!";
        } else if (message.includes('hello') || message.includes('hi')) {
          simulatedResponse = currentTheme.name === 'namaste' ? "Meow! How can I help you today?" : "Namaste! How can I assist you with our token?";
        }
        
        setMessages(prev => [...prev, { text: simulatedResponse, isUser: false }]);
      } else {
        // Production mode or development mode with real API calls
        console.log('Sending message to n8n:', {
          url: N8N_WORKFLOW_URL,
          data: {
            message: inputValue,
            timestamp: new Date().toISOString(),
            theme: currentTheme.name,
            userId: 'website-visitor',
            source: isDevelopment ? 'website-chat-dev' : 'website-chat'
          }
        });
        
        const response = await fetch(N8N_WORKFLOW_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue,
            timestamp: new Date().toISOString(),
            theme: currentTheme.name,
            userId: 'website-visitor',
            source: isDevelopment ? 'website-chat-dev' : 'website-chat'
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Received response from n8n:', data);
          
          // Extract the response text from the data
          const responseText = data.response || data.text || data.message;
          
          if (responseText) {
            setMessages(prev => [...prev, { 
              text: responseText, 
              isUser: false 
            }]);
          } else {
            console.warn('Response from n8n did not contain expected fields:', data);
            setMessages(prev => [...prev, { 
              text: "Received a response, but couldn't find the message content. Please check the console for details.", 
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
          } catch (parseError) {
            console.error('Could not parse error response');
          }
          
          setMessages(prev => [...prev, { 
            text: `Sorry, I couldn't process your request. Server responded with status: ${response.status} ${response.statusText}`, 
            isUser: false 
          }]);
        }
      }
    } catch (error) {
      console.error('Error sending message to n8n:', error);
      setMessages(prev => [...prev, { 
        text: `Sorry, there was an error connecting to our services: ${error.message}. Please try again later.`, 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
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
                  isUser={message.isUser} 
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