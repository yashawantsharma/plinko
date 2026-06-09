"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const money = (cents) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((Number(cents) || 0) / 100);

// RESPONSIVE GRAPHICS ENGINE: Dynamic coordinates based on current boardSize
const getBallPoint = (position, boardSize, ROWS) => {
  const { width, height } = boardSize;
  const topOffset = 25; 
  const bottomOffset = height - 65;
  const row = Number(position?.row);
  const column = Number(position?.column);

  let y = row === -1 ? topOffset : topOffset + ((row + 1) / (ROWS + 1)) * (bottomOffset - topOffset);
  if (row === ROWS) y = bottomOffset + 30;

  const boardCenter = width / 2;
  const pegSpacingX = Math.min(34, width / 16); 
  return { x: row === -1 ? boardCenter : boardCenter + (column - (row + 3 - 1) / 2) * pegSpacingX, y };
};

const getPegPoint = (row, column, boardSize, ROWS) => {
  const { width, height } = boardSize;
  const boardCenter = width / 2;
  const pegSpacingX = Math.min(34, width / 16);
  return {
    x: boardCenter + (column - (row + 3 - 1) / 2) * pegSpacingX,
    y: 55 + (row / (ROWS - 1)) * (height - 80 - 55),
  };
};

export default function PlinkoBoard({ 
  ROWS, MULTIPLIERS, result, isDropping, isMuted, tiltMode, debugGrid, selectedColumn, onAnimationComplete 
}) {
  const boardRef = useRef(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastKeyframeIndex = useRef(-1);
  
  const [boardSize, setBoardSize] = useState({ width: 600, height: 450 });
  const [activeBin, setActiveBin] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  // FIXED: Explicit AudioContext initializer setup linked to modern browser gesture framework
  const initAudioContext = () => {
    if (typeof window === "undefined" || isMuted) return null;
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playCollisionSound = (frequency = 600, duration = 0.08) => {
    if (isMuted) return;
    try {
      const ctx = initAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency / 2, ctx.currentTime + duration);
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio engine failed to emit collision node:", e);
    }
  };

  // FIXED: Automatically force unlock audio contexts the moment the ball begins a dropping phase
  useEffect(() => {
    if (isDropping) {
      initAudioContext();
    }
  }, [isDropping]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const currentWidth = Math.floor(entry.contentRect.width);
      const calculatedHeight = Math.floor(currentWidth * 0.85); 
      setBoardSize({
        width: currentWidth,
        height: Math.max(340, calculatedHeight),
      });
    });
    resizeObserver.observe(board);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = boardSize.width * pixelRatio;
    canvas.height = boardSize.height * pixelRatio;
    canvas.style.width = `${boardSize.width}px`;
    canvas.style.height = `${boardSize.height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    
    // FIXED: Background canvas matching the matte dark framework palette #090d14
    context.fillStyle = "#090d14";
    context.fillRect(0, 0, boardSize.width, boardSize.height);

    const pegRadius = boardSize.width < 450 ? 3 : 4.5;

    for (let row = 0; row < ROWS; row++) {
      for (let column = 0; column < row + 3; column++) {
        const point = getPegPoint(row, column, boardSize, ROWS);
        context.beginPath();
        context.fillStyle = "rgba(255, 255, 255, 0.85)";
        context.arc(point.x, point.y, pegRadius, 0, Math.PI * 2);
        context.fill();
      }
    }
  }, [boardSize, ROWS]);

  const ballPath = useMemo(() => {
    const start = { row: -1, column: selectedColumn };
    const path = result?.path || [];
    return [start, ...path].map((pos) => getBallPoint(pos, boardSize, ROWS));
  }, [boardSize, result, ROWS, selectedColumn]);

  useEffect(() => { 
    if (!isDropping) { lastKeyframeIndex.current = -1; setActiveBin(null); } 
  }, [isDropping]);

  const handleBallUpdate = (latest) => {
    if (!isDropping || ballPath.length === 0) return;
    const ballOffset = boardSize.width < 450 ? 6 : 10;
    
    for (let i = 0; i < ballPath.length; i++) {
      const matchDistance = Math.hypot(latest.x - (ballPath[i].x - ballOffset), latest.y - (ballPath[i].y - ballOffset));
      
      // FIXED: Increased collision checking radius from 12 to 14 for reliable cross-browser tick logging
      if (matchDistance < 14 && lastKeyframeIndex.current !== i) {
        lastKeyframeIndex.current = i;
        const isLastPeg = i === ballPath.length - 1;
        
        if (isLastPeg && result) setActiveBin(result.binIndex);
        
        // Crisp collision tones configuration
        playCollisionSound(isLastPeg ? 260 : 420 + i * 16, isLastPeg ? 0.28 : 0.06);
        break;
      }
    }
  };

  const currentBallSizeClass = boardSize.width < 450 ? "h-3 w-3" : "h-5 w-5";
  const ballOffsetAmount = boardSize.width < 450 ? 6 : 10;

  return (
    <section 
      style={{ transform: tiltMode ? "rotate(3deg)" : "rotate(0deg)", transition: "transform 0.4s ease" }}
      className="flex flex-col rounded-xl border border-gray-800/60 bg-[#0d131f] p-4 shadow-2xl relative overflow-hidden w-full select-none"
    >
      {tiltMode && (
        <div className="absolute top-3 left-3 bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)] z-30 animate-pulse tracking-wider uppercase">
          🕹️ TILT ACTIVE
        </div>
      )}

      <div className="flex items-center justify-between border-b border-gray-800/40 pb-3 text-white z-10">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-200">Board View</h2>
          <p className="text-[10px] text-gray-500 hidden sm:block mt-0.5">Press &apos;T&apos; for Tilt • &apos;G&apos; for Debug Grid</p>
        </div>
        <div className="rounded-lg bg-[#090d14] border border-gray-800/50 px-3 py-1 text-right min-w-[90px]">
          <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Payout</p>
          <p className="text-sm font-mono font-black text-emerald-400">
            {result && !isDropping ? money(result.payoutCents) : money(0)}
          </p>
        </div>
      </div>

      <div className="relative mt-3 flex flex-1 flex-col justify-end overflow-hidden rounded-xl bg-[#090d14] pb-3 border border-gray-800/30">
        <div ref={boardRef} className="relative min-h-[340px] flex-1 overflow-hidden w-full">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" />
          
          {debugGrid && (
            <div className="absolute inset-0 pointer-events-none z-10 text-[8px] font-mono text-cyan-400">
              {result?.path?.map((step, idx) => {
                const pt = getBallPoint(step, boardSize, ROWS);
                return (
                  <span key={idx} style={{ left: pt.x - 5, top: pt.y - 14 }} className="absolute bg-black/90 px-1 border border-gray-800/60 rounded">
                    {step.randVal?.toFixed(1)}
                  </span>
                );
              })}
            </div>
          )}

          <motion.div
            animate={isDropping ? { 
              x: ballPath.map((p) => p.x - ballOffsetAmount), 
              y: ballPath.map((p) => p.y - ballOffsetAmount), 
              scale: [1, 1.2, 1] 
            } : { 
              x: getBallPoint({ row: -1, column: selectedColumn }, boardSize, ROWS).x - ballOffsetAmount, 
              y: getBallPoint({ row: -1, column: selectedColumn }, boardSize, ROWS).y - ballOffsetAmount, 
              scale: 1 
            }}
            className={`absolute left-0 top-0 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-20 ${currentBallSizeClass}`}
            onUpdate={handleBallUpdate} 
            onAnimationComplete={onAnimationComplete}
            transition={isDropping ? { duration: prefersReducedMotion ? 1.0 : 4.2, ease: "easeOut", times: ballPath.map((_, i) => i / Math.max(1, ballPath.length - 1)) } : { duration: 0 }}
          />
        </div>

        {/* Bins Row */}
        <div className="relative mt-2 flex justify-center gap-[3px] z-10 px-1 w-full">
          {MULTIPLIERS.map((multiplier, index) => {
            let bgStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            if (multiplier >= 20 && multiplier < 41) bgStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            if (multiplier >= 41) bgStyle = "bg-red-500/10 text-red-400 border-red-500/20";
            
            return (
              <div
                key={index}
                className={`flex h-7 sm:h-9 flex-1 items-center justify-center rounded-md font-mono font-black text-[8px] sm:text-[10px] transition-all border shadow-md ${bgStyle} ${
                  activeBin === index ? "scale-110 bg-gradient-to-t from-amber-500 to-yellow-400 !text-black border-white ring-2 ring-amber-500/50 z-20" : "opacity-85"
                }`}
              >
                {multiplier}x
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}