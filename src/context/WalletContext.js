import React, { createContext, useState, useEffect, useContext } from 'react';
import { weld } from '@ada-anvil/weld';

// Create the context
export const WalletContext = createContext();

// Create a provider component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [availableWallets, setAvailableWallets] = useState([]);

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
      setIsConnected(false);
      setWalletAddress(null);
    }
  };

  useEffect(() => {
    // Initialize Weld with supported wallets
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
          setWalletAddress(null);
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

  const connectWallet = async (walletName) => {
    try {
      setConnecting(true);
      await weld.wallet.connect(walletName);
      
      // Wait for the wallet to be connected
      let attempts = 0;
      const maxAttempts = 30;
      const delayMs = 100;
      
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
      setWalletAddress(null);
      setWalletName('');
      return false;
    }
  };

  const disconnectWallet = async () => {
    try {
      await weld.wallet.disconnect();
      setWalletAddress(null);
      setIsConnected(false);
      setWalletName('');
      setConnecting(false);
      return true;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return false;
    }
  };

  const getAvailableWallets = () => {
    return availableWallets;
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected,
        connecting,
        walletName,
        connectWallet,
        disconnectWallet,
        getAvailableWallets
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWalletContext = () => useContext(WalletContext);

export default WalletContext; 