import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SolsticeSDK } from '@solsticeprotocol/sdk';
import { PublicKey } from '@solana/web3.js';
import { Shield, QrCode, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GameProvider, useGame } from '@/context/GameContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { CasinoHome } from '@/pages/CasinoHome';
import { Dice } from '@/pages/games/Dice';
import { CoinFlip } from '@/pages/games/CoinFlip';
import { Mines } from '@/pages/games/Mines';
import { Roulette } from '@/pages/games/Roulette';
import { Plinko } from '@/pages/games/Plinko';
import { Limbo } from '@/pages/games/Limbo';
import { Slots } from '@/pages/games/Slots';
import { Profile } from '@/pages/Profile';
import { Promotions } from '@/pages/Promotions';
import { Settings } from '@/pages/Settings';
import './App.css';

const APP_CONFIG = {
  appId: 'solstice-casino',
  appName: 'Solstice Casino',
  backendUrl: 'http://localhost:3000/api',
};

// Age Verification Component
function AgeVerification() {
  const { setVerified } = useGame();
  const navigate = useNavigate();
  const [sdk, setSdk] = useState<SolsticeSDK | null>(null);
  const [challengeQR, setChallengeQR] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const solsticeSDK = new SolsticeSDK({
          endpoint: 'https://api.devnet.solana.com',
          programId: new PublicKey('8jrTVUyvHrL5WTWyDoa6PTJRhh3MwbvLZXeGT81YjJjz'),
          network: 'devnet',
        });
        await solsticeSDK.initialize();
        setSdk(solsticeSDK);
      } catch (err) {
        console.error('SDK init error:', err);
        setError('Failed to initialize SDK');
      }
    };
    initSDK();
  }, []);

  const generateChallenge = async () => {
    if (!sdk) return;
    try {
      setError(null);

      const createResponse = await fetch(`${APP_CONFIG.backendUrl}/challenges/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: APP_CONFIG.appId,
          appName: APP_CONFIG.appName,
          proofType: 'age',
          params: { threshold: 18 },
          expirationSeconds: 300
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Backend error: ${createResponse.status}`);
      }

      const challengeData = await createResponse.json();
      const backendChallengeId = challengeData.challengeId || challengeData.challenge?.challengeId;

      if (!backendChallengeId) {
        throw new Error('No challengeId received from backend');
      }

      const result = await sdk.generateChallenge(
        APP_CONFIG.appId,
        APP_CONFIG.appName,
        'age',
        { threshold: 18 },
        { expirationSeconds: 300, callbackUrl: `${APP_CONFIG.backendUrl}/challenges/${backendChallengeId}/respond` }
      );

      setChallengeQR(result.qrDataEncoded);
      pollForProof(backendChallengeId);
    } catch (err: any) {
      setError(`Failed: ${err.message}`);
    }
  };

  const pollForProof = async (challengeId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`${APP_CONFIG.backendUrl}/challenges/${challengeId}/status`);

        if (!response.ok) throw new Error(`Status check failed: ${response.status}`);

        const data = await response.json();

        if (data.status === 'completed') {
          const verifyResponse = await fetch(`${APP_CONFIG.backendUrl}/challenges/${challengeId}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!verifyResponse.ok) throw new Error(`Verification failed: ${verifyResponse.status}`);

          const verifyData = await verifyResponse.json();

          if (verifyData.verified) {
            setVerified(true);
            navigate('/casino');
          } else {
            throw new Error('Proof verification failed');
          }
        } else if (data.status === 'expired') {
          setError('Challenge expired. Please try again.');
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 5000);
        } else {
          setError('Verification timeout. Please try again.');
        }
      } catch (err: any) {
        setError(`Polling failed: ${err.message}`);
      }
    };

    poll();
  };

  const skipVerification = () => {
    setVerified(true);
    navigate('/casino');
  };

  const reset = () => {
    setChallengeQR(null);
    setError(null);
  };

  if (!sdk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-darkest)]">
        <div className="age-verify-card text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[var(--accent)]" />
          <p className="text-[var(--text-muted)]">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-darkest)]">
      <div className="w-full max-w-md">
        {!challengeQR ? (
          <div className="age-verify-card">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--accent-glow)]">
                <Shield className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Solstice Casino</h1>
              <p className="text-[var(--text-muted)]">Age verification required (18+)</p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm mb-6">
                {error}
              </div>
            )}

            <div className="bg-[var(--bg-primary)] rounded-xl p-5 mb-6">
              <h3 className="font-semibold mb-3">How it works</h3>
              <ol className="space-y-3 text-sm text-[var(--text-muted)]">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-black text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                  Generate a verification QR code
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-black text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                  Scan with Solstice app
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-black text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                  Zero-knowledge proof verifies you're 18+
                </li>
              </ol>
            </div>

            <button onClick={generateChallenge} className="bet-button mb-4 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5" />
              Generate QR Code
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)]">or</span>
              </div>
            </div>

            <button
              onClick={skipVerification}
              className="w-full py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors font-medium"
            >
              Skip (Demo Mode)
            </button>
          </div>
        ) : (
          <div className="age-verify-card">
            <div className="text-center mb-6">
              <QrCode className="w-12 h-12 text-[var(--accent)] mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Scan QR Code</h2>
              <p className="text-sm text-[var(--text-muted)]">Open Solstice app and scan</p>
            </div>

            <div className="bg-white p-6 rounded-2xl mb-6">
              <QRCodeSVG value={challengeQR} size={256} className="w-full h-auto" />
            </div>

            <div className="flex items-center justify-center gap-2 text-[var(--accent)] mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Waiting for verification...</span>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={reset}
              className="w-full py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isVerified } = useGame();

  if (!isVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Layout wrapper for casino routes
function CasinoLayout() {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
}

// VIP placeholder
function VIP() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
        <span className="text-4xl">👑</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">VIP Club</h1>
      <p className="text-[var(--text-muted)] mb-8">
        Coming soon! Exclusive rewards for our most valued players.
      </p>
      <div className="inline-block px-6 py-3 bg-[var(--bg-card)] rounded-xl text-[var(--text-muted)]">
        Contact support to apply for VIP status
      </div>
    </div>
  );
}

// Main App Routes
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AgeVerification />} />
      <Route element={<CasinoLayout />}>
        <Route path="/casino" element={<CasinoHome />} />
        <Route path="/casino/dice" element={<Dice />} />
        <Route path="/casino/coinflip" element={<CoinFlip />} />
        <Route path="/casino/mines" element={<Mines />} />
        <Route path="/casino/roulette" element={<Roulette />} />
        <Route path="/casino/plinko" element={<Plinko />} />
        <Route path="/casino/limbo" element={<Limbo />} />
        <Route path="/casino/slots" element={<Slots />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/vip" element={<VIP />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
