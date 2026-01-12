import { useState } from 'react';
import { Search, Bell, Wallet, User, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
    sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
    const { balance, totalWins, totalLosses, profit } = useGame();
    const [showWallet, setShowWallet] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const winRate = totalWins + totalLosses > 0
        ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
        : '0.0';

    return (
        <header
            className="header"
            style={{ left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
        >
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
                {/* Sound toggle */}
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors"
                >
                    {soundEnabled ? (
                        <Volume2 className="w-5 h-5 text-[var(--text-secondary)]" />
                    ) : (
                        <VolumeX className="w-5 h-5 text-[var(--text-secondary)]" />
                    )}
                </button>

                {/* Notifications */}
                <button className="w-10 h-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors relative">
                    <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--accent)] text-[10px] font-bold text-black flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Wallet */}
                <div className="relative">
                    <button
                        onClick={() => setShowWallet(!showWallet)}
                        className="flex items-center gap-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-4 py-2 hover:bg-[var(--bg-hover)] transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-emerald-500 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-black" />
                        </div>
                        <div className="text-left">
                            <div className="text-[11px] text-[var(--text-muted)] font-medium">Balance</div>
                            <div className="text-base font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${showWallet ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Wallet dropdown */}
                    {showWallet && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl p-5 animate-slide-up z-50">
                            <div className="text-center mb-5">
                                <div className="text-4xl font-bold text-[var(--accent)] mb-1">${balance.toFixed(2)}</div>
                                <div className="text-sm text-[var(--text-muted)]">Available Balance</div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-5">
                                <div className="stat-box">
                                    <div className="stat-label">Wins</div>
                                    <div className="stat-value success">{totalWins}</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-label">Losses</div>
                                    <div className="stat-value danger">{totalLosses}</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-label">Win Rate</div>
                                    <div className="stat-value">{winRate}%</div>
                                </div>
                            </div>

                            <div className={`text-center py-3 rounded-lg mb-4 ${profit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                <div className="text-xs text-[var(--text-muted)] mb-1">Session Profit</div>
                                <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                                </div>
                            </div>

                            <button className="bet-button w-full">
                                Add Funds
                            </button>
                        </div>
                    )}
                </div>

                {/* User */}
                <Link to="/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-emerald-500 flex items-center justify-center hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-shadow">
                    <User className="w-5 h-5 text-black" />
                </Link>
            </div>
        </header>
    );
}
