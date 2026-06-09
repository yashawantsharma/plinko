"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function WinModal({ show, data, onClose }) {
  return (
    <AnimatePresence>
      {show && data && (
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          {/* FIXED: Shifted structural panel box to match premium sleek dark theme */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-[#0d131f] p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-gray-800/80 relative"
          >
            {/* Top Micro Line Indicator Effect */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-[#087e8b]" />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#087e8b]/10 border border-[#087e8b]/30 text-2xl shadow-[0_0_15px_rgba(8,126,139,0.2)]">
              🎉
            </div>
            
            <h3 className="mt-4 text-xl font-black uppercase tracking-wider text-white">
              Drop Complete
            </h3>
            
            {/* FIXED: Total return inner box shifted to absolute deep onyx black palette */}
            <div className="my-5 rounded-xl bg-[#090d14] p-5 border border-gray-800/40">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                {data.bet} Cents × <span className="text-cyan-400 font-mono font-black">{data.multiplier}x</span>
              </p>
              <p className="mt-2.5 text-2xl font-black text-emerald-400 font-mono tracking-tight">
                +{data.win} Cents
              </p>
            </div>
            
            <button
              type="button" 
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#087e8b] to-cyan-500 hover:from-[#066a75] hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-[0_4px_15px_rgba(8,126,139,0.25)] cursor-pointer"
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}