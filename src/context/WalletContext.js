import React, { createContext, useState, useEffect, useContext } from 'react';
import { weld } from '@ada-anvil/weld';

// Create the context
const WalletContext = createContext();

// Create a provider component
export const WalletContextProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [availableWallets, setAvailableWallets] = useState([]);
  const [connecting, setConnecting] = useState(false);
  
  const initializeWallet = async () => {
    try {
      await weld.init();
      
      // Check if already connected
      if (weld.wallet.state.isConnected && weld.wallet.state.changeAddress) {
        setIsConnected(true);
        setWalletName(weld.wallet.state.name || '');
        setWalletAddress(weld.wallet.state.changeAddress);
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
    }
  };
  
  useEffect(() => {
    // Initialize Weld
    weld.config.update({
      wallets: ['nami', 'eternl', 'flint', 'lace', 'nufi', 'gerowallet', 'typhon'],
      autoConnectLastWallet: true,
      autoConnectTimeout: 3000,
    });
    
    initializeWallet();
    
    // Subscribe to wallet state changes
    const unsubscribe = weld.wallet.subscribeWithSelector(
      (state) => ({
        isConnected: state.isConnected,
        name: state.name,
        changeAddress: state.changeAddress
      }),
      (state) => {
        setIsConnected(state.isConnected);
        setWalletName(state.name || '');
        if (state.changeAddress) {
          setWalletAddress(state.changeAddress);
          setConnecting(false);
        } else if (!state.isConnected) {
          setWalletAddress('');
          setConnecting(false);
        }
      }
    );
    
    // Get available wallets
    weld.extensions.subscribeWithSelector(
      (state) => state.allArr,
      (extensions) => {
        const wallets = extensions.map(ext => ext.info.key);
        setAvailableWallets(wallets);
      }
    );
    
    return () => {
      unsubscribe();
      weld.cleanup();
    };
  }, []);
  
  // Connect to wallet
  const connectWallet = async (walletName) => {
    try {
      setConnecting(true);
      await weld.wallet.connect(walletName);
      
      // Wait for the wallet to be connected
      let attempts = 0;
      const maxAttempts = 30; // Increased max attempts
      const delayMs = 100; // Decreased delay
      
      while (attempts < maxAttempts) {
        if (weld.wallet.state.isConnected && weld.wallet.state.changeAddress) {
          setWalletAddress(weld.wallet.state.changeAddress);
          setIsConnected(true);
          setWalletName(walletName);
          setConnecting(false);
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, delayMs));
        attempts++;
      }
      
      throw new Error('Failed to get wallet address');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnecting(false);
      setIsConnected(false);
      setWalletAddress('');
      setWalletName('');
      return false;
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await weld.wallet.disconnect();
      setWalletAddress('');
      setIsConnected(false);
      setWalletName('');
      setConnecting(false);
      return true;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return false;
    }
  };
  
  // Get available wallets
  const getAvailableWallets = () => {
    return availableWallets;
  };
  
  return (
    <WalletContext.Provider 
      value={{
        isConnected,
        walletAddress,
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