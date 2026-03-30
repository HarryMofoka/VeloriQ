import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIState, uiActions } from '../lib/uiStore';
import { X, User, ArrowRight } from 'lucide-react';

export function UserOverlay() {
  const { isUserOpen } = useUIState();

  return (
    <AnimatePresence>
      {isUserOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={uiActions.closeUser}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-[100px] right-[40px] md:right-[80px] w-full max-w-[340px] z-[1001] premium-panel p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-white/60">
                <User size={20} />
                <span className="font-['Space_Grotesk'] tracking-widest uppercase text-sm font-bold">Account</span>
              </div>
              <button onClick={uiActions.closeUser} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-center py-6 border-b border-white/10">
                <h3 className="text-xl font-['Space_Grotesk'] mb-2 tracking-wide font-medium">Welcome Back</h3>
                <p className="text-sm text-white/40 font-['Inter']">Sign in to access your orders, saved items, and VeloriQ Care.</p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button 
                  onClick={() => { alert('Sign In Flow Modeled'); uiActions.closeUser(); }}
                  className="w-full bg-white text-black font-['Space_Grotesk'] tracking-widest uppercase font-bold text-xs py-4 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { alert('Create Account Flow Modeled'); uiActions.closeUser(); }}
                  className="w-full bg-transparent text-white border border-white/20 font-['Space_Grotesk'] tracking-widest uppercase font-bold text-xs py-4 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Create Account
                </button>
              </div>

              <a href="#" className="mt-4 flex items-center justify-center gap-2 text-xs font-['Space_Grotesk'] text-white/50 tracking-widest hover:text-white transition-colors">
                ORDER STATUS <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
