import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Dices, RotateCcw } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { BetControls } from '@/components/game/BetControls';
import { BetHistory } from '@/components/game/BetHistory';
import confetti from 'canvas-confetti';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣', '🔔'];
const REEL_COUNT = 5;
const ROW_COUNT = 3;

const PAYOUTS: Record<string, number> = {
    '7️⃣': 50,
    '💎': 25,
    '⭐': 10,
    '🔔': 8,
    '🍇': 5,
    '🍊': 4,
    '🍋': 3,
    '🍒': 2,
};

function generateReels(): string[][] {
    return Array.from({ length: REEL_COUNT }, () =>
        Array.from({ length: ROW_COUNT }, () =>
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        )
    );
}

function checkWin(reels: string[][]): { win: boolean; multiplier: number; winningRows: number[] } {
    const winningRows: number[] = [];
    let totalMultiplier = 0;

    // Check each row for matching symbols
    for (let row = 0; row < ROW_COUNT; row++) {
        const rowSymbols = reels.map(reel => reel[row]);
        const firstSymbol = rowSymbols[0];

        // Count consecutive matches from left
        let matches = 1;
        for (let i = 1; i < rowSymbols.length; i++) {
            if (rowSymbols[i] === firstSymbol) {
                matches++;
            } else {
                break;
            }
        }

        // 3+ matches wins
        if (matches >= 3) {
            winningRows.push(row);
            const baseMultiplier = PAYOUTS[firstSymbol] || 2;
            const matchBonus = matches === 5 ? 5 : matches === 4 ? 2 : 1;
            totalMultiplier += baseMultiplier * matchBonus;
        }
    }

    return {
        win: winningRows.length > 0,
        multiplier: totalMultiplier,
        winningRows,
    };
}

export function Slots() {
    const { placeBet, settleBet } = useGame();
    const [reels, setReels] = useState<string[][]>(generateReels);
    const [spinning, setSpinning] = useState(false);
    const [winningRows, setWinningRows] = useState<number[]>([]);
    const [lastWin, setLastWin] = useState<{ amount: number; multiplier: number } | null>(null);
    const currentBetRef = useRef(0);

    const handleBet = useCallback(async (amount: number) => {
        if (spinning || !placeBet(amount)) return;

        currentBetRef.current = amount;
        setSpinning(true);
        setWinningRows([]);
        setLastWin(null);

        // Animate spinning
        const spinDuration = 2000;
        const interval = 50;
        const iterations = spinDuration / interval;

        for (let i = 0; i < iterations; i++) {
            await new Promise(r => setTimeout(r, interval));
            setReels(generateReels());
        }

        // Final result
        const finalReels = generateReels();
        setReels(finalReels);

        const result = checkWin(finalReels);
        setWinningRows(result.winningRows);

        if (result.win) {
            setLastWin({ amount: amount * result.multiplier, multiplier: result.multiplier });
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        settleBet('slots', amount, result.multiplier || 0, result.win);
        setSpinning(false);
    }, [spinning, placeBet, settleBet]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="game-card p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                <Dices className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Slots</h1>
                                <p className="text-sm text-[var(--text-muted)]">Match symbols to win big!</p>
                            </div>
                        </div>
                    </div>

                    {/* Slot Machine */}
                    <div className="game-area mb-6">
                        <div className="flex justify-center gap-2 mb-4">
                            {reels.map((reel, reelIndex) => (
                                <div key={reelIndex} className="slot-reel">
                                    {reel.map((symbol, rowIndex) => (
                                        <motion.div
                                            key={`${reelIndex}-${rowIndex}`}
                                            className={`slot-symbol ${winningRows.includes(rowIndex) && !spinning ? 'winning' : ''}`}
                                            animate={spinning ? { y: [0, -10, 0] } : {}}
                                            transition={{ duration: 0.1, repeat: spinning ? Infinity : 0 }}
                                        >
                                            {symbol}
                                        </motion.div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Paylines indicator */}
                        <div className="flex justify-center gap-4 text-xs text-[var(--text-muted)]">
                            <span>Row 1</span>
                            <span>Row 2</span>
                            <span>Row 3</span>
                        </div>
                    </div>

                    {/* Win display */}
                    {lastWin && !spinning && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6 mb-6 bg-[var(--accent-muted)] rounded-xl"
                        >
                            <div className="text-lg text-[var(--text-muted)] mb-1">You Won!</div>
                            <div className="text-4xl font-bold text-[var(--accent)]">${lastWin.amount.toFixed(2)}</div>
                            <div className="text-sm text-[var(--text-muted)] mt-1">{lastWin.multiplier}x Multiplier</div>
                        </motion.div>
                    )}

                    {/* Paytable */}
                    <div className="mb-6">
                        <div className="text-sm font-semibold text-[var(--text-muted)] mb-3">Paytable (3+ matches)</div>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(PAYOUTS).reverse().map(([symbol, mult]) => (
                                <div key={symbol} className="flex items-center justify-between bg-[var(--bg-primary)] rounded-lg px-3 py-2">
                                    <span className="text-xl">{symbol}</span>
                                    <span className="text-sm font-bold text-[var(--accent)]">{mult}x</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <BetControls
                        onBet={handleBet}
                        disabled={spinning}
                        loading={spinning}
                        buttonText="Spin"
                    />
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="game-card p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Recent Spins
                    </h3>
                    <BetHistory />
                </div>
            </div>
        </div>
    );
}
