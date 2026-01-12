import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Gem, RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BetControls } from '@/components/game/BetControls';
import { BetHistory } from '@/components/game/BetHistory';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const GRID_SIZE = 25;

export function Mines() {
    const { placeBet, settleBet } = useGame();
    const [minesCount, setMinesCount] = useState(3);
    const [gameActive, setGameActive] = useState(false);
    const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
    const [mineLocations, setMineLocations] = useState<number[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [currentMultiplier, setCurrentMultiplier] = useState(1);
    const [currentBet, setCurrentBet] = useState(0);
    const [hitMine, setHitMine] = useState(false);

    const calculateMultiplier = (revealed: number): number => {
        if (revealed === 0) return 1;
        const safeTiles = GRID_SIZE - minesCount;
        let mult = 1;
        for (let i = 0; i < revealed; i++) {
            mult *= safeTiles / (safeTiles - i);
        }
        return parseFloat((mult * 0.97).toFixed(4)); // 3% house edge
    };

    const handleBet = useCallback((amount: number) => {
        if (!placeBet(amount)) return;

        const mines: number[] = [];
        while (mines.length < minesCount) {
            const pos = Math.floor(Math.random() * GRID_SIZE);
            if (!mines.includes(pos)) mines.push(pos);
        }

        setMineLocations(mines);
        setRevealedTiles([]);
        setGameOver(false);
        setGameActive(true);
        setCurrentMultiplier(1);
        setCurrentBet(amount);
        setHitMine(false);
    }, [placeBet, minesCount]);

    const clickTile = (index: number) => {
        if (!gameActive || gameOver || revealedTiles.includes(index)) return;

        if (mineLocations.includes(index)) {
            // Hit a mine
            setRevealedTiles([...revealedTiles, index]);
            setGameOver(true);
            setGameActive(false);
            setHitMine(true);
            settleBet('mines', currentBet, 0, false);
        } else {
            // Safe tile
            const newRevealed = [...revealedTiles, index];
            setRevealedTiles(newRevealed);
            const newMult = calculateMultiplier(newRevealed.length);
            setCurrentMultiplier(newMult);

            // Check if all safe tiles revealed
            if (newRevealed.length === GRID_SIZE - minesCount) {
                handleCashout();
            }
        }
    };

    const handleCashout = () => {
        if (!gameActive || gameOver || revealedTiles.length === 0) return;

        settleBet('mines', currentBet, currentMultiplier, true);
        setGameOver(true);
        setGameActive(false);

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    };

    const getTileContent = (i: number) => {
        if (gameOver && mineLocations.includes(i)) {
            return <Bomb className="w-6 h-6 text-red-500" />;
        }
        if (revealedTiles.includes(i)) {
            return <Gem className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />;
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main game area */}
            <div className="lg:col-span-2 space-y-6">
                <div className="game-card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                <Bomb className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Mines</h1>
                                <p className="text-sm text-[var(--text-muted)]">{minesCount} mines on grid</p>
                            </div>
                        </div>

                        {gameActive && (
                            <div className="text-right">
                                <div className="text-sm text-[var(--text-muted)]">Current Multiplier</div>
                                <div className="text-2xl font-bold text-[var(--accent)]">{currentMultiplier.toFixed(2)}x</div>
                            </div>
                        )}
                    </div>

                    {/* Game grid */}
                    <div className="bg-[var(--bg-primary)] rounded-2xl p-4 mb-6">
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: GRID_SIZE }).map((_, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => clickTile(i)}
                                    disabled={!gameActive || revealedTiles.includes(i)}
                                    className={cn(
                                        "aspect-square rounded-lg flex items-center justify-center transition-all border",
                                        revealedTiles.includes(i)
                                            ? mineLocations.includes(i) && gameOver
                                                ? "bg-red-500/20 border-red-500"
                                                : "bg-emerald-500/10 border-emerald-500/50"
                                            : gameActive
                                                ? "bg-[var(--bg-elevated)] border-[var(--border)] hover:bg-[var(--border)] hover:border-[var(--accent)]/50 cursor-pointer"
                                                : "bg-[var(--bg-elevated)] border-[var(--border)] opacity-50"
                                    )}
                                    whileHover={gameActive && !revealedTiles.includes(i) ? { scale: 1.05 } : {}}
                                    whileTap={gameActive && !revealedTiles.includes(i) ? { scale: 0.95 } : {}}
                                >
                                    <AnimatePresence>
                                        {getTileContent(i) && (
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0 }}
                                            >
                                                {getTileContent(i)}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Game result */}
                    {gameOver && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "text-center py-4 rounded-xl mb-6",
                                hitMine ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                            )}
                        >
                            <div className="text-2xl font-bold">
                                {hitMine
                                    ? 'You hit a mine!'
                                    : `Cashed out $${(currentBet * currentMultiplier).toFixed(2)}!`}
                            </div>
                        </motion.div>
                    )}

                    {/* Controls */}
                    {!gameActive ? (
                        <div className="space-y-4">
                            {/* Mines selector */}
                            <div>
                                <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                                    Number of Mines
                                </label>
                                <div className="flex gap-2">
                                    {[1, 3, 5, 10, 24].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setMinesCount(n)}
                                            className={cn(
                                                "flex-1 py-3 rounded-lg font-bold transition-all",
                                                minesCount === n
                                                    ? "bg-[var(--accent)] text-black"
                                                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                                            )}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <BetControls
                                onBet={handleBet}
                                buttonText="Start Game"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={handleCashout}
                            disabled={revealedTiles.length === 0}
                            className="bet-button w-full py-4 rounded-xl text-lg"
                        >
                            Cashout ${(currentBet * currentMultiplier).toFixed(2)}
                        </button>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="game-card p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Recent Bets
                    </h3>
                    <BetHistory />
                </div>
            </div>
        </div>
    );
}
