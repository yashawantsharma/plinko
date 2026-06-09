"use client";

export default function RecentRounds({ bet, result, isDropping, history }) {
  return (
    <section className="flex flex-col gap-4 h-fit select-none">
      
      {/* CURRENT ROUND SUMMARY INTERFACE */}
      {/* FIXED: Shifted wrapper to sleek dark template container with sharp neon texts */}
      <div className="rounded-xl border border-gray-800/60 bg-[#0d131f] p-4 shadow-2xl">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-200">Round Result</h2>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Bin Box Segment */}
          <div className="rounded-lg bg-[#090d14] border border-gray-800/30 p-3">
            <p className="text-[9px] font-black tracking-wider text-gray-500 uppercase">Bin Box</p>
            <p className="mt-1 text-sm font-mono font-black text-white">
              {result && !isDropping ? `#${result.binIndex}` : "-"}
            </p>
          </div>
          
          {/* Multiplier Segment */}
          <div className="rounded-lg bg-[#090d14] border border-gray-800/30 p-3">
            <p className="text-[9px] font-black tracking-wider text-gray-500 uppercase">Multiplier</p>
            <p className="mt-1 text-sm font-mono font-black text-cyan-400">
              {result && !isDropping ? `${result.payoutMultiplier}x` : "-"}
            </p>
          </div>
          
          {/* Bet Segment */}
          <div className="rounded-lg bg-[#090d14] border border-gray-800/30 p-3">
            <p className="text-[9px] font-black tracking-wider text-gray-500 uppercase">Bet</p>
            <p className="mt-1 text-sm font-mono font-black text-gray-300">{bet}¢</p>
          </div>
          
          {/* Win Segment */}
          <div className="rounded-lg bg-[#090d14] border border-gray-800/30 p-3">
            <p className="text-[9px] font-black tracking-wider text-gray-500 uppercase">Win</p>
            <p className="mt-1 text-sm font-mono font-black text-emerald-400">
              {result && !isDropping ? `${result.payoutCents}¢` : "0¢"}
            </p>
          </div>
        </div>
      </div>

      {/* SESSION LEDGER DATABASE HISTORY COMPONENT */}
      {/* FIXED: Restructured logs grid framework layout into dark list frames */}
      <div className="rounded-xl border border-gray-800/60 bg-[#0d131f] p-4 shadow-2xl">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-200">Recent Session Rounds</h2>
        
        <div className="mt-3 flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-800">
          {history.length ? (
            history.map((item) => (
              <div 
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-[#090d14] border border-gray-800/40 px-3 py-2.5 text-xs transition-all hover:border-gray-700/60" 
                key={item.id}
              >
                <span className="truncate font-mono font-bold text-gray-400 select-all" title={item.id}>
                  {item.id}
                </span>
                <span className="font-mono font-black text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10 text-right min-w-[50px]">
                  {item.payoutMultiplier}x
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 py-4 text-center">
              No rounds logged.
            </p>
          )}
        </div>
      </div>
      
    </section>
  );
}