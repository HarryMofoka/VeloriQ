import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIState, uiActions } from '../lib/uiStore';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '../lib/data';

export function SearchModal() {
  const { isSearchOpen } = useUIState();
  const [query, setQuery] = useState('');

  const filtered = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        p.faceStyle.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-xl flex flex-col pt-32 px-4 md:px-20"
        >
          <div className="max-w-[800px] w-full mx-auto relative">
            <button 
              onClick={uiActions.closeSearch} 
              className="absolute -top-16 right-0 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            
            <div className="relative border-b border-white/20 pb-4 mb-10 flex items-center">
              <Search className="text-white/40 mr-4" size={32} />
              <input 
                autoFocus
                type="text"
                placeholder="Search collections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-2xl md:text-5xl font-['Space_Grotesk'] tracking-wider placeholder-white/20"
              />
            </div>

            <div className="flex flex-col gap-4">
              {query && filtered.length === 0 && (
                <div className="text-white/40 font-['Space_Grotesk'] tracking-widest text-lg">
                  NO RESULTS FOUND
                </div>
              )}
              {filtered.map(p => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group cursor-pointer flex items-center justify-between p-6 bg-white/5 hover:bg-transparent hover:premium-panel rounded-2xl border border-white/5 hover:border-white/10 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all overflow-hidden"
                  onClick={() => {
                    alert(`Navigating to ${p.subtitle}...`);
                    uiActions.closeSearch();
                  }}
                >
                  <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ background: p.circleColor }}>
                      <div className="w-12 h-12 rounded-full border border-black/20" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-['Space_Grotesk'] font-bold tracking-wide">{p.name} <span className="font-light text-white/60">{p.subtitle}</span></h3>
                      <p className="text-sm text-white/50 font-['Inter'] mt-1">Starting at ${p.basePrice}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-white/30 group-hover:text-white transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
