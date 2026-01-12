import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Dices, Coins, Bomb, Target, Zap, TrendingUp,
    Sparkles, Trophy, Clock, Users, ArrowRight
} from 'lucide-react';
import { useGame } from '@/context/GameContext';

const games = [
    { id: 'dice', name: 'Dice', icon: Dices, gradient: 'from-blue-500 to-indigo-600', desc: 'Roll over or under', edge: '1%' },
    { id: 'coinflip', name: 'Coin Flip', icon: Coins, gradient: 'from-amber-400 to-orange-500', desc: '50/50 odds', edge: '1%' },
    { id: 'mines', name: 'Mines', icon: Bomb, gradient: 'from-red-500 to-rose-600', desc: 'Find the gems', edge: '3%' },
    { id: 'roulette', name: 'Roulette', icon: Target, gradient: 'from-emerald-500 to-green-600', desc: 'Spin to win', edge: '2.7%' },
    { id: 'plinko', name: 'Plinko', icon: Zap, gradient: 'from-pink-500 to-rose-500', desc: 'Drop the ball', edge: '3%' },
    { id: 'limbo', name: 'Limbo', icon: TrendingUp, gradient: 'from-purple-500 to-violet-600', desc: 'Beat the target', edge: '2%' },
    { id: 'slots', name: 'Slots', icon: Dices, gradient: 'from-yellow-400 to-amber-500', desc: 'Spin to match', edge: '4%' },
];

// Mock live feed
const mockLiveFeed = [
    { user: 'Player1', game: 'dice', amount: 50, multiplier: 2.5, win: true },
    { user: 'GamerX', game: 'slots', amount: 100, multiplier: 10, win: true },
    { user: 'Lucky7', game: 'mines', amount: 25, multiplier: 0, win: false },
    { user: 'HighRoller', game: 'limbo', amount: 200, multiplier: 3.2, win: true },
    { user: 'CryptoKing', game: 'coinflip', amount: 75, multiplier: 0, win: false },
];

export function CasinoHome() {
    const { balance, level, totalWins, totalLosses, profit, bets } = useGame();

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            <div className="home-hero relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-transparent" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                            <span className="text-sm font-medium text-[var(--accent)]">Welcome to Solstice Casino</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">
                            Play to <span className="gradient-text">Win Big</span>
                        </h1>
                        <p className="text-[var(--text-muted)] max-w-md">
                            Experience provably fair gaming with instant payouts. Your next big win is just one bet away.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                            <div className="text-sm text-[var(--text-muted)]">Balance</div>
                        </div>
                        <div className="h-12 w-px bg-[var(--border)]" />
                        <div className="text-center">
                            <div className="text-3xl font-bold">Lvl {level}</div>
                            <div className="text-sm text-[var(--text-muted)]">Your Level</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="game-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-400">{totalWins}</div>
                        <div className="text-xs text-[var(--text-muted)]">Total Wins</div>
                    </div>
                </div>
                <div className="game-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-red-400">{totalLosses}</div>
                        <div className="text-xs text-[var(--text-muted)]">Total Losses</div>
                    </div>
                </div>
                <div className="game-card p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${profit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                        <TrendingUp className={`w-5 h-5 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                        <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profit >= 0 ? '+' : ''}${profit.toFixed(0)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">Profit</div>
                    </div>
                </div>
                <div className="game-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{bets.length}</div>
                        <div className="text-xs text-[var(--text-muted)]">Total Bets</div>
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Dices className="w-5 h-5 text-[var(--accent)]" />
                        Casino Games
                    </h2>
                    <span className="text-sm text-[var(--text-muted)]">{games.length} games available</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {games.map((game, i) => {
                        const Icon = game.icon;
                        return (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link to={`/casino/${game.id}`}>
                                    <div className="game-grid-card group">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${game.gradient} shadow-lg mb-4`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg group-hover:text-[var(--accent)] transition-colors">
                                                    {game.name}
                                                </h3>
                                                <p className="text-sm text-[var(--text-muted)]">{game.desc}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="game-card p-5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[var(--accent)]" />
                        Live Bets
                    </h3>
                    <div className="space-y-2">
                        {mockLiveFeed.map((bet, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`live-feed-item ${bet.win ? 'win' : 'loss'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-sm font-bold">
                                        {bet.user.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{bet.user}</div>
                                        <div className="text-xs text-[var(--text-muted)] capitalize">{bet.game}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${bet.win ? 'text-green-400' : 'text-red-400'}`}>
                                        {bet.win ? '+' : '-'}${bet.win ? (bet.amount * bet.multiplier).toFixed(2) : bet.amount.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        {bet.win ? `${bet.multiplier}x` : 'Lost'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Promotions Preview */}
                <div className="game-card p-5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                        Featured Promotions
                    </h3>
                    <div className="space-y-3">
                        <Link to="/promotions" className="block p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-colors">
                            <div className="font-bold mb-1">🎉 Daily Bonus</div>
                            <div className="text-sm text-[var(--text-muted)]">Claim $100 free credits every day!</div>
                        </Link>
                        <Link to="/vip" className="block p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl hover:from-amber-500/30 hover:to-orange-500/30 transition-colors">
                            <div className="font-bold mb-1">👑 VIP Club</div>
                            <div className="text-sm text-[var(--text-muted)]">Exclusive rewards for high rollers</div>
                        </Link>
                        <Link to="/promotions" className="block p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors">
                            <div className="font-bold mb-1">🎰 Slots Tournament</div>
                            <div className="text-sm text-[var(--text-muted)]">Compete for the weekly jackpot!</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
