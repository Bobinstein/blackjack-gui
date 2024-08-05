import React from 'react';
import styles from '../page.module.css';

interface GameActionsProps {
  walletAddress: string;
  hand: any;
  tokenInfo: any;
  handleAction: (walletAddress: string, action: string, refreshGameState: () => void) => void;
  handleDoubleDown: (walletAddress: string, betAmount: number, selectedToken: any, refreshGameState: () => void) => void;
  handleSplit: (walletAddress: string, betAmount: number, selectedToken: any, refreshGameState: () => void) => void;
  handleInsurance: (walletAddress: string, betAmount: number, selectedToken: any, refreshGameState: () => void) => void;
  refreshGameState: () => void;
}

const canDoubleDown = (hand: any) => hand?.cards?.length === 2;
const canSplit = (hand: any) =>
  hand?.cards?.length === 2 &&
  (hand?.cards[0]?.value === hand.cards[1]?.value ||
    (['10', 'J', 'Q', 'K'].includes(hand.cards[0]?.value) &&
      ['10', 'J', 'Q', 'K'].includes(hand.cards[1]?.value)));
const canInsurance = (dealerCards: any[], dealerCardShown: boolean) =>
  !dealerCardShown && dealerCards?.length === 1 && dealerCards[0]?.value === 'A';

const GameActions: React.FC<GameActionsProps> = ({
  walletAddress,
  hand,
  tokenInfo,
  handleAction,
  handleDoubleDown,
  handleSplit,
  handleInsurance,
  refreshGameState,
}) => (
  <div className={styles.actionButtons}>
    <div>
      <button className={styles.button} onClick={() => handleAction(walletAddress, 'Hit', refreshGameState)}>Hit</button>
      <button className={styles.button} onClick={() => handleAction(walletAddress, 'Stay', refreshGameState)}>Stay</button>
    </div>
    <div>
      {canDoubleDown(hand) && (
        <button className={styles.button} onClick={() => handleDoubleDown(walletAddress, hand.bet, tokenInfo, refreshGameState)}>Double Down</button>
      )}
      {canSplit(hand) && (
        <button className={styles.button} onClick={() => handleSplit(walletAddress, hand.bet / Math.pow(10, tokenInfo?.denomination), tokenInfo, refreshGameState)}>Split</button>
      )}
      {canInsurance(hand.dealerCards, hand.dealerCardShown) && (
        <button className={styles.button} onClick={() => handleInsurance(walletAddress, hand.bet / Math.pow(10, tokenInfo?.denomination) / 2, tokenInfo, refreshGameState)}>Insurance</button>
      )}
    </div>
  </div>
);

export default GameActions;
