"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ControlPanel from "./components/ControlPanel";
import RecentRounds from "./components/RecentRounds";
import WinModal from "./components/WinModal";
import Header from "./components/Header";
import WelcomeScreen from "./components/WelcomeScreen";
import ProvablyFairPanel from "./components/ProvablyFairPanel";

const PlinkoBoard = dynamic(() => import("./components/PlinkoBoard"), {
  ssr: false,
});

const ROWS = 12;
const MULTIPLIERS = [10, 5.0, 3.0, 1.5, 1.0, 0.5, 0.3, 0.5, 1.0, 1.5, 3.0, 5.0, 10];

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [bet, setBet] = useState(100);
  const [clientSeed, setClientSeed] = useState("candidate-hello");
  const [selectedColumn, setSelectedColumn] = useState(1); // Default column un-locked for flexible drop mapping
  
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDropping, setIsDropping] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [activeRoundId, setActiveRoundId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [tiltMode, setTiltMode] = useState(false);
  const [debugGrid, setDebugGrid] = useState(false);

  const [provablyFairData, setProvablyFairData] = useState(null);

  // const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
  const API_BASE = "https://plinko-t7oi.onrender.com";

  const fetchRoundsHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rounds`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.map(r => ({
          id: r.roundId || r.id,
          payoutMultiplier: r.payoutMultiplier || 0,
          binIndex: r.binIndex,
          payoutCents: r.payoutCents
        })));
      }
    } catch (e) {
      console.error("Failed syncing rounds database history logs context.", e);
    }
  };
  // server file

  useEffect(() => {
    if (hasStarted) {
      fetchRoundsHistory();
    }
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const handleKeyDown = (e) => {
      if (!isDropping && (e.key === " " || e.key === "Spacebar")) {
        e.preventDefault();
        playRound();
      }
      if (e.key.toLowerCase() === "t") setTiltMode((prev) => !prev);
      if (e.key.toLowerCase() === "g") setDebugGrid((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDropping, bet, clientSeed, hasStarted, selectedColumn]);

  const playRound = async () => {
    if (isDropping) return;

    setResult(null);
    setShowWinModal(false);
    setIsDropping(true);

    try {
      const betCents = Number(bet);
      const dropColumn = Number(selectedColumn);

      const commitRes = await fetch(`${API_BASE}/api/rounds/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!commitRes.ok) throw new Error("commitRound sequence pipeline structural error.");
      const commitJson = await commitRes.json();

      setActiveRoundId(commitJson.roundId);
      
      setProvablyFairData({
        roundId: commitJson.roundId,
        nonce: commitJson.nonce,
        commitHex: commitJson.commitHex || commitJson.serverSeedCommit, 
        serverSeed: null 
      });

      const startRes = await fetch(`${API_BASE}/api/rounds/${commitJson.roundId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSeed, betCents, dropColumn }),
      });

      if (!startRes.ok) throw new Error("startRound mapping process computation rejected.");
      const startJson = await startRes.json();

      setResult({
        path: startJson.path,
        binIndex: startJson.binIndex,
        payoutMultiplier: startJson.payoutMultiplier,
        payoutCents: startJson.payoutCents || (betCents * startJson.payoutMultiplier),
      });

    } catch (e) {
      console.error(e);
      setIsDropping(false);
    }
  };

  const handleAnimationComplete = async () => {
    if (!result) {
      setIsDropping(false);
      return;
    }

    const calculatedWinCents = Number(bet) * result.payoutMultiplier;

    setModalData({
      bet: Number(bet),
      multiplier: result.payoutMultiplier,
      win: calculatedWinCents, 
      roundId: activeRoundId,
      nonce: provablyFairData?.nonce
    });

    setShowWinModal(true);
    setIsDropping(false);

    await fetchRoundsHistory();

    import("canvas-confetti").then((confetti) => {
      confetti.default({ particleCount: 120, spread: 80, origin: { y: 0.65 } });
    });
  };

  const handleRevealSeed = async () => {
    if (!activeRoundId) return;
    try {
      const res = await fetch(`${API_BASE}/api/rounds/${activeRoundId}/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const revealJson = await res.json();
        setProvablyFairData(prev => ({
          ...prev,
          serverSeed: revealJson.serverSeed || revealJson.seed
        }));
        setActiveRoundId(null); 
      }
    } catch (e) {
      console.error("Crypto sequence payload reveal vector network exception error.", e);
    }
  };

  if (!hasStarted) {
    return <WelcomeScreen onStart={() => setHasStarted(true)} />;
  }

  return (
    /* FIXED: Background updated to high-end deep cinematic charcoal dark mode layout grid */
    <main className="min-h-screen bg-[#090d14] text-gray-100 pb-10 flex flex-col font-sans antialiased">
      <Header isMuted={isMuted} setIsMuted={setIsMuted} />
      <WinModal show={showWinModal} data={modalData} onClose={() => setShowWinModal(false)} />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 pt-6 lg:grid-cols-[340px_1fr_320px] lg:px-6 flex-1">
        
        {/* Left Hand Actions Column block */}
        <div className="order-1 lg:order-none w-full flex flex-col gap-4">
          <ControlPanel 
            bet={bet} 
            setBet={setBet} 
            clientSeed={clientSeed} 
            setClientSeed={setClientSeed} 
            isDropping={isDropping} 
            onDrop={playRound} 
            selectedColumn={selectedColumn} 
            setSelectedColumn={setSelectedColumn} 
          />
          {/* <ProvablyFairPanel data={provablyFairData} activeRoundId={activeRoundId} onReveal={handleRevealSeed} isDropping={isDropping} /> */}
        </div>

        {/* Center Plinko Graphical Canvas block - Stays prominent & large */}
        <div className="order-2 lg:order-none w-full min-w-0 bg-[#0d131f] border border-gray-800/60 rounded-xl p-4 shadow-2xl">
          <PlinkoBoard 
            ROWS={ROWS} 
            MULTIPLIERS={MULTIPLIERS} 
            result={result} 
            isDropping={isDropping} 
            isMuted={isMuted} 
            tiltMode={tiltMode} 
            debugGrid={debugGrid} 
            selectedColumn={selectedColumn} 
            onAnimationComplete={handleAnimationComplete} 
          />
        </div>

        {/* Right Hand Live Records History tracking block */}
        <div className="order-3 lg:order-none w-full">
          <RecentRounds bet={bet} result={result} isDropping={isDropping} history={history} />
        </div>

      </div>
    </main>
  );
}