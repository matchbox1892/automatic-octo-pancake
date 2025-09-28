'use client';

import Link from 'next/link';
import { useMenuStore } from '../lib/menuStore';
import Banner from './Banner';
import styles from './Header.module.css';

export default function Header() {
  const menuOpen = useMenuStore((state) => state.menuOpen);
  const toggleMenu = useMenuStore((state) => state.toggleMenu);

  return (
    <header className={styles.header}>
      <div className={styles.brandArea}>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <span className={styles.menuIcon} aria-hidden>☰</span>
          <span className="sr-only">Toggle main menu</span>
        </button>
        <Link href="/" className={styles.brandLink}>
          MatchCloud SOAP
        </Link>
      </div>
      <div className={styles.bannerSlot}>
        <Banner />
      </div>
    </header>
  );
}
