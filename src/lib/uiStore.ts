import { useSyncExternalStore } from 'react';

// Cart Interface
export interface CartItem {
  productId: number;
  quantity: number;
}

// Global State Shape
interface UIState {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isUserOpen: boolean;
  cartItems: CartItem[];
}

let state: UIState = {
  isCartOpen: false,
  isMenuOpen: false,
  isSearchOpen: false,
  isUserOpen: false,
  cartItems: [],
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const uiActions = {
  // Overlays
  toggleCart: () => { state = { ...state, isCartOpen: !state.isCartOpen, isMenuOpen: false, isSearchOpen: false, isUserOpen: false }; emitChange(); },
  closeCart: () => { state = { ...state, isCartOpen: false }; emitChange(); },
  
  toggleMenu: () => { state = { ...state, isMenuOpen: !state.isMenuOpen, isCartOpen: false, isSearchOpen: false, isUserOpen: false }; emitChange(); },
  closeMenu: () => { state = { ...state, isMenuOpen: false }; emitChange(); },
  
  toggleSearch: () => { state = { ...state, isSearchOpen: !state.isSearchOpen, isCartOpen: false, isMenuOpen: false, isUserOpen: false }; emitChange(); },
  closeSearch: () => { state = { ...state, isSearchOpen: false }; emitChange(); },
  
  toggleUser: () => { state = { ...state, isUserOpen: !state.isUserOpen, isCartOpen: false, isMenuOpen: false, isSearchOpen: false }; emitChange(); },
  closeUser: () => { state = { ...state, isUserOpen: false }; emitChange(); },

  closeAll: () => { 
    state = { ...state, isCartOpen: false, isMenuOpen: false, isSearchOpen: false, isUserOpen: false }; 
    emitChange(); 
  },
  
  // Cart Actions
  addToCart: (productId: number) => {
    const existing = state.cartItems.find(i => i.productId === productId);
    if (existing) {
      const newItems = state.cartItems.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      state = { ...state, cartItems: newItems, isCartOpen: true };
    } else {
      state = { ...state, cartItems: [...state.cartItems, { productId, quantity: 1 }], isCartOpen: true };
    }
    emitChange();
  },
  
  removeFromCart: (productId: number) => {
    state = { ...state, cartItems: state.cartItems.filter(i => i.productId !== productId) };
    emitChange();
  },
  
  clearCart: () => {
    state = { ...state, cartItems: [] };
    emitChange();
  }
};

export function useUIState() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state // SSR fallback
  );
}
