import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bomb, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';
import confetti from 'canvas-confetti';

const GRID_SIZE = 25;

export function Mines() {
    const { balance, placeBet, winBet, loseBet } = useGame();
    const [betAmount, setBetAmount] = useState(10);
    const [minesCount, setMinesCount] = useState(3);
    const [gameActive, setGameActive] = useState(false);
    const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
    const [mineLocations, setMineLocations] = useState<number[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [currentMultiplier, setCurrentMultiplier] = useState(1);

    const startGame = () => {
        if (!placeBet(betAmount)) return;

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
    };

    const clickTile = (index: number) => {
        if (!gameActive || gameOver || revealedTiles.includes(index)) return;

        if (mineLocations.includes(index)) {
            setRevealedTiles([...revealedTiles, index]);
            setGameOver(true);
            setGameActive(false);
            loseBet();
        } else {
            const newRevealed = [...revealedTiles, index];
            setRevealedTiles(newRevealed);
            const newMult = 1 + (newRevealed.length * 0.2 * (minesCount / 3));
            setCurrentMultiplier(parseFloat(newMult.toFixed(2)));

            if (newRevealed.length === GRID_SIZE - minesCount) {
                cashout();
            }
        }
    };

    const cashout = () => {
        if (!gameActive || gameOver || revealedTiles.length === 0) return;

        const winAmount = betAmount * currentMultiplier;
        winBet(winAmount);
        setGameOver(true);
        setGameActive(false);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    };

    const getTileContent = (i: number) => {
        if (gameOver && mineLocations.includes(i)) {
            return <Bomb className="w-6 h-6 text-red-500 animate-pulse" />;
        }
        if (revealedTiles.includes(i)) {
            return <Gem className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] p-4">
            <div className="max-w-lg mx-auto">
                <Link to="/casino" className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Casino
                </Link>

                <Card variant="glass">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
                                    <Bomb className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Mines</h1>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{minesCount} mines</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">Balance</div>
                                <div className="text-xl font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                            </div>
                        </div>

                        {gameActive && (
                            <div className="text-center mb-4">
                                <div className="text-sm text-[hsl(var(--muted-foreground))]">Multiplier</div>
                                <div className="text-3xl font-bold text-[var(--accent)]">{currentMultiplier}x</div>
                                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Potential: ${(betAmount * currentMultiplier).toFixed(2)}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {Array.from({ length: GRID_SIZE }).map((_, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => clickTile(i)}
                                    disabled={!gameActive || revealedTiles.includes(i)}
                                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${revealedTiles.includes(i)
                                            ? mineLocations.includes(i) && gameOver
                                                ? 'bg-red-500/30 border-red-500'
                                                : 'bg-emerald-500/20 border-emerald-500'
                                            : gameActive
                                                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[var(--accent)]/50 cursor-pointer'
                                                : 'bg-white/5 border-white/5'
                                        } border`}
                                    whileHover={gameActive && !revealedTiles.includes(i) ? { scale: 1.05 } : {}}
                                    whileTap={gameActive && !revealedTiles.includes(i) ? { scale: 0.95 } : {}}
                                >
                                    <AnimatePresence>
                                        {getTileContent(i) && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                {getTileContent(i)}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            ))}
                        </div>

                        {gameOver && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-center mb-4 text-xl font-bold ${revealedTiles.some(t => mineLocations.includes(t)) ? 'text-red-400' : 'text-green-400'
                                    }`}
                            >
                                {revealedTiles.some(t => mineLocations.includes(t))
                                    ? 'BOOM!'
                                    : `Cashed out $${(betAmount * currentMultiplier).toFixed(2)}!`}
                            </motion.div>
                        )}

                        {!gameActive ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Bet</label>
                                        <input
                                            type="number"
                                            value={betAmount}
                                            onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-[var(--accent)]/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Mines</label>
                                        <input
                                            type="number"
                                            value={minesCount}
                                            onChange={(e) => setMinesCount(Math.min(24, Math.max(1, Number(e.target.value))))}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-[var(--accent)]/50"
                                        />
                                    </div>
                                </div>
                                <Button onClick={startGame} disabled={balance < betAmount || betAmount <= 0} className="w-full" size="lg">
                                    START GAME
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={cashout} disabled={revealedTiles.length === 0} className="w-full" size="lg">
                                CASHOUT ${(betAmount * currentMultiplier).toFixed(2)}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
