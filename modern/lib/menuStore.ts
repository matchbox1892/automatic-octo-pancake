import { create } from 'zustand';

interface MenuState {
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuOpen: false,
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
  openMenu: () => set({ menuOpen: true })
}));
