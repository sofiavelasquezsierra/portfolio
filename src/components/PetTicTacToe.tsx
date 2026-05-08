"use client";

import { useEffect, useState } from "react";

type Cell = "X" | "O" | null;
type Result = "x" | "o" | "draw" | null;

const STATS_KEY = "sofia.pet.ttt";

const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
];

function checkWinner(board: Cell[]): Cell {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getWinningLine(board: Cell[]): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

/**
 * Pet plays O. The AI uses a simple heuristic — win if possible, else block,
 * else center, else corner, else side. With a small (25%) chance to play a
 * random move so it's beatable. Pure minimax would draw every game and feel
 * mean.
 */
function pickPetMove(board: Cell[]): number {
  if (Math.random() < 0.25) {
    const empty = board
      .map((v, i) => (v === null ? i : -1))
      .filter((i) => i >= 0);
    if (empty.length > 0) {
      return empty[Math.floor(Math.random() * empty.length)];
    }
  }

  // Win if possible
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const test = [...board];
      test[i] = "O";
      if (checkWinner(test) === "O") return i;
    }
  }
  // Block opponent
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const test = [...board];
      test[i] = "X";
      if (checkWinner(test) === "X") return i;
    }
  }
  // Take center
  if (board[4] === null) return 4;
  // Take a corner
  for (const c of [0, 2, 6, 8]) {
    if (board[c] === null) return c;
  }
  // Take a side
  for (const c of [1, 3, 5, 7]) {
    if (board[c] === null) return c;
  }
  return -1;
}

function pick<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

function petSay(text: string, ms = 1600) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("pet:say", { detail: { text, ms } }));
}

export default function PetTicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"user" | "pet">("user");
  const [result, setResult] = useState<Result>(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setStats({
          wins: parsed?.wins ?? 0,
          losses: parsed?.losses ?? 0,
          draws: parsed?.draws ?? 0,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  function recordResult(updater: (s: typeof stats) => typeof stats) {
    setStats((s) => {
      const next = updater(s);
      try {
        localStorage.setItem(STATS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function handleClick(i: number) {
    if (turn !== "user" || board[i] || result) return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);

    const win = checkWinner(next);
    if (win === "X") {
      setResult("x");
      recordResult((s) => ({ ...s, wins: s.wins + 1 }));
      setTimeout(
        () =>
          petSay(
            pick([
              "aww you got me",
              "good game!",
              "ggwp",
              "next time...",
              "rematch?",
            ]),
            1800
          ),
        450
      );
    } else if (next.every((c) => c !== null)) {
      setResult("draw");
      recordResult((s) => ({ ...s, draws: s.draws + 1 }));
      setTimeout(() => petSay(pick(["we tied!", "draw.", "tie."]), 1500), 450);
    } else {
      setTurn("pet");
    }
  }

  // Pet's turn
  useEffect(() => {
    if (turn !== "pet" || result) return;
    setThinking(true);
    petSay(pick(["thinking...", "hmm...", "let me see"]), 1100);

    const t = setTimeout(() => {
      const move = pickPetMove(board);
      if (move >= 0) {
        const next = [...board];
        next[move] = "O";
        setBoard(next);

        const win = checkWinner(next);
        if (win === "O") {
          setResult("o");
          recordResult((s) => ({ ...s, losses: s.losses + 1 }));
          setTimeout(
            () =>
              petSay(
                pick(["i win!", "yes!", "haha", "got you", "took me a sec"]),
                1800
              ),
            450
          );
        } else if (next.every((c) => c !== null)) {
          setResult("draw");
          recordResult((s) => ({ ...s, draws: s.draws + 1 }));
          setTimeout(() => petSay("tie!", 1500), 450);
        } else {
          setTurn("user");
        }
      }
      setThinking(false);
    }, 800);

    return () => clearTimeout(t);
  }, [turn, board, result]);

  function newGame() {
    setBoard(Array(9).fill(null));
    setTurn("user");
    setResult(null);
    petSay("new game!", 1300);
  }

  const winningLine = result ? getWinningLine(board) : null;

  return (
    <section className="mt-8">
      <div className="max-w-md mx-auto rounded-3xl border-4 border-ink/85 bg-ink/95 text-cream p-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
        <p className="text-[10px] tracking-[0.32em] uppercase opacity-60">
          mini-game
        </p>
        <h3 className="font-serif text-3xl mt-1">tic-tac-toe</h3>
        <p className="mt-1 text-xs opacity-70">
          you&apos;re ×, pet is ○
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 font-mono">
          <Stat label="won" value={stats.wins} />
          <Stat label="drew" value={stats.draws} />
          <Stat label="lost" value={stats.losses} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
          {board.map((cell, i) => {
            const isWinning = winningLine ? winningLine.includes(i) : false;
            const disabled = !!cell || !!result || turn !== "user";
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={disabled}
                aria-label={`cell ${i + 1}${cell ? ` ${cell}` : " empty"}`}
                className={`cursor-target aspect-square rounded-lg border ${
                  isWinning
                    ? "border-rose bg-rose/20 text-rose"
                    : "border-cream/20"
                } flex items-center justify-center text-3xl font-serif transition-colors ${
                  !cell && !result && turn === "user"
                    ? "hover:bg-cream/10"
                    : ""
                } disabled:cursor-not-allowed`}
              >
                {cell === "X" && (
                  <span className={isWinning ? "text-rose" : "text-cream"}>
                    ×
                  </span>
                )}
                {cell === "O" && (
                  <span className={isWinning ? "text-rose" : "text-cream/80"}>
                    ○
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs font-mono opacity-70">
            {result === "x" && "you won! 🎉"}
            {result === "o" && "pet won."}
            {result === "draw" && "draw."}
            {!result && (turn === "user" ? "your move" : "pet's move...")}
          </p>
          <button
            onClick={newGame}
            disabled={thinking && !result}
            className="cursor-target px-3 py-1.5 rounded-lg border border-cream/30 text-cream/80 text-xs hover:border-cream hover:text-cream transition-colors disabled:opacity-40"
          >
            {result ? "play again" : "new game"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.2em] opacity-50">
        {label}
      </p>
      <p className="font-serif text-3xl mt-0.5">
        {value.toString().padStart(2, "0")}
      </p>
    </div>
  );
}
