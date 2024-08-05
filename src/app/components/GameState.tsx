import React from 'react';
import GameActions from './GameActions';
import styles from '../page.module.css';

const suits = ['H', 'D', 'C', 'S'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardImages: { [key: string]: string } = {};

suits.forEach(suit => {
  values.forEach(value => {
    cardImages[`${value}${suit}`] = `/cards/${value}${suit}.svg`;
  });
});

cardImages['RED_BACK'] = '/cards/RED_BACK.svg';

const Card = ({ card }: { card: string }) => (
  <img src={cardImages[card]} alt={card} className={styles.card} />
);

interface GameStateProps {
  gameState: any;
  tokenInfo: any;
  handleNewGame: () => void;
  handleAction: (walletAddress: string, action: string, refreshGameState: () => void) => void;
  handleDoubleDown: (walletAddress: string, betAmount: number, selectedToken: any, refreshGameState: () => void) => void;
  handleSplit: (walletAddress: string, betAmount: number, selectedToken: any, refreshGameState: () => void) => void;
  handleInsurance: (walletAddress: string, betAmount: number, selectedToken: any, refreshGameState: () => void) => void;
  refreshGameState: () => void;
  calculateHandValue: (hand: any[]) => number;
  determineHandStatus: (hand: any, dealerHand: any, isGameOver: boolean) => string;
}

const GameState: React.FC<GameStateProps> = ({
  gameState,
  tokenInfo,
  handleNewGame,
  handleAction,
  handleDoubleDown,
  handleSplit,
  handleInsurance,
  refreshGameState,
  calculateHandValue,
  determineHandStatus,
}) => (
  <div>
    <div className={styles.handContainer}>
      <div className={styles.dealerHand}>
      <h2>Dealer&apos;s Hand (Total: {gameState?.state?.dealerCards && calculateHandValue(gameState.state.dealerCards)})</h2>

        <div className={styles.cardContainer}>
          {gameState?.state?.dealerCards?.map((card: any, index: number) => (
            <Card key={`${card.value}${card.suit}${index}`} card={`${card.value}${card.suit[0]}`} />
          ))}
          {!gameState?.state?.dealerCardShown && <Card card="RED_BACK" />}
        </div>
      </div>
      {gameState?.state?.hands?.map((hand: any, index: number) => (
        <div className={styles.playerHand} key={index}>
          <h2>Your Hand {index + 1} (Total: {calculateHandValue(hand.cards)})</h2>
          <div className={styles.cardContainer}>
            {hand.cards.map((card: any) => (
              <Card key={`${card.value}${card.suit}`} card={`${card.value}${card.suit[0]}`} />
            ))}
          </div>
          <p className={styles.betAmount}>Bet: {hand.bet / Math.pow(10, tokenInfo?.denomination)}</p>
          <p className={styles.handStatus}>{determineHandStatus(hand, gameState.state.dealerCards, gameState.state.isHistoric)}</p>
          {gameState?.state?.activeHandIndex - 1 === index && (
            <GameActions
              walletAddress={gameState?.walletAddress}
              hand={hand}
              tokenInfo={tokenInfo}
              handleAction={handleAction}
              handleDoubleDown={handleDoubleDown}
              handleSplit={handleSplit}
              handleInsurance={handleInsurance}
              refreshGameState={refreshGameState}
            />
          )}
        </div>
      ))}
    </div>
    {gameState?.state?.isHistoric && (
      <center><button className={styles.button} onClick={handleNewGame}>New Game</button></center>
    )}
  </div>
);

export default GameState;
