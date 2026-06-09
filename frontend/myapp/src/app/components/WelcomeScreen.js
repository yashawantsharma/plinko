"use client";

export default function WelcomeScreen({ onStart }) {
  return (
    /* FIXED: Changed background to ultra dark onyx (#090d14) to match the cinematic game lab theme */
    <div className="fixed inset-0 bg-[#090d14] flex flex-col items-center justify-center p-6 z-50 select-none">
      
      {/* Dynamic Animated Core Background Particles Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#087e8b_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-15 pointer-events-none animate-pulse" />
      
      {/* Minimalistic Interactive Container Box */}
      <div className="text-center max-w-sm w-full flex flex-col items-center relative z-10">
        
        {/* Game Icon Glow Feature */}
        <div className="w-16 h-16 bg-[#087e8b]/10 border-2 border-[#087e8b]/30 text-[#087e8b] text-3xl rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(8,126,139,0.15)] animate-bounce mb-6">
          🎮
        </div>

        {/* Branding Headers */}
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff4d3d]">
          Daphnis Labs
        </p>
        
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3 tracking-tight">
          Plinko <span className="bg-gradient-to-r from-cyan-400 to-[#087e8b] bg-clip-text text-transparent">Lab</span>
        </h1>
        
        <p className="text-xs text-gray-400 font-medium mb-10 max-w-xs leading-relaxed">
          Experience provably-fair responsive physics calculations instantly.
        </p>

        {/* High-Interactivity Pulse Action Play Button */}
        <button
          onClick={onStart}
          type="button"
          className="w-full h-14 bg-gradient-to-r from-[#087e8b] to-cyan-500 hover:from-[#0aa2b3] hover:to-cyan-600 text-white font-black text-base rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(8,126,139,0.3)] hover:shadow-[0_4px_30px_rgba(8,126,139,0.5)] active:scale-95 flex items-center justify-center gap-2.5 group cursor-pointer uppercase tracking-wider"
        >
          <span>START GAME</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-light text-xl">
            →
          </span>
        </button>

        {/* Bottom Micro Indicators */}
        <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-wider text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#76d327] shadow-[0_0_8px_#76d327]" /> Engine Live
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> Fully Responsive
          </span>
        </div>

      </div>
    </div>
  );
}