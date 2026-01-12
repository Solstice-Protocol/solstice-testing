import { cn } from '@/lib/utils';

interface GameStatsProps {
    winChance: number;
    multiplier: number;
    potentialWin?: number;
    className?: string;
}

export function GameStats({ winChance, multiplier, potentialWin, className }: GameStatsProps) {
    return (
        <div className={cn("grid grid-cols-3 gap-3", className)}>
            <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    Win Chance
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                    {winChance.toFixed(2)}%
                </div>
            </div>

            <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    Multiplier
                </div>
                <div className="text-xl font-bold text-[var(--accent)]">
                    {multiplier.toFixed(2)}x
                </div>
            </div>

            {potentialWin !== undefined && (
                <div className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                    <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                        Profit on Win
                    </div>
                    <div className="text-xl font-bold text-green-400">
                        ${potentialWin.toFixed(2)}
                    </div>
                </div>
            )}
        </div>
    );
}
