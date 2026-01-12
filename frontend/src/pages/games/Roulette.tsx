import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';
import confetti from 'canvas-confetti';

const NUMBERS = Array.from({ length: 37 }, (_, i) => i);
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const getColor = (n: number) => n === 0 ? 'green' : RED_NUMBERS.includes(n) ? 'red' : 'black';

type BetType = 'red' | 'black' | 'green' | 'odd' | 'even';

export function Roulette() {
    const { balance, placeBet, winBet, loseBet } = useGame();
    const [betAmount, setBetAmount] = useState(10);
    const [selectedBet, setSelectedBet] = useState<BetType>('red');
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [win, setWin] = useState<boolean | null>(null);
    const [payout, setPayout] = useState(0);
    const [rotation, setRotation] = useState(0);

    const MULTIPLIERS: Record<BetType, number> = {
        red: 2,
        black: 2,
        green: 14,
        odd: 2,
        even: 2,
    };

    const spinWheel = async () => {
        if (spinning || betAmount <= 0 || betAmount > balance) return;

        if (!placeBet(betAmount)) return;

        setSpinning(true);
        setWin(null);
        setResult(null);

        const resultNum = Math.floor(Math.random() * 37);
        const segmentAngle = 360 / 37;
        const targetRotation = rotation + (360 * 5) + (resultNum * segmentAngle);
        setRotation(targetRotation);

        await new Promise(r => setTimeout(r, 4000));

        setResult(resultNum);

        let isWin = false;
        const color = getColor(resultNum);

        switch (selectedBet) {
            case 'red': isWin = color === 'red'; break;
            case 'black': isWin = color === 'black'; break;
            case 'green': isWin = color === 'green'; break;
            case 'odd': isWin = resultNum !== 0 && resultNum % 2 === 1; break;
            case 'even': isWin = resultNum !== 0 && resultNum % 2 === 0; break;
        }

        setWin(isWin);

        if (isWin) {
            const winAmount = betAmount * MULTIPLIERS[selectedBet];
            setPayout(winAmount);
            winBet(winAmount);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
            setPayout(0);
            loseBet();
        }

        setSpinning(false);
    };

    const betOptions: { type: BetType; label: string; color: string }[] = [
        { type: 'red', label: 'Red', color: 'bg-red-600' },
        { type: 'black', label: 'Black', color: 'bg-zinc-800' },
        { type: 'green', label: 'Green', color: 'bg-green-600' },
        { type: 'odd', label: 'Odd', color: 'bg-purple-600' },
        { type: 'even', label: 'Even', color: 'bg-blue-600' },
    ];

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
                                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                    <Target className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Roulette</h1>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{MULTIPLIERS[selectedBet]}x on {selectedBet}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">Balance</div>
                                <div className="text-xl font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="relative h-64 flex items-center justify-center mb-6 overflow-hidden">
                            <motion.div
                                className="w-48 h-48 rounded-full border-8 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)] relative"
                                style={{
                                    background: `conic-gradient(${NUMBERS.map((n, i) => {
                                        const c = getColor(n);
                                        const hex = c === 'red' ? '#dc2626' : c === 'green' ? '#16a34a' : '#27272a';
                                        return `${hex} ${i * (360 / 37)}deg ${(i + 1) * (360 / 37)}deg`;
                                    }).join(', ')})`
                                }}
                                animate={{ rotate: rotation }}
                                transition={{ duration: 4, ease: "easeOut" }}
                            >
                                <div className="absolute inset-4 rounded-full bg-[hsl(var(--background))] flex items-center justify-center">
                                    <span className="text-3xl font-bold">
                                        {spinning ? '?' : (result !== null ? result : '0')}
                                    </span>
                                </div>
                            </motion.div>
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-[var(--accent)]" />
                        </div>

                        {result !== null && !spinning && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-center mb-6 p-4 rounded-xl ${win ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'} border`}
                            >
                                <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">
                                    Landed on {result} ({getColor(result).toUpperCase()})
                                </div>
                                <div className={`text-2xl font-bold ${win ? 'text-green-400' : 'text-red-400'}`}>
                                    {win ? `WIN +$${payout.toFixed(2)}` : 'LOSS'}
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {betOptions.map(opt => (
                                <button
                                    key={opt.type}
                                    onClick={() => setSelectedBet(opt.type)}
                                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${selectedBet === opt.type ? `${opt.color} border-white` : 'bg-black/20 border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="text-center text-sm text-[hsl(var(--muted-foreground))] mb-4">
                            Multiplier: <span className="text-[var(--accent)] font-bold">{MULTIPLIERS[selectedBet]}x</span>
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
                                onClick={spinWheel}
                                disabled={spinning || balance < betAmount || betAmount <= 0}
                                className="flex-[2]"
                                size="lg"
                            >
                                {spinning ? 'SPINNING...' : 'SPIN'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
