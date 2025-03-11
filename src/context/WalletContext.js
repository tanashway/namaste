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
  
  useEffect(() => {
    // Initialize Weld
    weld.config.update({
      wallets: ['nami', 'eternl', 'flint', 'lace', 'nufi', 'gerowallet', 'typhon'],
      autoConnectLastWallet: true,
      autoConnectTimeout: 3000,
    });
    
    weld.init();
    
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
        setWalletAddress(state.changeAddress || '');
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
      await weld.wallet.connect(walletName);
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await weld.wallet.disconnect();
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
        weld // Expose the weld instance for advanced usage
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWalletContext = () => useContext(WalletContext);

export default WalletContext; 