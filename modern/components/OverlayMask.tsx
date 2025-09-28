'use client';

import { useMenuStore } from '../lib/menuStore';
import styles from './OverlayMask.module.css';

export default function OverlayMask() {
  const menuOpen = useMenuStore((state) => state.menuOpen);
  const closeMenu = useMenuStore((state) => state.closeMenu);

  if (!menuOpen) {
    return null;
  }

  return <div className={styles.mask} role="button" aria-label="Close menu overlay" onClick={closeMenu} />;
}
