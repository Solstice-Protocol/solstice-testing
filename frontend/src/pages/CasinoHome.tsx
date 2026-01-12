import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dices, Coins, Bomb, Target, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';

const games = [
    { id: 'dice', name: 'Dice', icon: Dices, color: 'from-blue-500 to-indigo-600', desc: 'Roll over or under your target number', multiplier: 'Up to 99x' },
    { id: 'coinflip', name: 'Coin Flip', icon: Coins, color: 'from-yellow-400 to-orange-500', desc: 'Double or nothing - pick heads or tails', multiplier: '1.98x' },
    { id: 'mines', name: 'Mines', icon: Bomb, color: 'from-red-500 to-rose-600', desc: 'Uncover gems, avoid the mines', multiplier: 'Up to 24x' },
    { id: 'roulette', name: 'Roulette', icon: Target, color: 'from-green-500 to-emerald-600', desc: 'Spin the wheel and test your luck', multiplier: 'Up to 36x' },
];

export function CasinoHome() {
    const { balance, resetBalance, totalWins, totalLosses } = useGame();

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-6">
                        <div className="flex items-center gap-3">
                            <Shield className="w-10 h-10 text-[var(--accent)]" />
                            <div>
                                <h1 className="text-3xl font-bold gradient">Solstice Casino</h1>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">Powered by Zero-Knowledge Proofs</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg px-4 py-2">
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">Balance</div>
                                <div className="text-xl font-bold text-[var(--accent)]">${balance.toFixed(2)}</div>
                            </div>
                            <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg px-4 py-2">
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">W/L</div>
                                <div className="text-sm font-mono">
                                    <span className="text-green-400">{totalWins}</span>/<span className="text-red-400">{totalLosses}</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={resetBalance}>
                                <RefreshCw className="w-4 h-4 mr-1" />Reset
                            </Button>
                        </div>
                    </div>
                </header>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                        <span className="gradient">CASINO LOUNGE</span>
                    </h2>
                    <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
                        Choose your game and test your luck. All games are provably fair.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {games.map((game, i) => (
                        <motion.div key={game.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                            <Link to={`/casino/${game.id}`}>
                                <Card variant="glass" className="group cursor-pointer hover:border-[var(--accent)]/50 transition-all duration-300 overflow-hidden">
                                    <CardContent className="p-6 relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                        <div className="relative flex items-start gap-4">
                                            <div className={`p-4 rounded-xl bg-gradient-to-br ${game.color} text-white shadow-lg`}>
                                                <game.icon className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-2xl font-bold">{game.name}</h3>
                                                    <span className="text-xs font-mono bg-[hsl(var(--muted))] px-2 py-1 rounded text-[var(--accent)]">{game.multiplier}</span>
                                                </div>
                                                <p className="text-[hsl(var(--muted-foreground))] text-sm">{game.desc}</p>
                                            </div>
                                        </div>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                                            <span className="text-[var(--accent)] text-2xl">→</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <footer className="mt-12 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    <p>Age verified via <span className="text-[var(--accent)]">Solstice Protocol</span></p>
                    <p className="mt-1">Demo tokens only • Not real money</p>
                </footer>
            </div>
        </div>
    );
}
