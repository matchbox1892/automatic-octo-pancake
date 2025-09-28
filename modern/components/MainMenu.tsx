'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useMenuStore } from '../lib/menuStore';
import { useAuth } from '../lib/auth';
import styles from './MainMenu.module.css';

const navItems = [
  { href: '#subjective', label: 'Subjective' },
  { href: '#objective', label: 'Objective' },
  { href: '#assessment', label: 'Assessment' },
  { href: '#plan', label: 'Plan' }
];

export default function MainMenu() {
  const menuOpen = useMenuStore((state) => state.menuOpen);
  const closeMenu = useMenuStore((state) => state.closeMenu);
  const { authenticated, login, logout, user } = useAuth();

  return (
    <nav
      id="primary-navigation"
      className={clsx(styles.menu, menuOpen ? styles.menuOpen : styles.menuClosed)}
      aria-hidden={!menuOpen}
    >
      <div className={styles.menuHeader}>
        <h2>Generator Sections</h2>
        <button type="button" onClick={closeMenu} className={styles.closeButton}>
          Close
        </button>
      </div>
        <ul className={styles.menuList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={closeMenu} className={styles.menuItemLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      <div className={styles.menuFooter}>
        <div className={styles.authBlock}>
          <p className={styles.authStatus}>
            {authenticated ? `Signed in as ${user?.name}` : 'You are browsing as a guest.'}
          </p>
          <button type="button" onClick={authenticated ? logout : login} className={styles.authButton}>
            {authenticated ? 'Sign out' : 'Sign in'}
          </button>
        </div>
        <p className={styles.menuNote}>
          Additional tools such as report previews, CMS editing, and QA dashboards will surface here in later phases.
        </p>
      </div>
    </nav>
  );
}
