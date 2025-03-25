import React, { createContext, useState, useEffect, useContext } from 'react';
import { weld } from '@ada-anvil/weld';

// Create the context
const WalletContext = createContext();

// Create a provider component
export const WalletContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [availableWallets, setAvailableWallets] = useState([]);
  const [connecting, setConnecting] = useState(false);
  
  const initializeWallet = async () => {
    try {
      if (window.weld && window.weld.wallet) {
        const isWalletConnected = window.weld.wallet.state?.isConnected || false;
        const address = window.weld.wallet.state?.changeAddress || null;
        
        setIsConnected(isWalletConnected);
        setWalletAddress(address);
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
      setIsConnected(false);
      setWalletAddress(null);
    }
  };
  
  useEffect(() => {
    initializeWallet();
  }, []);
  
  // Connect to wallet
  const connectWallet = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      if (!window.weld || !window.weld.wallet) {
        throw new Error('Wallet not available');
      }

      await window.weld.wallet.enable();
      await initializeWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setIsConnected(false);
      setWalletAddress(null);
    } finally {
      setConnecting(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      if (window.weld && window.weld.wallet) {
        await window.weld.wallet.disable();
      }
      setIsConnected(false);
      setWalletAddress(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };
  
  // Get available wallets
  const getAvailableWallets = () => {
    return availableWallets;
  };
  
  return (
    <WalletContext.Provider 
      value={{
        walletAddress,
        isConnected,
        walletName,
        connectWallet,
        disconnectWallet,
        getAvailableWallets,
        connecting,
        weld
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWalletContext = () => useContext(WalletContext);

export default WalletContext; 