import { Gift, Trophy, Zap, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useGame } from '@/context/GameContext';

const promotions = [
    {
        id: 'daily-bonus',
        title: 'Daily Bonus',
        description: 'Claim $100 in free credits every 24 hours. No wagering required!',
        icon: Gift,
        color: 'from-purple-500 to-pink-500',
        action: 'Claim Now',
        available: true,
    },
    {
        id: 'slots-tournament',
        title: 'Slots Tournament',
        description: 'Compete against other players for a share of the $10,000 weekly prize pool.',
        icon: Trophy,
        color: 'from-amber-400 to-orange-500',
        action: 'Join Now',
        available: true,
    },
    {
        id: 'high-roller',
        title: 'High Roller Bonus',
        description: '50% bonus on deposits over $500. Maximum bonus $2,500.',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        action: 'Deposit',
        available: true,
    },
    {
        id: 'weekly-cashback',
        title: 'Weekly Cashback',
        description: 'Get 10% of your net losses back every Monday. VIP members get up to 25%!',
        icon: Clock,
        color: 'from-green-500 to-emerald-500',
        action: 'Learn More',
        available: false,
    },
];

export function Promotions() {
    const { addFunds } = useGame();

    const handleClaim = (promoId: string) => {
        if (promoId === 'daily-bonus') {
            addFunds(100);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-[var(--accent-muted)] text-[var(--accent)] px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Exclusive Offers
                </div>
                <h1 className="text-4xl font-bold mb-2">Promotions & Bonuses</h1>
                <p className="text-[var(--text-muted)]">Take advantage of these limited-time offers</p>
            </div>

            {/* Promotions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promotions.map((promo) => {
                    const Icon = promo.icon;
                    return (
                        <div key={promo.id} className="game-card p-6 relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-5`} />
                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${promo.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                                <p className="text-[var(--text-muted)] mb-4">{promo.description}</p>
                                <button
                                    onClick={() => handleClaim(promo.id)}
                                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${promo.available
                                            ? 'bet-button'
                                            : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed'
                                        }`}
                                    disabled={!promo.available}
                                >
                                    {promo.action}
                                    {promo.available && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* VIP Section */}
            <div className="home-hero relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/10" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">VIP Club</h2>
                        <p className="text-[var(--text-muted)] mb-4">
                            Join our exclusive VIP program for higher limits, faster withdrawals,
                            dedicated support, and exclusive bonuses worth up to $100,000.
                        </p>
                        <button className="bet-button px-6 py-3 inline-flex items-center gap-2">
                            Apply for VIP
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
