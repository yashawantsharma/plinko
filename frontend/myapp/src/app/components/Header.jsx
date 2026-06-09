"use client";

import Link from "next/link";

export default function Header({ isMuted, setIsMuted }) {
  return (
    <header className="w-full bg-[#090d14] border-b border-gray-800/40 px-4 sm:px-8 py-4 flex items-center justify-between select-none">
      {/* Logo Branding Icon Layout */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#087e8b] to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(8,126,139,0.5)]">
          <span className="text-white text-xs font-black">P</span>
        </div>
        <div>
          <h1 className="text-sm font-black uppercase tracking-wider text-white leading-none">PLINKO LAB</h1>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mt-0.5">PROVABLY FAIR</span>
        </div>
      </div>

      {/* Control Triggers Bar Layout */}
      <div className="flex items-center gap-3">
        <div className="bg-[#0f1922] border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block animate-ping" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">LIVE</span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          type="button"
          className="h-8 px-3 rounded-lg bg-[#121824] border border-gray-700/40 text-gray-300 font-bold text-xs flex items-center gap-1.5 hover:text-white hover:bg-[#182132] transition-all"
        >
          <span>{isMuted ? "🔇" : "🔊"}</span>
          <span>Sound</span>
        </button>

        <Link
          href="/verify"
          className="h-8 px-3 rounded-lg bg-[#121824] border border-[#087e8b]/30 text-cyan-400 font-bold text-xs flex items-center gap-1.5 hover:bg-[#087e8b]/10 transition-all shadow-[0_0_10px_rgba(8,126,139,0.1)]"
        >
          <span>Verify Round</span>
          <span className="text-[10px]">↗</span>
        </Link>
      </div>
    </header>
  );
}