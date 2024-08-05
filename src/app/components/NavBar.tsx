import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

const NavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <Link legacyBehavior href="/">
        <a className={styles.navlink}>Play</a>
      </Link>
      <Link legacyBehavior href="/about">
        <a className={styles.navlink}>About</a>
      </Link>
    </nav>
  );
};

export default NavBar;
