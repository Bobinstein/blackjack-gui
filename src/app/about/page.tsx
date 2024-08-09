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
        <p>Welcome to AO Blackjack, the decentralized blackjack game built on ao.</p>
        <p>Our game is designed to provide a fun and interactive way to showcase the possibilities of decentralized compute with ao, which is built on the Arweave blockweave.</p>
        <h2>Features</h2>
        <ul>
          <li>Decentralized and secure gameplay</li>
          <li>Every action and response is an ao message, allowing full transparency in gameplay</li>
          <li>Various in-game tokens to enhance the experience</li>
          <li>Simple and user-friendly interface</li>
        </ul>
        <br />
        <h1>Sponsors</h1>
        <ul>
          <li><a className={styles.hlink} href='https://sarcophagus.io/' target='_blank' >Sarcophagus.io</a></li>
          <li><a className={styles.hlink} href='https://trunkao.xyz/#/' target='_blank'>TRUNK</a></li>
        </ul>
        <h2>About Sarcophagus.io</h2>
        <p>Sarcophagus is a decentralized dead man&apos;s switch application built on Ethereum and Arweave. It is a switch designed to be activated or deactivated if the human operator becomes incapacitated, such as through death, loss of consciousness, or being bodily removed from control.</p>
        <p>Sarcophagus sponsored AO Blackjack to help show off the power of ao.</p>
        <h2>About Trunk</h2>
        <p>$TRUNK is the very first meme token on AO/Arweave. $TRUNK is built on a meme frame which allows users to participate in DAO voting on chain on AO.</p>
      </main>
    </div>
  );
}
