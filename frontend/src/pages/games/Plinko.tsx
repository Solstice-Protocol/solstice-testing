import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BetControls } from '@/components/game/BetControls';
import { BetHistory } from '@/components/game/BetHistory';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

type Risk = 'low' | 'medium' | 'high';

const RISK_MULTIPLIERS: Record<Risk, number[]> = {
    low: [1.2, 1.1, 1, 0.7, 0.5, 0.3, 0.5, 0.7, 1, 1.1, 1.2],
    medium: [2, 1.5, 1.1, 0.7, 0.3, 0.2, 0.3, 0.7, 1.1, 1.5, 2],
    high: [5.6, 2.1, 1.1, 0.5, 0.2, 0, 0.2, 0.5, 1.1, 2.1, 5.6],
};

interface Ball {
    id: number;
    x: number;
    path: number[];
    multiplier: number;
    done: boolean;
}

export function Plinko() {
    const { placeBet, settleBet } = useGame();
    const [risk, setRisk] = useState<Risk>('medium');
    const [rows] = useState(10);
    const [balls, setBalls] = useState<Ball[]>([]);
    const [dropping, setDropping] = useState(false);
    const [lastResult, setLastResult] = useState<{ mult: number; win: boolean } | null>(null);
    const ballIdRef = useRef(0);

    const multipliers = RISK_MULTIPLIERS[risk];

    const handleBet = useCallback(async (amount: number) => {
        if (dropping || !placeBet(amount)) return;

        setDropping(true);
        setLastResult(null);

        // Generate path (left or right at each peg)
        const path: number[] = [];
        let position = 5; // Start middle

        for (let i = 0; i < rows; i++) {
            const direction = Math.random() > 0.5 ? 1 : -1;
            position = Math.max(0, Math.min(10, position + direction));
            path.push(position);
        }

        const finalIndex = Math.min(multipliers.length - 1, Math.max(0, Math.round(position)));
        const multiplier = multipliers[finalIndex];

        const ball: Ball = {
            id: ballIdRef.current++,
            x: 50,
            path,
            multiplier,
            done: false,
        };

        setBalls(prev => [...prev, ball]);

        // Wait for animation
        await new Promise(r => setTimeout(r, 2500));

        const isWin = multiplier > 0;
        setLastResult({ mult: multiplier, win: isWin });
        settleBet('plinko', amount, multiplier, isWin);

        if (multiplier >= 2) {
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        }

        setBalls(prev => prev.filter(b => b.id !== ball.id));
        setDropping(false);
    }, [dropping, placeBet, settleBet, rows, multipliers]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="game-card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Plinko</h1>
                                <p className="text-sm text-[var(--text-muted)]">Drop the ball</p>
                            </div>
                        </div>
                    </div>

                    {/* Plinko board */}
                    <div className="bg-[var(--bg-primary)] rounded-2xl p-4 mb-6 overflow-hidden">
                        <div className="relative h-80">
                            {/* Pegs visualization */}
                            <div className="absolute inset-0 flex flex-col justify-between py-4">
                                {Array.from({ length: rows }).map((_, row) => (
                                    <div key={row} className="flex justify-center gap-6">
                                        {Array.from({ length: row + 3 }).map((_, pegIndex) => (
                                            <div
                                                key={pegIndex}
                                                className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Balls */}
                            <AnimatePresence>
                                {balls.map(ball => (
                                    <motion.div
                                        key={ball.id}
                                        className="absolute w-4 h-4 rounded-full bg-[var(--accent)] shadow-lg"
                                        style={{ left: 'calc(50% - 8px)' }}
                                        initial={{ top: 0 }}
                                        animate={{
                                            top: ['0%', '25%', '50%', '75%', '95%'],
                                            left: ball.path.map((p, _i) => `calc(${10 + p * 8}% - 8px)`),
                                        }}
                                        transition={{ duration: 2.5, ease: 'easeIn' }}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Multiplier slots */}
                        <div className="flex gap-1 mt-2">
                            {multipliers.map((mult, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex-1 py-2 rounded text-center text-xs font-bold",
                                        mult >= 2 ? "bg-green-500/20 text-green-400" :
                                            mult >= 1 ? "bg-yellow-500/20 text-yellow-400" :
                                                mult > 0 ? "bg-orange-500/20 text-orange-400" :
                                                    "bg-red-500/20 text-red-400"
                                    )}
                                >
                                    {mult}x
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Result */}
                    {lastResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "text-center py-4 rounded-xl mb-6",
                                lastResult.win ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            )}
                        >
                            <div className="text-xl font-bold">{lastResult.mult}x Multiplier</div>
                        </motion.div>
                    )}

                    {/* Risk selector */}
                    <div className="mb-6">
                        <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                            Risk Level
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['low', 'medium', 'high'] as Risk[]).map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRisk(r)}
                                    disabled={dropping}
                                    className={cn(
                                        "py-3 rounded-lg font-bold capitalize transition-all",
                                        risk === r
                                            ? "bg-[var(--accent)] text-black"
                                            : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <BetControls
                        onBet={handleBet}
                        disabled={dropping}
                        loading={dropping}
                        buttonText="Drop Ball"
                    />
                </div>
            </div>

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
