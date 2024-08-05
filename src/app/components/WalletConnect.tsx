import React from 'react';
import styles from '../page.module.css';

interface WalletConnectProps {
  onConnect: () => void;
  walletAddress: string | null;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, walletAddress }) => (
  <button className={styles.button} onClick={onConnect}>
    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
  </button>
);

export default WalletConnect;
