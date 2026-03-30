import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIState, uiActions } from '../lib/uiStore';
import { X, ChevronRight } from 'lucide-react';

export function MenuDrawer() {
  const { isMenuOpen } = useUIState();

  const links = ['Collections', 'Materials', 'Technology', 'Heritage', 'Support'];

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={uiActions.closeMenu}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-[400px] z-[1001] premium-panel p-8 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.8)] border-r border-white/5"
          >
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-2xl font-['Space_Grotesk'] font-bold tracking-[0.2em] uppercase italic">VeloriQ</h2>
              <button onClick={uiActions.closeMenu} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 flex-1">
              {links.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  onClick={(e) => { e.preventDefault(); uiActions.closeMenu(); }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="group flex items-center justify-between text-2xl font-['Space_Grotesk'] font-medium tracking-wide border-b border-white/10 pb-4"
                >
                  <span className="group-hover:text-white/70 transition-colors">{link}</span>
                  <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
                </motion.a>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-white/10 text-xs tracking-widest text-white/30 font-['Space_Grotesk']">
              © {new Date().getFullYear()} VELORIQ. ALL RIGHTS RESERVED.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
