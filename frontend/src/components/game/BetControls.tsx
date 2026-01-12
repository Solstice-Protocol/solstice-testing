import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

interface BetControlsProps {
    onBet: (amount: number) => void;
    disabled?: boolean;
    loading?: boolean;
    buttonText?: string;
    minBet?: number;
    maxBet?: number;
}

export function BetControls({
    onBet,
    disabled = false,
    loading = false,
    buttonText = 'Bet',
    minBet = 0.1,
    maxBet,
}: BetControlsProps) {
    const { balance } = useGame();
    const [amount, setAmount] = useState(10);
    const effectiveMaxBet = maxBet ?? balance;

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;

            if (e.code === 'Space' && !disabled && !loading) {
                e.preventDefault();
                onBet(amount);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [amount, disabled, loading, onBet]);

    const handleAmountChange = (value: number) => {
        const clamped = Math.max(minBet, Math.min(effectiveMaxBet, value));
        setAmount(parseFloat(clamped.toFixed(2)));
    };

    const handleHalf = () => handleAmountChange(amount / 2);
    const handleDouble = () => handleAmountChange(amount * 2);
    const handleMax = () => handleAmountChange(effectiveMaxBet);

    const handleSubmit = () => {
        if (!disabled && !loading && amount >= minBet && amount <= effectiveMaxBet) {
            onBet(amount);
        }
    };

    return (
        <div className="space-y-4">
            {/* Amount input */}
            <div>
                <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
                    Bet Amount
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                            className="game-input w-full pl-8 text-right font-mono text-lg"
                            step="0.1"
                            min={minBet}
                            max={effectiveMaxBet}
                        />
                    </div>

                    {/* Quick buttons */}
                    <button onClick={handleHalf} className="quick-btn">½</button>
                    <button onClick={handleDouble} className="quick-btn">2×</button>
                    <button onClick={handleMax} className="quick-btn">Max</button>
                </div>
            </div>

            {/* Bet button */}
            <button
                onClick={handleSubmit}
                disabled={disabled || loading || amount < minBet || amount > effectiveMaxBet}
                className={cn(
                    "bet-button w-full py-4 rounded-xl text-lg",
                    loading && "opacity-70"
                )}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    <>
                        {buttonText}
                        <span className="text-xs ml-2 opacity-70">(Space)</span>
                    </>
                )}
            </button>

            {/* Insufficient balance warning */}
            {amount > balance && (
                <div className="text-xs text-red-400 text-center">
                    Insufficient balance
                </div>
            )}
        </div>
    );
}
