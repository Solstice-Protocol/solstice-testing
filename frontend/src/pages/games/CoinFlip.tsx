import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';
import confetti from 'canvas-confetti';

export function CoinFlip() {
    const { balance, placeBet, winBet, loseBet } = useGame();
    const [betAmount, setBetAmount] = useState(10);
    const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [win, setWin] = useState<boolean | null>(null);

    const MULTIPLIER = 1.98;

    const flipCoin = async () => {
        if (flipping || betAmount <= 0 || betAmount > balance) return;
        if (!placeBet(betAmount)) return;

        setFlipping(true);
        setResult(null);
        setWin(null);

        await new Promise(r => setTimeout(r, 1500));

        const coinResult = Math.random() > 0.5 ? 'heads' : 'tails';
        setResult(coinResult);

        const isWin = coinResult === choice;
        setWin(isWin);

        if (isWin) {
            const winAmount = betAmount * MULTIPLIER;
            winBet(winAmount);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
            loseBet();
        }

        setFlipping(false);
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
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                                    <Coins className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Coin Flip</h1>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">1.98x multiplier</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">Balance</div>
                                <div className="text-xl font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="h-48 flex items-center justify-center mb-8">
                            <motion.div
                                className={`w-36 h-36 rounded-full relative flex items-center justify-center border-4 border-white/20 shadow-[0_0_50px_rgba(250,204,21,0.3)] ${result === 'heads' ? 'bg-yellow-400' : result === 'tails' ? 'bg-zinc-300' : 'bg-yellow-400'
                                    }`}
                                animate={{ rotateY: flipping ? 1800 : 0, scale: flipping ? 1.2 : 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            >
                                <span className="text-4xl font-black text-black/50">
                                    {flipping ? '?' : (result ? (result === 'heads' ? 'H' : 'T') : '?')}
                                </span>
                            </motion.div>
                        </div>

                        {win !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 text-center text-2xl font-bold ${win ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {win ? `YOU WON $${(betAmount * MULTIPLIER).toFixed(2)}!` : 'YOU LOST'}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => setChoice('heads')}
                                className={`p-4 rounded-xl border transition-all font-bold ${choice === 'heads' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-black/20 border-white/10 hover:bg-white/5'
                                    }`}
                            >
                                HEADS
                            </button>
                            <button
                                onClick={() => setChoice('tails')}
                                className={`p-4 rounded-xl border transition-all font-bold ${choice === 'tails' ? 'bg-zinc-400/20 border-zinc-400 text-zinc-300' : 'bg-black/20 border-white/10 hover:bg-white/5'
                                    }`}
                            >
                                TAILS
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 font-mono text-lg focus:outline-none focus:border-[var(--accent)]/50"
                                placeholder="Bet Amount"
                            />
                            <Button
                                onClick={flipCoin}
                                disabled={flipping || balance < betAmount || betAmount <= 0}
                                className="flex-[2]"
                                size="lg"
                            >
                                {flipping ? 'FLIPPING...' : 'FLIP COIN'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
