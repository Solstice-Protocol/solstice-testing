import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

export function BetHistory() {
    const { bets } = useGame();

    if (bets.length === 0) {
        return (
            <div className="text-center py-8 text-[var(--text-muted)]">
                No bets yet
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {bets.slice(0, 10).map((bet) => (
                <div
                    key={bet.id}
                    className={cn(
                        "flex items-center justify-between p-3 rounded-lg animate-fade-in",
                        bet.win ? "bg-green-500/10" : "bg-red-500/10"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            bet.win ? "bg-green-400" : "bg-red-400"
                        )} />
                        <div>
                            <div className="text-sm font-medium capitalize">{bet.game}</div>
                            <div className="text-xs text-[var(--text-muted)]">
                                {new Date(bet.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={cn(
                            "text-sm font-mono font-bold",
                            bet.win ? "text-green-400" : "text-red-400"
                        )}>
                            {bet.win ? '+' : '-'}${bet.win ? bet.payout.toFixed(2) : bet.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                            {bet.multiplier.toFixed(2)}x
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
