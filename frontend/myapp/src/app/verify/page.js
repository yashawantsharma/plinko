
"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("candidate-hello");

  // UUID nonce string
  const [nonce, setNonce] = useState("");

  const [dropColumn, setDropColumn] = useState("1");

  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  const handleVerify = async (e) => {
//     console.log(serverSeed);
// console.log(clientSeed);
// console.log(nonce);
    e.preventDefault();

    setLoading(true);
    setVerificationResult(null);

    try {
      const res = await fetch(
  `${API_BASE}/api/rounds/verify?serverSeed=${serverSeed}&clientSeed=${clientSeed}&nonce=${nonce}&dropColumn=${dropColumn}`
);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setVerificationResult(data);
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Verification Failed: Please verify parameters."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090d14] text-gray-100 p-4 sm:p-8 flex flex-col items-center justify-center antialiased">
      <div className="w-full max-w-4xl bg-[#0d131f] rounded-2xl border border-gray-800/60 shadow-2xl p-6 sm:p-8 relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 to-[#087e8b] rounded-t-2xl" />

        <div className="mb-6 border-b border-gray-800/40 pb-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded text-amber-400 text-[10px] font-black tracking-wider uppercase mb-2">
            🧮 AUDITOR ENGINE
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Independent Provably Fair Auditor
          </h1>

          <p className="text-xs text-gray-400 mt-1 font-medium">
            Recompute backend crypto matrix generation parameters.
          </p>
        </div>

        <form
          onSubmit={handleVerify}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                Server Seed
              </label>

              <input
                required
                type="text"
                value={serverSeed}
                onChange={(e) =>
                  setServerSeed(e.target.value)
                }
                className="w-full h-11 bg-[#090d14] border border-gray-700/50 rounded-lg px-3.5 font-mono text-xs text-white"
                placeholder="Paste revealed server seed"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                Client Seed
              </label>

              <input
                required
                type="text"
                value={clientSeed}
                onChange={(e) =>
                  setClientSeed(e.target.value)
                }
                className="w-full h-11 bg-[#090d14] border border-gray-700/50 rounded-lg px-3.5 font-mono text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                  Nonce
                </label>

                <input
                  required
                  type="text"
                  value={nonce}
                  onChange={(e) =>
                    setNonce(e.target.value)
                  }
                  className="w-full h-11 bg-[#090d14] border border-gray-700/50 rounded-lg px-3.5 font-mono text-xs text-white"
                  placeholder="UUID nonce"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                  Drop Column
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  value={dropColumn}
                  onChange={(e) =>
                    setDropColumn(e.target.value)
                  }
                  className="w-full h-11 bg-[#090d14] border border-gray-700/50 rounded-lg px-3.5 font-mono text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-[#087e8b] to-cyan-500 hover:from-[#066a75] hover:to-cyan-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-black text-xs uppercase tracking-wider rounded-xl"
            >
              {loading
                ? "VERIFYING..."
                : "VERIFY MATHEMATICAL INTEGRITY"}
            </button>
          </div>

          <div className="bg-[#090d14] border border-gray-800/40 rounded-xl p-5 text-white min-h-[320px]">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#ff4d3d] block mb-4">
              Audit Engine Response Output
            </span>

            {verificationResult ? (
              <div className="space-y-4 font-mono text-[11px]">
                <div>
                  <p className="text-gray-500 text-[9px] uppercase mb-1">
                    Commit Hash
                  </p>

                  <p className="text-cyan-400 break-all">
                    {verificationResult.commitHex}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-[9px] uppercase mb-1">
                    Combined Seed
                  </p>

                  <p className="break-all">
                    {verificationResult.combinedSeed}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-[9px] uppercase mb-1">
                    Bin Index
                  </p>

                  <p className="text-amber-400 font-bold">
                    {verificationResult.binIndex}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-[9px] uppercase mb-1">
                    Multiplier
                  </p>

                  <p className="text-amber-400 font-bold">
                    {verificationResult.payoutMultiplier}x
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-[9px] uppercase mb-1">
                    Peg Map Hash
                  </p>

                  <p className="break-all">
                    {verificationResult.pegMapHash}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-[9px] uppercase mb-1">
                    Path
                  </p>

                  <pre className="text-green-400 whitespace-pre-wrap">
                    {JSON.stringify(
                      verificationResult.path,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-gray-500 text-xs">
                Enter parameters and verify.
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
