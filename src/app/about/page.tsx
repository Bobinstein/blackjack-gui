"use client"
import React from 'react';
import styles from '../page.module.css';
import Header from '../components/Header';

export default function About() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>About AO Blackjack</h1>
        <p>Welcome to AO Blackjack, the decentralized blackjack game built on the Arweave blockchain.</p>
        <p>Our game is designed to provide a fun and educational experience, teaching players about various topics including evolutionary biology, mycology, and herbology, through an engaging gameplay experience.</p>
        <h2>Features</h2>
        <ul>
          <li>Decentralized and secure gameplay</li>
          <li>Educational content integrated into the game</li>
          <li>Various in-game tokens to enhance the experience</li>
          <li>Interactive and user-friendly interface</li>
        </ul>
        <h2>About Sarcophagus.io</h2>
        <p>Sarcophagus.io is a proud sponsor of AO Blackjack. Sarcophagus is a decentralized dead man's switch application built on Ethereum and Arweave. It allows users to securely store and transfer data in a trustless manner.</p>
      </main>
    </div>
  );
}
