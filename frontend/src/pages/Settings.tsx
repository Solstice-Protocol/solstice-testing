import { useState } from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, RotateCcw, AlertTriangle } from 'lucide-react';
import { useGame } from '@/context/GameContext';

export function Settings() {
    const { resetBalance } = useGame();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode] = useState(true);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleReset = () => {
        resetBalance();
        setShowResetConfirm(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                    <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-sm text-[var(--text-muted)]">Manage your preferences</p>
                </div>
            </div>

            {/* Sound Settings */}
            <div className="game-card p-5">
                <h3 className="font-bold mb-4">Sound</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {soundEnabled ? (
                            <Volume2 className="w-5 h-5 text-[var(--accent)]" />
                        ) : (
                            <VolumeX className="w-5 h-5 text-[var(--text-muted)]" />
                        )}
                        <div>
                            <div className="font-medium">Game Sounds</div>
                            <div className="text-sm text-[var(--text-muted)]">Enable sound effects for wins and spins</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${soundEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--bg-elevated)]'
                            }`}
                    >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'left-7' : 'left-1'
                            }`} />
                    </button>
                </div>
            </div>

            {/* Theme Settings */}
            <div className="game-card p-5">
                <h3 className="font-bold mb-4">Appearance</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {darkMode ? (
                            <Moon className="w-5 h-5 text-[var(--accent)]" />
                        ) : (
                            <Sun className="w-5 h-5 text-amber-400" />
                        )}
                        <div>
                            <div className="font-medium">Dark Mode</div>
                            <div className="text-sm text-[var(--text-muted)]">Use dark theme (always on)</div>
                        </div>
                    </div>
                    <div className="w-14 h-8 rounded-full bg-[var(--accent)] relative cursor-not-allowed">
                        <div className="absolute top-1 left-7 w-6 h-6 rounded-full bg-white shadow" />
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="game-card p-5">
                <h3 className="font-bold mb-4">Data Management</h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-lg">
                        <div className="flex items-center gap-3">
                            <RotateCcw className="w-5 h-5 text-[var(--text-muted)]" />
                            <div>
                                <div className="font-medium">Reset Balance</div>
                                <div className="text-sm text-[var(--text-muted)]">Reset balance to $1,000 and clear history</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="quick-btn"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="game-card p-5">
                <h3 className="font-bold mb-4">About</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Version</span>
                        <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Platform</span>
                        <span>Solstice Casino</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">Games</span>
                        <span>7 available</span>
                    </div>
                </div>
            </div>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowResetConfirm(false)}>
                    <div className="game-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-bold">Reset All Data?</h3>
                                <p className="text-sm text-[var(--text-muted)]">This cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mb-6">
                            Your balance will be reset to $1,000 and all bet history will be cleared.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowResetConfirm(false)} className="flex-1 quick-btn py-3">
                                Cancel
                            </button>
                            <button onClick={handleReset} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors">
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
