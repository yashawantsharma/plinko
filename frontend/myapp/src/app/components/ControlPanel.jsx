"use client";

export default function ControlPanel({ 
  bet, setBet, clientSeed, setClientSeed, isDropping, onDrop 
}) {
  return (
   
    <section className="rounded-xl border border-gray-800/60 bg-[#0d131f] p-5 shadow-2xl h-fit">
      
      {/* Bet Amount Input Section */}
      <div>
        <label className="text-sm font-bold text-gray-300" htmlFor="bet">
          Bet Amount
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            id="bet"
            type="number"
            value={bet}
            disabled={isDropping}
            className="h-11 w-full rounded-md border border-gray-700/50 bg-[#090d14] px-3 font-semibold text-white outline-none focus:border-[#087e8b] disabled:opacity-40"
            min="10"
            step="10"
            onChange={(e) => setBet(Number(e.target.value))}
          />
          <span className="text-sm font-semibold text-gray-400">cents</span>
        </div>
      </div>

      {/* Client Seed Input Section */}
      <div className="mt-4">
        <label className="text-sm font-bold text-gray-300" htmlFor="clientSeed">
          Client Seed
        </label>
        <input
          id="clientSeed"
          type="text"
          value={clientSeed}
          disabled={isDropping}
          className="mt-2 h-11 w-full rounded-md border border-gray-700/50 bg-[#090d14] px-3 text-sm font-mono text-white outline-none focus:border-[#087e8b] disabled:opacity-40"
          onChange={(e) => setClientSeed(e.target.value)}
        />
      </div>

      {/* Static Drop Info Indicator */}
      <div className="mt-5 text-xs text-gray-400 font-medium bg-[#090d14] p-2.5 rounded-lg border border-gray-800/40">
        🎯 Ball will drop from <span className="font-bold text-cyan-400">Column #1</span> by default.
      </div>

      {/* Action Play Trigger Button */}
      <button
        className="mt-5 h-12 w-full rounded-md bg-[#087e8b] px-4 font-black text-white transition hover:bg-[#066a75] disabled:bg-gray-800 disabled:text-gray-500 shadow-sm cursor-pointer"
        disabled={isDropping}
        onClick={onDrop}
        type="button"
      >
        {isDropping ? "Dropping..." : "Drop Ball (Space)"}
      </button>
      
    </section>
  );
}