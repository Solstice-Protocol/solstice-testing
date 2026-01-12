import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Coins, RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BetControls } from '@/components/game/BetControls';
import { GameStats } from '@/components/game/GameStats';
import { BetHistory } from '@/components/game/BetHistory';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

const MULTIPLIER = 1.98;

export function CoinFlip() {
    const { placeBet, settleBet } = useGame();
    const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [lastWin, setLastWin] = useState<boolean | null>(null);
    const [flipRotation, setFlipRotation] = useState(0);

    const handleBet = useCallback(async (amount: number) => {
        if (flipping || !placeBet(amount)) return;

        setFlipping(true);
        setResult(null);
        setLastWin(null);

        // Animate flip
        setFlipRotation(prev => prev + 1800 + (Math.random() > 0.5 ? 180 : 0));

        await new Promise(r => setTimeout(r, 1200));

        const coinResult = Math.random() > 0.5 ? 'heads' : 'tails';
        setResult(coinResult);

        const isWin = coinResult === choice;
        setLastWin(isWin);
        settleBet('coinflip', amount, MULTIPLIER, isWin);

        if (isWin) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        setFlipping(false);
    }, [flipping, placeBet, settleBet, choice]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main game area */}
            <div className="lg:col-span-2 space-y-6">
                <div className="game-card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                <Coins className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Coin Flip</h1>
                                <p className="text-sm text-[var(--text-muted)]">50/50 odds, 1.98x payout</p>
                            </div>
                        </div>
                    </div>

                    {/* Coin display */}
                    <div className="bg-[var(--bg-primary)] rounded-2xl p-8 mb-6">
                        <div className="flex justify-center mb-6" style={{ perspective: '1000px' }}>
                            <motion.div
                                className={cn(
                                    "w-40 h-40 rounded-full relative flex items-center justify-center shadow-2xl",
                                    "border-4",
                                    result === 'heads' ? 'bg-yellow-400 border-yellow-300' :
                                        result === 'tails' ? 'bg-zinc-400 border-zinc-300' :
                                            'bg-yellow-400 border-yellow-300'
                                )}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    boxShadow: '0 0 60px rgba(250, 204, 21, 0.3)'
                                }}
                                animate={{
                                    rotateY: flipRotation,
                                    scale: flipping ? 1.1 : 1
                                }}
                                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <span className="text-5xl font-black text-black/40">
                                    {flipping ? '?' : result ? (result === 'heads' ? 'H' : 'T') : '?'}
                                </span>
                            </motion.div>
                        </div>

                        {/* Result */}
                        {lastWin !== null && !flipping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "text-center text-2xl font-bold",
                                    lastWin ? "text-green-400" : "text-red-400"
                                )}
                            >
                                {lastWin ? 'You Win!' : 'You Lose'}
                            </motion.div>
                        )}
                    </div>

                    {/* Choice selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => setChoice('heads')}
                            disabled={flipping}
                            className={cn(
                                "py-6 rounded-xl font-bold text-lg transition-all border-2",
                                choice === 'heads'
                                    ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                                    : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                            )}
                        >
                            <div className="text-3xl mb-1">🪙</div>
                            HEADS
                        </button>
                        <button
                            onClick={() => setChoice('tails')}
                            disabled={flipping}
                            className={cn(
                                "py-6 rounded-xl font-bold text-lg transition-all border-2",
                                choice === 'tails'
                                    ? "bg-zinc-400/20 border-zinc-400 text-zinc-300"
                                    : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                            )}
                        >
                            <div className="text-3xl mb-1">⚫</div>
                            TAILS
                        </button>
                    </div>

                    {/* Stats */}
                    <GameStats
                        winChance={50}
                        multiplier={MULTIPLIER}
                        className="mb-6"
                    />

                    {/* Bet controls */}
                    <BetControls
                        onBet={handleBet}
                        disabled={flipping}
                        loading={flipping}
                        buttonText="Flip Coin"
                    />
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
