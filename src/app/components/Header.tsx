import React, { useEffect, useState } from 'react';
import WalletConnect from './WalletConnect';
import NavBar from './NavBar';
import { connectWallet, disconnectWallet } from '../../lib/wallet';
import styles from '../page.module.css';

const Header: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    async function loadWalletAddress() {
      try {
        //@ts-ignore
        const address = await window.arweaveWallet.getActiveAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error('Error loading wallet address:', error);
      }
    }
    loadWalletAddress();
  }, []);

  const handleConnect = async () => {
    if (walletAddress) {
      const confirmed = window.confirm('Do you want to disconnect your wallet?');
      if (confirmed) {
        await disconnectWallet();
        setWalletAddress(null);
      }
    } else {
      try {
        const address = await connectWallet();
        setWalletAddress(address);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <NavBar />
        <WalletConnect onConnect={handleConnect} walletAddress={walletAddress} />
      </div>
    </header>
  );
};

export default Header;
