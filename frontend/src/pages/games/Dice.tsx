import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Dices, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';

export function Dice() {
    const { balance, placeBet, winBet, loseBet } = useGame();
    const [betAmount, setBetAmount] = useState(10);
    const [targetNumber, setTargetNumber] = useState(50);
    const [condition, setCondition] = useState<'over' | 'under'>('over');
    const [rolling, setRolling] = useState(false);
    const [lastRoll, setLastRoll] = useState<number | null>(null);
    const [win, setWin] = useState<boolean | null>(null);
    const [payout, setPayout] = useState(0);

    const winChance = condition === 'over' ? (100 - targetNumber) : targetNumber;
    const multiplier = winChance > 0 ? (99 / winChance).toFixed(2) : '0.00';

    const rollDice = async () => {
        if (rolling || betAmount <= 0 || betAmount > balance) return;
        if (!placeBet(betAmount)) return;

        setRolling(true);
        setWin(null);
        setLastRoll(null);

        await new Promise(r => setTimeout(r, 500));

        const roll = Math.random() * 100;
        const roundedRoll = parseFloat(roll.toFixed(2));
        setLastRoll(roundedRoll);

        const isWin = condition === 'over' ? roundedRoll > targetNumber : roundedRoll < targetNumber;

        if (isWin) {
            const winAmount = betAmount * parseFloat(multiplier);
            setPayout(parseFloat(winAmount.toFixed(2)));
            winBet(winAmount);
            setWin(true);
        } else {
            setPayout(0);
            loseBet();
            setWin(false);
        }

        setRolling(false);
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] p-4">
            <div className="max-w-2xl mx-auto">
                <Link to="/casino" className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Casino
                </Link>

                <Card variant="glass">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                    <Dices className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Dice</h1>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Roll over or under</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">Balance</div>
                                <div className="text-xl font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <motion.div
                                key={lastRoll}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-6xl font-black font-mono mb-2 ${win === true ? 'text-green-400' : win === false ? 'text-red-400' : 'text-white'
                                    }`}
                            >
                                {rolling ? '??.??' : (lastRoll?.toFixed(2) || '00.00')}
                            </motion.div>
                            {win !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-lg font-bold ${win ? 'text-green-400' : 'text-red-400'}`}
                                >
                                    {win ? `WIN +$${payout.toFixed(2)}` : 'LOSS'}
                                </motion.div>
                            )}
                        </div>

                        <div className="bg-black/30 rounded-xl p-6 mb-6">
                            <div className="relative h-12 bg-white/5 rounded-full overflow-hidden mb-4 flex items-center">
                                <div
                                    className={`absolute inset-y-0 ${condition === 'over' ? 'right-0' : 'left-0'} bg-green-500/20`}
                                    style={{ width: `${winChance}%` }}
                                />
                                <input
                                    type="range"
                                    min="2"
                                    max="98"
                                    step="1"
                                    value={targetNumber}
                                    onChange={(e) => setTargetNumber(Number(e.target.value))}
                                    className="w-full z-10 accent-[var(--accent)] cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between text-sm font-mono text-[hsl(var(--muted-foreground))]">
                                <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                                <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Multiplier</div>
                                <div className="text-xl font-bold text-[var(--accent)]">{multiplier}x</div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center">
                                <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Win Chance</div>
                                <div className="text-xl font-bold">{winChance.toFixed(1)}%</div>
                            </div>
                            <button
                                onClick={() => setCondition(c => c === 'over' ? 'under' : 'over')}
                                className="bg-black/20 p-4 rounded-xl border border-white/5 text-center hover:bg-white/5 transition-colors"
                            >
                                <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Condition</div>
                                <div className="text-xl font-bold flex items-center justify-center gap-2">
                                    {condition === 'over' ? 'Over' : 'Under'} {targetNumber}
                                    <RefreshCw className="w-4 h-4" />
                                </div>
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
                                onClick={rollDice}
                                disabled={rolling || balance < betAmount || betAmount <= 0}
                                className="flex-[2]"
                                size="lg"
                            >
                                {rolling ? 'ROLLING...' : 'ROLL DICE'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
