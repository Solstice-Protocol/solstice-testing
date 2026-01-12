import { useState, useCallback } from 'react';

const INITIAL_BALANCE = 1000;

export interface GameState {
    balance: number;
    lastBet: number | null;
    lastWin: number | null;
    totalWins: number;
    totalLosses: number;
}

export function useGameState() {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [lastBet, setLastBet] = useState<number | null>(null);
    const [lastWin, setLastWin] = useState<number | null>(null);
    const [totalWins, setTotalWins] = useState(0);
    const [totalLosses, setTotalLosses] = useState(0);

    const placeBet = useCallback((amount: number): boolean => {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        setBalance(prev => prev - amount);
        setLastBet(amount);
        setLastWin(null);
        return true;
    }, [balance]);

    const winBet = useCallback((payout: number) => {
        setBalance(prev => prev + payout);
        setLastWin(payout);
        setTotalWins(prev => prev + 1);
    }, []);

    const loseBet = useCallback(() => {
        setLastWin(0);
        setTotalLosses(prev => prev + 1);
    }, []);

    const resetBalance = useCallback(() => {
        setBalance(INITIAL_BALANCE);
        setLastBet(null);
        setLastWin(null);
        setTotalWins(0);
        setTotalLosses(0);
    }, []);

    return {
        balance,
        lastBet,
        lastWin,
        totalWins,
        totalLosses,
        placeBet,
        winBet,
        loseBet,
        resetBalance,
    };
}
