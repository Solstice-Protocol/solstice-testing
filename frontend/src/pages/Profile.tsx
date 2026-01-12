import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, RotateCcw, Award, Zap } from 'lucide-react';
import { useGame } from '@/context/GameContext';

export function Profile() {
    const {
        username, level, xp, balance,
        totalWins, totalLosses, totalWagered, profit,
        bets, resetBalance, setUsername
    } = useGame();
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(username);

    const winRate = totalWins + totalLosses > 0
        ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
        : '0.0';

    const handleSaveName = () => {
        if (newName.trim()) {
            setUsername(newName.trim());
        }
        setEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    {editing ? (
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="game-input text-xl font-bold"
                                autoFocus
                            />
                            <button onClick={handleSaveName} className="quick-btn">Save</button>
                            <button onClick={() => setEditing(false)} className="quick-btn">Cancel</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{username}</h1>
                            <button onClick={() => setEditing(true)} className="quick-btn text-xs">Edit</button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                        <div className="profile-level">
                            <Trophy className="w-4 h-4" />
                            Level {level}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <Zap className="w-4 h-4 text-[var(--accent)]" />
                            {xp}/100 XP
                        </div>
                    </div>
                    {/* XP Bar */}
                    <div className="mt-3 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden w-48">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-500 transition-all"
                            style={{ width: `${xp}%` }}
                        />
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-[var(--text-muted)]">Balance</div>
                    <div className="text-3xl font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="game-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Award className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-sm text-[var(--text-muted)]">Total Wagered</span>
                    </div>
                    <div className="text-2xl font-bold">${totalWagered.toFixed(2)}</div>
                </div>

                <div className="game-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-sm text-[var(--text-muted)]">Wins</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{totalWins}</div>
                </div>

                <div className="game-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-sm text-[var(--text-muted)]">Losses</span>
                    </div>
                    <div className="text-2xl font-bold text-red-400">{totalLosses}</div>
                </div>

                <div className="game-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg ${profit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                            {profit >= 0 ? <TrendingUp className="w-5 h-5 text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                        </div>
                        <span className="text-sm text-[var(--text-muted)]">Net Profit</span>
                    </div>
                    <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Win Rate */}
            <div className="game-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold">Win Rate</span>
                    <span className="text-2xl font-bold text-[var(--accent)]">{winRate}%</span>
                </div>
                <div className="h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--accent)] to-emerald-500 transition-all"
                        style={{ width: `${parseFloat(winRate)}%` }}
                    />
                </div>
            </div>

            {/* Bet History */}
            <div className="game-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Bet History</h2>
                    <button onClick={resetBalance} className="quick-btn flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Reset All
                    </button>
                </div>

                {bets.length === 0 ? (
                    <div className="text-center py-10 text-[var(--text-muted)]">
                        No bets yet. Start playing to see your history!
                    </div>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {bets.map(bet => (
                            <div
                                key={bet.id}
                                className={`live-feed-item ${bet.win ? 'win' : 'loss'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-medium capitalize">{bet.game}</span>
                                    <span className="text-sm text-[var(--text-muted)]">
                                        ${bet.amount.toFixed(2)} @ {bet.multiplier.toFixed(2)}x
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-[var(--text-muted)]">
                                        {new Date(bet.timestamp).toLocaleTimeString()}
                                    </span>
                                    <span className={`font-bold ${bet.win ? 'text-green-400' : 'text-red-400'}`}>
                                        {bet.win ? '+' : '-'}${bet.win ? bet.payout.toFixed(2) : bet.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
