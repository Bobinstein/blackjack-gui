import React from 'react';
import styles from '../page.module.css';

interface TokenSelectionProps {
  tokens: any[];
  selectedToken: string | null;
  setSelectedToken: (token: string) => void;
  tokenInfo: any;
  gameState: any;
}

const TokenSelection: React.FC<TokenSelectionProps> = ({ tokens, selectedToken, setSelectedToken, tokenInfo, gameState }) => (
  <div className={styles.tokenRow}>
    {gameState && gameState.state ? (
      <div className={`${styles.token} ${styles.selectedToken}`}>
        <img src={`https://arweave.net/${tokenInfo?.logo}`} alt={tokenInfo?.name} className={styles.tokenLogo} />
        <p>{tokenInfo?.name}</p>
      </div>
    ) : (
      tokens.map(token => (
        <div
          key={token.process}
          className={`${styles.token} ${selectedToken === token.process ? styles.selectedToken : ''}`}
          onClick={() => setSelectedToken(token.process)}
        >
          <img src={`https://arweave.net/${token.logo}`} alt={token.name} className={styles.tokenLogo} />
          <p>{token.name}</p>
        </div>
      ))
    )}
  </div>
);

export default TokenSelection;
