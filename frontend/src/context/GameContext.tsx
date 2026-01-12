import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

const INITIAL_BALANCE = 1000;
const STORAGE_KEY = 'solstice-casino-state';

export interface Bet {
    id: string;
    game: string;
    amount: number;
    multiplier: number;
    payout: number;
    win: boolean;
    timestamp: number;
}

interface GameState {
    // User
    username: string;
    level: number;
    xp: number;

    // Balance
    balance: number;
    isVerified: boolean;

    // Stats
    totalWins: number;
    totalLosses: number;
    totalWagered: number;
    profit: number;

    // History
    bets: Bet[];
}

interface GameContextType extends GameState {
    setVerified: (verified: boolean) => void;
    placeBet: (amount: number) => boolean;
    settleBet: (game: string, amount: number, multiplier: number, win: boolean) => void;
    resetBalance: () => void;
    addFunds: (amount: number) => void;
    setUsername: (name: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function calculateLevel(wagered: number): { level: number; xp: number } {
    // Level up every $500 wagered
    const level = Math.floor(wagered / 500) + 1;
    const xp = Math.floor((wagered % 500) / 5);
    return { level, xp };
}

function loadState(): GameState {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const { level, xp } = calculateLevel(parsed.totalWagered ?? 0);
            return {
                username: parsed.username ?? 'Player',
                level,
                xp,
                balance: parsed.balance ?? INITIAL_BALANCE,
                isVerified: parsed.isVerified ?? false,
                totalWins: parsed.totalWins ?? 0,
                totalLosses: parsed.totalLosses ?? 0,
                totalWagered: parsed.totalWagered ?? 0,
                profit: parsed.profit ?? 0,
                bets: parsed.bets ?? [],
            };
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
    return {
        username: 'Player',
        level: 1,
        xp: 0,
        balance: INITIAL_BALANCE,
        isVerified: false,
        totalWins: 0,
        totalLosses: 0,
        totalWagered: 0,
        profit: 0,
        bets: [],
    };
}

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<GameState>(loadState);

    // Persist state to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const setVerified = useCallback((verified: boolean) => {
        setState(prev => ({ ...prev, isVerified: verified }));
    }, []);

    const setUsername = useCallback((name: string) => {
        setState(prev => ({ ...prev, username: name }));
    }, []);

    const placeBet = useCallback((amount: number): boolean => {
        if (amount <= 0 || amount > state.balance) {
            return false;
        }
        setState(prev => {
            const newWagered = prev.totalWagered + amount;
            const { level, xp } = calculateLevel(newWagered);
            return {
                ...prev,
                balance: prev.balance - amount,
                totalWagered: newWagered,
                level,
                xp,
            };
        });
        return true;
    }, [state.balance]);

    const settleBet = useCallback((game: string, amount: number, multiplier: number, win: boolean) => {
        const payout = win ? amount * multiplier : 0;
        const profitDelta = win ? payout - amount : -amount;

        const bet: Bet = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            game,
            amount,
            multiplier: win ? multiplier : 0,
            payout,
            win,
            timestamp: Date.now(),
        };

        setState(prev => ({
            ...prev,
            balance: prev.balance + payout,
            totalWins: win ? prev.totalWins + 1 : prev.totalWins,
            totalLosses: win ? prev.totalLosses : prev.totalLosses + 1,
            profit: prev.profit + profitDelta,
            bets: [bet, ...prev.bets.slice(0, 99)],
        }));
    }, []);

    const resetBalance = useCallback(() => {
        setState({
            username: state.username,
            level: 1,
            xp: 0,
            balance: INITIAL_BALANCE,
            isVerified: state.isVerified,
            totalWins: 0,
            totalLosses: 0,
            totalWagered: 0,
            profit: 0,
            bets: [],
        });
    }, [state.isVerified, state.username]);

    const addFunds = useCallback((amount: number) => {
        setState(prev => ({ ...prev, balance: prev.balance + amount }));
    }, []);

    return (
        <GameContext.Provider value={{
            ...state,
            setVerified,
            setUsername,
            placeBet,
            settleBet,
            resetBalance,
            addFunds,
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
