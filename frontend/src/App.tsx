import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SolsticeSDK } from '@solsticeprotocol/sdk';
import { PublicKey } from '@solana/web3.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, QrCode, Loader2, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { GameProvider, useGame } from '@/context/GameContext';
import { CasinoHome } from '@/pages/CasinoHome';
import { Dice } from '@/pages/games/Dice';
import { CoinFlip } from '@/pages/games/CoinFlip';
import { Mines } from '@/pages/games/Mines';
import { Roulette } from '@/pages/games/Roulette';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

const APP_CONFIG = {
  appId: 'solstice-vault-demo',
  appName: 'Solstice Casino',
  backendUrl: 'http://localhost:3000/api',
};

// Age Verification Component
function AgeVerification() {
  const { setVerified } = useGame();
  const navigate = useNavigate();
  const [sdk, setSdk] = useState<SolsticeSDK | null>(null);
  const [challenge, setChallenge] = useState<any>(null);
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

      const fullChallenge = {
        challengeId: backendChallengeId,
        appId: APP_CONFIG.appId,
        appName: APP_CONFIG.appName,
        proofType: 'age',
        params: { threshold: 18 },
        ...(result.challenge || {})
      };

      setChallenge(fullChallenge);
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

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'completed') {
          const verifyResponse = await fetch(`${APP_CONFIG.backendUrl}/challenges/${challengeId}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!verifyResponse.ok) {
            throw new Error(`Verification failed: ${verifyResponse.status}`);
          }

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

  // Demo mode: Skip verification
  const skipVerification = () => {
    setVerified(true);
    navigate('/casino');
  };

  const reset = () => {
    setChallenge(null);
    setChallengeQR(null);
    setError(null);
  };

  if (!sdk) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <Card variant="glass" className="w-96">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[var(--accent)]" />
            <p className="text-[hsl(var(--muted-foreground))]">Initializing Solstice SDK...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12" data-aos="fade-down">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-[var(--accent)]" />
            <span className="text-3xl font-bold gradient">Solstice Casino</span>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">
            Age-restricted content • Powered by <span className="text-[var(--accent)]">Solstice Protocol</span>
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          {!challengeQR ? (
            <Card variant="glass" data-aos="fade-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[var(--accent)]" />
                  Age Verification Required (18+)
                </CardTitle>
                <CardDescription>
                  You must verify your age using zero-knowledge proof to access the casino
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg">How it works:</h3>
                  <ol className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--accent)] min-w-[24px]">1.</span>
                      <span>We generate a verification challenge QR code</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--accent)] min-w-[24px]">2.</span>
                      <span>You scan it with the Solstice app</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--accent)] min-w-[24px]">3.</span>
                      <span>The app generates a zero-knowledge proof that you're 18+</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--accent)] min-w-[24px]">4.</span>
                      <span>We verify the proof and grant you access (no data shared!)</span>
                    </li>
                  </ol>
                </div>

                <Button onClick={generateChallenge} className="w-full" size="lg">
                  <QrCode className="w-5 h-5 mr-2" />
                  Generate Verification QR Code
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[hsl(var(--border))]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[hsl(var(--background))] px-2 text-[hsl(var(--muted-foreground))]">
                      Or for demo
                    </span>
                  </div>
                </div>

                <Button onClick={skipVerification} variant="outline" className="w-full">
                  Skip Verification (Demo Mode)
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card variant="glass" data-aos="fade-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-[var(--accent)]" />
                  Scan This QR Code
                </CardTitle>
                <CardDescription>
                  Open the Solstice app and scan this challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-6 rounded-lg mx-auto w-fit shadow-lg glow-accent">
                  <QRCodeSVG value={challengeQR} size={256} />
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[var(--accent)]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">Waiting for proof submission...</span>
                  </div>
                  {challenge?.challengeId && (
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Challenge ID: <span className="font-mono">{challenge.challengeId.substring(0, 16)}...</span>
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button onClick={reset} variant="outline" className="w-full">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
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

// Main App Routes
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AgeVerification />} />
      <Route path="/casino" element={
        <ProtectedRoute><CasinoHome /></ProtectedRoute>
      } />
      <Route path="/casino/dice" element={
        <ProtectedRoute><Dice /></ProtectedRoute>
      } />
      <Route path="/casino/coinflip" element={
        <ProtectedRoute><CoinFlip /></ProtectedRoute>
      } />
      <Route path="/casino/mines" element={
        <ProtectedRoute><Mines /></ProtectedRoute>
      } />
      <Route path="/casino/roulette" element={
        <ProtectedRoute><Roulette /></ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    AOS.init({
      once: true,
      duration: 600,
      offset: 40,
      mirror: false,
      disable: prefersReducedMotion || window.innerWidth < 768,
    });
  }, []);

  return (
    <BrowserRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
