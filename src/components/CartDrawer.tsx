import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIState, uiActions } from '../lib/uiStore';
import { products } from '../lib/data';
import { usePricing } from '../lib/usePricing';
import { X, Trash2 } from 'lucide-react';

export function CartDrawer() {
  const { isCartOpen, cartItems } = useUIState();
  const { formatPrice } = usePricing();

  const total = cartItems.reduce((acc, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return acc + ((p?.basePrice || 0) * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={uiActions.closeCart}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[400px] z-[1001] premium-panel p-8 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.8)] border-l border-white/5"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-['Space_Grotesk'] font-bold tracking-wider">YOUR CART</h2>
              <button onClick={uiActions.closeCart} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-white/40 font-['Space_Grotesk'] tracking-widest text-sm">
                  YOUR CART IS EMPTY
                </div>
              ) : (
                cartItems.map((item) => {
                  const p = products.find((prod) => prod.id === item.productId);
                  if (!p) return null;
                  return (
                    <div key={item.productId} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: p.circleColor }}>
                        {/* Abstract circle representing the watch color */}
                        <div className="w-12 h-12 rounded-full border border-black/20" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-['Space_Grotesk'] font-bold tracking-wide">{p.name}</h3>
                        <p className="text-white/50 text-xs tracking-wider mb-1 uppercase">{p.subtitle}</p>
                        <div className="text-sm font-['Inter'] mb-1">
                          {formatPrice(p.basePrice)} <span className="text-white/40 text-xs">x {item.quantity}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => uiActions.removeFromCart(item.productId)}
                        className="text-white/30 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10 shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-['Space_Grotesk'] tracking-widest text-sm text-white/50 uppercase">Total Estimate</span>
                  <span className="font-bold text-xl">{formatPrice(total)}</span>
                </div>
                <button 
                  onClick={() => {
                    alert('Checkout flow mocked!');
                    uiActions.clearCart();
                    uiActions.closeCart();
                  }}
                  className="w-full bg-white text-black font-['Space_Grotesk'] tracking-widest uppercase font-bold text-sm py-4 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
