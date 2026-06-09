"use client";

import { useState } from "react";

export default function ProvablyFairPanel({ data, activeRoundId, onReveal, isDropping }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    /* FIXED: Container shifted to premium dark surface matching lab grid images */
    <section className="rounded-xl border border-gray-800/60 bg-[#0d131f] p-5 shadow-2xl h-fit">
      <div className="flex items-center justify-between border-b border-gray-800/40 pb-3 mb-4">
        <h3 className="font-black text-xs uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
          🛡️ Provably Fair Engine
        </h3>
        {activeRoundId && (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse uppercase tracking-wider">
            Active Session
          </span>
        )}
      </div>

      <div className="space-y-4 text-xs">
        {/* Round ID Input Field */}
        <div>
          <span className="text-gray-400 font-bold block mb-1.5">Round ID:</span>
          <div className="flex items-center gap-2 bg-[#090d14] p-2.5 rounded-lg border border-gray-700/40 font-mono text-[11px] text-gray-200 break-all select-all">
            <span className="truncate flex-1">{activeRoundId || data?.roundId || "No active round"}</span>
            {activeRoundId && (
              <button onClick={() => handleCopy(activeRoundId)} className="text-cyan-400 hover:text-cyan-300 font-black text-[10px] uppercase tracking-wider px-1">
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
        </div>

        {/* Nonce Track Panel */}
        <div>
          <span className="text-gray-400 font-bold block mb-1.5">Nonce:</span>
          <div className="bg-[#090d14] p-2.5 rounded-lg border border-gray-700/40 font-mono text-[11px] text-gray-200">
            {data?.nonce !== undefined ? data.nonce : "Waiting for drop..."}
          </div>
        </div>

        {/* Server Seed Commit Hash */}
        <div>
          <span className="text-gray-400 font-bold block mb-1.5">Commit Hash (SHA-256):</span>
          <div className="bg-[#090d14] p-2.5 rounded-lg border border-gray-700/40 font-mono text-[11px] text-gray-400 break-all leading-relaxed">
            {data?.commitHex || "Hash vector payload pending"}
          </div>
        </div>

        {/* Revealed Vector Field */}
        <div>
          <span className="text-gray-400 font-bold block mb-1.5">Server Seed (After Reveal):</span>
          <div className="bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20 font-mono text-[11px] text-amber-400/90 break-all">
            {data?.serverSeed || "Encrypted securely on server..."}
          </div>
        </div>
      </div>

      {/* Control Actions CTA */}
      <div className="mt-5 pt-4 border-t border-gray-800/40 flex gap-2">
        <button
          onClick={onReveal}
          disabled={!activeRoundId || isDropping}
          type="button"
          className="flex-1 h-9 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all active:scale-[0.97] cursor-pointer"
        >
          🔍 Reveal Seed
        </button>
        <a
          href="/verify"
          target="_blank"
          className="flex-1 h-9 bg-[#111823] border border-gray-800/80 hover:bg-[#162030] text-gray-200 font-black text-xs uppercase tracking-wider rounded-lg transition-all active:scale-[0.97] flex items-center justify-center gap-1 cursor-pointer"
        >
          🧮 Verify Route →
        </a>
      </div>
    </section>
  );
}