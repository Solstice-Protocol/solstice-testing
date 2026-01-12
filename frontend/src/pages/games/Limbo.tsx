import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, TrendingUp } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BetControls } from '@/components/game/BetControls';
import { BetHistory } from '@/components/game/BetHistory';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

export function Limbo() {
    const { placeBet, settleBet } = useGame();
    const [targetMultiplier, setTargetMultiplier] = useState(2);
    const [playing, setPlaying] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [lastWin, setLastWin] = useState<boolean | null>(null);
    const [counting, setCounting] = useState(false);
    const [displayValue, setDisplayValue] = useState(1);

    // Win chance based on target multiplier (with house edge)
    const winChance = Math.min(99, (98 / targetMultiplier));

    const handleBet = useCallback(async (amount: number) => {
        if (playing || !placeBet(amount)) return;

        setPlaying(true);
        setResult(null);
        setLastWin(null);
        setCounting(true);
        setDisplayValue(1);

        // Generate result (guaranteed fair distribution)
        const random = Math.random();
        const crashPoint = 0.99 / random; // Inverse distribution
        const finalResult = parseFloat(Math.min(1000, crashPoint).toFixed(2));

        // Animate counting up
        const duration = 1500;
        const startTime = Date.now();
        const maxDisplay = Math.min(finalResult, targetMultiplier + 0.5);

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            setDisplayValue(1 + (maxDisplay - 1) * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCounting(false);
                setResult(finalResult);

                const isWin = finalResult >= targetMultiplier;
                setLastWin(isWin);
                settleBet('limbo', amount, isWin ? targetMultiplier : 0, isWin);

                if (isWin) {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }

                setPlaying(false);
            }
        };

        requestAnimationFrame(animate);
    }, [playing, placeBet, settleBet, targetMultiplier]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="game-card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Limbo</h1>
                                <p className="text-sm text-[var(--text-muted)]">Beat the target</p>
                            </div>
                        </div>
                    </div>

                    {/* Result display */}
                    <div className="bg-[var(--bg-primary)] rounded-2xl p-12 mb-6">
                        <div className="text-center">
                            <motion.div
                                className={cn(
                                    "text-8xl font-black font-mono transition-colors",
                                    counting && "text-[var(--accent)]",
                                    !counting && lastWin === true && "text-green-400",
                                    !counting && lastWin === false && "text-red-400",
                                    !counting && lastWin === null && "text-[var(--text-muted)]"
                                )}
                            >
                                {counting || result !== null ? displayValue.toFixed(2) : '1.00'}x
                            </motion.div>

                            {result !== null && !counting && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "text-2xl font-bold mt-4",
                                        lastWin ? "text-green-400" : "text-red-400"
                                    )}
                                >
                                    {lastWin ? 'Target Reached!' : 'Crashed Early'}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Target multiplier */}
                    <div className="mb-6">
                        <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                            Target Multiplier
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                value={targetMultiplier}
                                onChange={(e) => setTargetMultiplier(Math.max(1.01, Math.min(1000, parseFloat(e.target.value) || 1.01)))}
                                step="0.1"
                                min="1.01"
                                max="1000"
                                className="game-input flex-1 text-xl font-bold text-center"
                                disabled={playing}
                            />
                            {[1.5, 2, 5, 10].map(mult => (
                                <button
                                    key={mult}
                                    onClick={() => setTargetMultiplier(mult)}
                                    disabled={playing}
                                    className={cn(
                                        "px-4 rounded-lg font-bold transition-all",
                                        targetMultiplier === mult
                                            ? "bg-[var(--accent)] text-black"
                                            : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                                    )}
                                >
                                    {mult}x
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[var(--bg-primary)] rounded-lg p-4 text-center">
                            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                                Win Chance
                            </div>
                            <div className="text-xl font-bold text-[var(--text-primary)]">
                                {winChance.toFixed(2)}%
                            </div>
                        </div>
                        <div className="bg-[var(--bg-primary)] rounded-lg p-4 text-center">
                            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                                Target
                            </div>
                            <div className="text-xl font-bold text-[var(--accent)]">
                                {targetMultiplier.toFixed(2)}x
                            </div>
                        </div>
                    </div>

                    <BetControls
                        onBet={handleBet}
                        disabled={playing}
                        loading={playing}
                        buttonText="Bet"
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
