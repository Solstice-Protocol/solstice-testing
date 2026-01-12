import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BetControls } from '@/components/game/BetControls';
import { BetHistory } from '@/components/game/BetHistory';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const NUMBERS = Array.from({ length: 37 }, (_, i) => i);
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const getColor = (n: number) => n === 0 ? 'green' : RED_NUMBERS.includes(n) ? 'red' : 'black';

type BetType = 'red' | 'black' | 'green';

const MULTIPLIERS: Record<BetType, number> = { red: 2, black: 2, green: 14 };

export function Roulette() {
    const { placeBet, settleBet } = useGame();
    const [selectedBet, setSelectedBet] = useState<BetType>('red');
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [lastWin, setLastWin] = useState<boolean | null>(null);
    const [rotation, setRotation] = useState(0);

    const handleBet = useCallback(async (amount: number) => {
        if (spinning || !placeBet(amount)) return;

        setSpinning(true);
        setResult(null);
        setLastWin(null);

        const resultNum = Math.floor(Math.random() * 37);
        const segmentAngle = 360 / 37;
        setRotation(prev => prev + (360 * 5) + (resultNum * segmentAngle));

        await new Promise(r => setTimeout(r, 4000));

        setResult(resultNum);

        const color = getColor(resultNum);
        const isWin = selectedBet === color;
        setLastWin(isWin);

        settleBet('roulette', amount, MULTIPLIERS[selectedBet], isWin);

        if (isWin) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        setSpinning(false);
    }, [spinning, placeBet, settleBet, selectedBet]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="game-card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Roulette</h1>
                                <p className="text-sm text-[var(--text-muted)]">Spin the wheel</p>
                            </div>
                        </div>
                    </div>

                    {/* Wheel */}
                    <div className="bg-[var(--bg-primary)] rounded-2xl p-8 mb-6">
                        <div className="relative h-64 flex items-center justify-center">
                            <motion.div
                                className="w-52 h-52 rounded-full border-8 border-yellow-400 relative"
                                style={{
                                    background: `conic-gradient(${NUMBERS.map((n, i) => {
                                        const c = getColor(n);
                                        const hex = c === 'red' ? '#dc2626' : c === 'green' ? '#16a34a' : '#27272a';
                                        return `${hex} ${i * (360 / 37)}deg ${(i + 1) * (360 / 37)}deg`;
                                    }).join(', ')})`,
                                    boxShadow: '0 0 60px rgba(250,204,21,0.3)'
                                }}
                                animate={{ rotate: rotation }}
                                transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
                            >
                                <div className="absolute inset-6 rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                                    <span className={cn(
                                        "text-4xl font-bold",
                                        result !== null && (getColor(result) === 'red' ? 'text-red-500' : getColor(result) === 'green' ? 'text-green-500' : 'text-white')
                                    )}>
                                        {spinning ? '?' : (result !== null ? result : '0')}
                                    </span>
                                </div>
                            </motion.div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-[var(--accent)]" />
                        </div>
                    </div>

                    {/* Result */}
                    {result !== null && !spinning && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "text-center py-4 rounded-xl mb-6",
                                lastWin ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            )}
                        >
                            <div className="text-lg">
                                Landed on <span className="font-bold">{result}</span> ({getColor(result).toUpperCase()})
                            </div>
                            <div className="text-2xl font-bold">
                                {lastWin ? 'You Win!' : 'No Win'}
                            </div>
                        </motion.div>
                    )}

                    {/* Bet selection */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {([
                            { type: 'red' as BetType, label: 'Red', color: 'bg-red-600', mult: '2x' },
                            { type: 'black' as BetType, label: 'Black', color: 'bg-zinc-800', mult: '2x' },
                            { type: 'green' as BetType, label: 'Green', color: 'bg-green-600', mult: '14x' },
                        ]).map(opt => (
                            <button
                                key={opt.type}
                                onClick={() => setSelectedBet(opt.type)}
                                disabled={spinning}
                                className={cn(
                                    "py-4 rounded-xl font-bold transition-all border-2",
                                    selectedBet === opt.type
                                        ? `${opt.color} border-white`
                                        : "bg-[var(--bg-elevated)] border-[var(--border)] hover:border-[var(--border-hover)]"
                                )}
                            >
                                <div>{opt.label}</div>
                                <div className="text-xs opacity-70">{opt.mult}</div>
                            </button>
                        ))}
                    </div>

                    <BetControls
                        onBet={handleBet}
                        disabled={spinning}
                        loading={spinning}
                        buttonText="Spin"
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
