"use client"

import React, { useEffect, useState } from 'react';
import {
  fetchSupportedTokens,
  fetchUserBalances,
  checkExistingGame,
  handleAction,
  handleStartGame,
  handleDoubleDown,
  handleSplit,
  handleInsurance,
  fetchTokenInfo,
  fetchUserBalance,
  calculateHandValue,
  determineHandStatus,
} from '../lib/gameUtils';
import Header from './components/Header';
import TokenSelection from './components/TokenSelection';
import BetInput from './components/BetInput';
import GameState from './components/GameState';
import styles from './page.module.css';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0.1);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        //@ts-ignore
        const address = await window.arweaveWallet.getActiveAddress();
        setWalletAddress(address);
        const tokens = await fetchSupportedTokens();
        setTokens(tokens);
        const balances = await fetchUserBalances(address, tokens);
        setBalances(balances);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      refreshGameState();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (gameState?.state?.token) {
      fetchTokenDetails(gameState.state.token);
    }
  }, [gameState]);

  useEffect(() => {
    if (selectedToken) {
      const selectedTokenObject = tokens.find(token => token.process === selectedToken);
      if (selectedTokenObject) {
        const minBet = selectedTokenObject.minBet / Math.pow(10, selectedTokenObject.denomination);
        setBetAmount(minBet);
        fetchUserBalance(walletAddress!, selectedTokenObject.process).then(balance => {
          setSelectedTokenBalance(balance);
        });
      }
    }
  }, [selectedToken]);

  useEffect(() => {
    if (walletAddress && selectedToken) {
      const selectedTokenObject = tokens.find(token => token.process === selectedToken);
      if (selectedTokenObject) {
        fetchUserBalance(walletAddress, selectedTokenObject.process).then(balance => {
          setSelectedTokenBalance(balance);
        });
      }
    }
  }, [gameState]);

  const fetchTokenDetails = async (token: string) => {
    const tokenDetails = await fetchTokenInfo(token);
    setTokenInfo(tokenDetails);
  };

  const resetGameState = () => {
    setGameState(null);
    setBetAmount(0.1);
    setSelectedToken(null);
    setBalances({});
    setTokens([]);
    setTokenInfo(null);
    setSelectedTokenBalance(0);
    setLoading(true);
  };

  const handleBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (selectedTokenObject) {
      setBetAmount(Math.max(minBet, Math.min(maxBet, value)));
    } else {
      setBetAmount(value);
    }
  };

  const handleMinBet = () => {
    setBetAmount(minBet);
  };

  const handleMaxBet = () => {
    if (selectedTokenObject) {
      const balance = balances[selectedTokenObject.process] / Math.pow(10, selectedTokenObject.denomination);
      setBetAmount(Math.min(balance, maxBet));
    }
  };

  const refreshGameState = async () => {
    try {
      const result = await checkExistingGame(walletAddress!);
      const stateTag = result?.Tags?.find((tag: any) => tag.name === 'State');
      const state = stateTag ? JSON.parse(stateTag.value) : null;

      if (result?.Data === "You have no active game, start one by sending a bet") {
        setGameState(null);
      } else {
        setGameState({ ...result, state });
      }
    } catch (error) {
      console.error('Failed to refresh game state:', error);
    }
  };

  const selectedTokenObject = tokens?.find(token => token.process === selectedToken);

  const minBet = selectedTokenObject ? selectedTokenObject.minBet / Math.pow(10, selectedTokenObject.denomination) : 0;
  const maxBet = selectedTokenObject ? selectedTokenObject.maxBet / Math.pow(10, selectedTokenObject.denomination) : 1;

  const handleNewGame = () => {
    setGameState(null);
    setSelectedToken(null);
    setBetAmount(0.1);
  };

  const isBetValid = betAmount >= minBet && betAmount <= maxBet;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Blackjack: Sponsored by <a className={styles.hlink} href='https://sarcophagus.io/'>Sarcophagus.io</a></h1>
        {!walletAddress ? (
          <p>Please connect your ArConnect wallet</p>
        ) : (
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <p>Select token to bet:</p>
                <TokenSelection tokens={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken} tokenInfo={tokenInfo} gameState={gameState} />
              </>
            )}
            {selectedTokenObject && (
              <p>Current Balance: {selectedTokenBalance / Math.pow(10, selectedTokenObject.denomination)}</p>
            )}
            {!gameState && selectedTokenObject && (
              <div>
                <p>Min Bet: {minBet}</p>
                <p>Max Bet: {maxBet}</p>
                <BetInput betAmount={betAmount} handleBetChange={handleBetChange} handleMinBet={handleMinBet} handleMaxBet={handleMaxBet} minBet={minBet} maxBet={maxBet} />
                <button className={styles.button} disabled={!isBetValid} onClick={() => handleStartGame(walletAddress!, betAmount, selectedTokenObject, refreshGameState)}>
                  Start Game
                </button>
              </div>
            )}
            {gameState && (
              <GameState
                gameState={gameState}
                tokenInfo={tokenInfo}
                handleNewGame={handleNewGame}
                handleAction={handleAction}
                handleDoubleDown={handleDoubleDown}
                handleSplit={handleSplit}
                handleInsurance={handleInsurance}
                refreshGameState={refreshGameState}
                calculateHandValue={calculateHandValue}
                determineHandStatus={determineHandStatus}
              />
            )}
            <button className={styles.button} onClick={refreshGameState}>Refresh</button>
            <p>AO messages can sometimes be slower than this interface. If you believe the displayed state is incorrect please click the refresh button.</p>
            <p>The large and very professional team behind AO Blackjack is diligently working on a fix for this inconvenience.</p>
          </>
        )}
      </main>
    </div>
  );
}
