import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const INITIAL_BALANCE = 1000;

interface GameContextType {
    balance: number;
    isVerified: boolean;
    totalWins: number;
    totalLosses: number;
    setVerified: (verified: boolean) => void;
    placeBet: (amount: number) => boolean;
    winBet: (payout: number) => void;
    loseBet: () => void;
    resetBalance: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState(INITIAL_BALANCE);
    const [isVerified, setIsVerified] = useState(false);
    const [totalWins, setTotalWins] = useState(0);
    const [totalLosses, setTotalLosses] = useState(0);

    const setVerified = useCallback((verified: boolean) => {
        setIsVerified(verified);
    }, []);

    const placeBet = useCallback((amount: number): boolean => {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        setBalance(prev => prev - amount);
        return true;
    }, [balance]);

    const winBet = useCallback((payout: number) => {
        setBalance(prev => prev + payout);
        setTotalWins(prev => prev + 1);
    }, []);

    const loseBet = useCallback(() => {
        setTotalLosses(prev => prev + 1);
    }, []);

    const resetBalance = useCallback(() => {
        setBalance(INITIAL_BALANCE);
        setTotalWins(0);
        setTotalLosses(0);
    }, []);

    return (
        <GameContext.Provider value={{
            balance,
            isVerified,
            totalWins,
            totalLosses,
            setVerified,
            placeBet,
            winBet,
            loseBet,
            resetBalance,
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
