import React from 'react';
import styles from '../page.module.css';

interface BetInputProps {
  betAmount: number;
  handleBetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleMinBet: () => void;
  handleMaxBet: () => void;
  minBet: number;
  maxBet: number;
}

const BetInput: React.FC<BetInputProps> = ({ betAmount, handleBetChange, handleMinBet, handleMaxBet, minBet, maxBet }) => (
  <div className={styles.betInput}>
    <button onClick={handleMinBet}>Min</button>
    <input
      type="number"
      value={betAmount}
      onChange={handleBetChange}
      min={minBet}
      max={maxBet}
      step={0.1}
    />
    <button onClick={handleMaxBet}>Max</button>
  </div>
);

export default BetInput;
