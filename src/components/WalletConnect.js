import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletContext } from '../context/WalletContext';
import { FaWallet, FaCheck, FaTimes } from 'react-icons/fa';

const ConnectButton = styled(motion.button)`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(97, 218, 251, 0.4);
  }
`;

const WalletDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: ${props => props.theme.navBackground};
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  min-width: 200px;
  z-index: 1000;
`;

const WalletOption = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background-color: transparent;
  color: ${props => props.theme.text};
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem;
  
  p {
    margin: 0.25rem 0;
    font-size: 0.8rem;
    word-break: break-all;
  }
  
  .address {
    font-size: 0.7rem;
    opacity: 0.7;
  }
`;

const DisconnectButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: none;
  background-color: #ff6b6b;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #ff5252;
  }
`;

const WalletConnect = ({ theme, isNamasteTheme }) => {
  const { 
    isConnected, 
    walletAddress, 
    walletName, 
    connectWallet, 
    disconnectWallet, 
    getAvailableWallets 
  } = useWalletContext();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableWallets, setAvailableWallets] = useState([]);
  
  useEffect(() => {
    // Get available wallets when component mounts
    setAvailableWallets(getAvailableWallets());
  }, [getAvailableWallets]);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleConnectWallet = async (wallet) => {
    await connectWallet(wallet);
    setIsDropdownOpen(false);
  };
  
  const handleDisconnect = async () => {
    await disconnectWallet();
    setIsDropdownOpen(false);
  };
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <ConnectButton 
        theme={theme}
        onClick={toggleDropdown}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isConnected ? (
          <>
            <FaCheck />
            {isNamasteTheme ? "Paw-let" : "Connected"}
          </>
        ) : (
          <>
            <FaWallet />
            {isNamasteTheme ? "Connect Paw-let" : "Connect Wallet"}
          </>
        )}
      </ConnectButton>
      
      <AnimatePresence>
        {isDropdownOpen && (
          <WalletDropdown
            theme={theme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isConnected ? (
              <>
                <WalletInfo>
                  <p><strong>Connected to:</strong> {walletName}</p>
                  <p className="address">{formatAddress(walletAddress)}</p>
                </WalletInfo>
                <DisconnectButton
                  onClick={handleDisconnect}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes />
                  Disconnect
                </DisconnectButton>
              </>
            ) : (
              <>
                {availableWallets.length > 0 ? (
                  availableWallets.map((wallet) => (
                    <WalletOption
                      key={wallet}
                      theme={theme}
                      onClick={() => handleConnectWallet(wallet)}
                      whileHover={{ x: 5 }}
                    >
                      <FaWallet />
                      {wallet.charAt(0).toUpperCase() + wallet.slice(1)}
                    </WalletOption>
                  ))
                ) : (
                  <p>No Cardano wallets detected. Please install a wallet extension.</p>
                )}
              </>
            )}
          </WalletDropdown>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletConnect; 