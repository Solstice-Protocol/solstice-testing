import { Link, useLocation } from 'react-router-dom';
import {
    Dices, Coins, Bomb, Target, Zap, TrendingUp,
    Home, Gift, Trophy, Settings, User
} from 'lucide-react';

const mainNav = [
    { id: 'home', label: 'Casino', icon: Home, path: '/casino' },
];

const games = [
    { id: 'dice', label: 'Dice', icon: Dices, path: '/casino/dice', gradient: 'from-blue-500 to-indigo-600' },
    { id: 'coinflip', label: 'Coin Flip', icon: Coins, path: '/casino/coinflip', gradient: 'from-amber-400 to-orange-500' },
    { id: 'mines', label: 'Mines', icon: Bomb, path: '/casino/mines', gradient: 'from-red-500 to-rose-600' },
    { id: 'roulette', label: 'Roulette', icon: Target, path: '/casino/roulette', gradient: 'from-emerald-500 to-green-600' },
    { id: 'plinko', label: 'Plinko', icon: Zap, path: '/casino/plinko', gradient: 'from-pink-500 to-rose-500' },
    { id: 'limbo', label: 'Limbo', icon: TrendingUp, path: '/casino/limbo', gradient: 'from-purple-500 to-violet-600' },
    { id: 'slots', label: 'Slots', icon: Dices, path: '/casino/slots', gradient: 'from-yellow-400 to-amber-500' },
];

const bottomNav = [
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'promotions', label: 'Promotions', icon: Gift, path: '/promotions' },
    { id: 'vip', label: 'VIP Club', icon: Trophy, path: '/vip' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const location = useLocation();

    return (
        <aside
            className="sidebar"
            style={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
        >
            {/* Logo */}
            <div
                className="flex items-center px-4 border-b border-[var(--border)]"
                style={{ height: 'var(--header-height)' }}
            >
                <Link to="/casino" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-emerald-500 flex items-center justify-center shadow-lg">
                        <Dices className="w-6 h-6 text-black" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold gradient-text">Solstice</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                {/* Main nav */}
                <div className="mb-6">
                    {mainNav.map(item => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`sidebar-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {/* Games */}
                <div className="mb-6">
                    {!collapsed && (
                        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 mb-3">
                            Games
                        </div>
                    )}
                    {games.map(game => {
                        const Icon = game.icon;
                        const isActive = location.pathname === game.path;
                        return (
                            <Link
                                key={game.id}
                                to={game.path}
                                className={`sidebar-item ${isActive ? 'active' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${game.gradient} shadow-md`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                {!collapsed && <span>{game.label}</span>}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom nav */}
            <div className="border-t border-[var(--border)] py-4 px-3">
                {bottomNav.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Collapse toggle */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-hover)] transition-colors z-10"
                style={{ display: collapsed ? 'none' : 'flex' }}
            >
                <svg className="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>
        </aside>
    );
}
