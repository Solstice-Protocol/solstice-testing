import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dices, RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BetControls } from '@/components/game/BetControls';
import { GameStats } from '@/components/game/GameStats';
import { BetHistory } from '@/components/game/BetHistory';
import { cn } from '@/lib/utils';

export function Dice() {
    const { placeBet, settleBet } = useGame();
    const [targetNumber, setTargetNumber] = useState(50);
    const [condition, setCondition] = useState<'over' | 'under'>('over');
    const [rolling, setRolling] = useState(false);
    const [lastRoll, setLastRoll] = useState<number | null>(null);
    const [lastWin, setLastWin] = useState<boolean | null>(null);
    const [lastPayout, setLastPayout] = useState<number>(0);

    // Calculate stats
    const winChance = condition === 'over' ? (99 - targetNumber) : (targetNumber - 1);
    const multiplier = winChance > 0 ? parseFloat((99 / winChance).toFixed(4)) : 0;

    const handleBet = useCallback(async (amount: number) => {
        if (rolling || !placeBet(amount)) return;

        setRolling(true);
        setLastWin(null);

        // Roll animation
        await new Promise(r => setTimeout(r, 300));

        const roll = parseFloat((Math.random() * 100).toFixed(2));
        setLastRoll(roll);

        const isWin = condition === 'over'
            ? roll > targetNumber
            : roll < targetNumber;

        setLastWin(isWin);

        if (isWin) {
            const payout = amount * multiplier;
            setLastPayout(payout);
        } else {
            setLastPayout(0);
        }

        settleBet('dice', amount, multiplier, isWin);
        setRolling(false);
    }, [rolling, placeBet, settleBet, condition, targetNumber, multiplier]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main game area */}
            <div className="lg:col-span-2 space-y-6">
                {/* Game card */}
                <div className="game-card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Dices className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Dice</h1>
                                <p className="text-sm text-[var(--text-muted)]">Roll over or under</p>
                            </div>
                        </div>
                    </div>

                    {/* Result display */}
                    <div className="bg-[var(--bg-primary)] rounded-2xl p-8 mb-6">
                        <div className="text-center">
                            <motion.div
                                key={lastRoll}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn(
                                    "text-7xl font-black font-mono mb-4",
                                    rolling && "animate-pulse",
                                    lastWin === true && "text-green-400",
                                    lastWin === false && "text-red-400"
                                )}
                            >
                                {rolling ? (
                                    <span className="text-[var(--text-muted)]">??</span>
                                ) : lastRoll !== null ? (
                                    lastRoll.toFixed(2)
                                ) : (
                                    <span className="text-[var(--text-muted)]">0.00</span>
                                )}
                            </motion.div>

                            {lastWin !== null && !rolling && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "text-2xl font-bold",
                                        lastWin ? "text-green-400" : "text-red-400"
                                    )}
                                >
                                    {lastWin ? `+$${lastPayout.toFixed(2)}` : 'No win'}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Slider */}
                    <div className="bg-[var(--bg-primary)] rounded-xl p-6 mb-6">
                        <div className="relative mb-4">
                            {/* Track background */}
                            <div className="h-3 rounded-full bg-[var(--bg-elevated)] relative overflow-hidden">
                                {/* Win zone indicator */}
                                <div
                                    className={cn(
                                        "absolute inset-y-0 bg-green-500/30",
                                        condition === 'over' ? 'right-0' : 'left-0'
                                    )}
                                    style={{ width: `${winChance}%` }}
                                />
                            </div>

                            {/* Slider input */}
                            <input
                                type="range"
                                min="2"
                                max="98"
                                value={targetNumber}
                                onChange={(e) => setTargetNumber(Number(e.target.value))}
                                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                            />

                            {/* Thumb indicator */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg pointer-events-none border-2 border-[var(--accent)]"
                                style={{ left: `calc(${(targetNumber - 2) / 96 * 100}% - 12px)` }}
                            />
                        </div>

                        {/* Scale labels */}
                        <div className="flex justify-between text-xs text-[var(--text-muted)] font-mono">
                            <span>0</span>
                            <span>25</span>
                            <span>50</span>
                            <span>75</span>
                            <span>100</span>
                        </div>
                    </div>

                    {/* Condition toggle */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setCondition('under')}
                            className={cn(
                                "flex-1 py-4 rounded-xl font-bold transition-all",
                                condition === 'under'
                                    ? "bg-[var(--accent)] text-black"
                                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                            )}
                        >
                            Roll Under {targetNumber}
                        </button>
                        <button
                            onClick={() => setCondition('over')}
                            className={cn(
                                "flex-1 py-4 rounded-xl font-bold transition-all",
                                condition === 'over'
                                    ? "bg-[var(--accent)] text-black"
                                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                            )}
                        >
                            Roll Over {targetNumber}
                        </button>
                    </div>

                    {/* Stats */}
                    <GameStats
                        winChance={winChance}
                        multiplier={multiplier}
                        className="mb-6"
                    />

                    {/* Bet controls */}
                    <BetControls
                        onBet={handleBet}
                        disabled={rolling}
                        loading={rolling}
                        buttonText="Roll Dice"
                    />
                </div>
            </div>

            {/* Sidebar - Bet History */}
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
