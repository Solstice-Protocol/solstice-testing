import { useState, useEffect } from 'react';
import { SolsticeSDK } from '@solsticeprotocol/sdk';
import { PublicKey } from '@solana/web3.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, QrCode, CheckCircle2, Loader2, Lock, Trophy, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

const RESTRICTED_CONTENT = {
  game: {
    title: 'Elite Crypto Casino',
    description: 'High-stakes NFT gaming with 1000 SOL prize pool',
  },
};

const APP_CONFIG = {
  appId: 'solstice-vault-demo',
  appName: 'Solstice Vault',
  backendUrl: 'http://localhost:3000/api',
};

function App() {
  const [sdk, setSdk] = useState<SolsticeSDK | null>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [challengeQR, setChallengeQR] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [, setIsWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize AOS animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    AOS.init({
      once: true,
      duration: 600,
      offset: 40,
      mirror: false,
      disable: prefersReducedMotion || window.innerWidth < 768,
    });
  }, []);

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
        console.log('✅ Solstice SDK initialized');
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
      setIsWaiting(true);

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
      console.log('📦 Backend response:', challengeData);

      const backendChallengeId = challengeData.challengeId || challengeData.challenge?.challengeId;

      if (!backendChallengeId) {
        throw new Error('No challengeId received from backend');
      }

      console.log('✅ Challenge created on backend:', backendChallengeId);

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
      console.log('✅ Challenge QR generated:', fullChallenge.challengeId);

      pollForProof(backendChallengeId);
    } catch (err: any) {
      setError(`Failed: ${err.message}`);
      setIsWaiting(false);
      console.error('Challenge generation error:', err);
    }
  };

  const pollForProof = async (challengeId: string) => {
    console.log('🔄 Starting to poll for challenge:', challengeId);
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        console.log(`📡 Polling attempt ${attempts + 1}/${maxAttempts} for challenge: ${challengeId}`);
        const response = await fetch(`${APP_CONFIG.backendUrl}/challenges/${challengeId}/status`);

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Challenge status:', data.status);

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
            setIsVerified(true);
            setIsWaiting(false);
            console.log('✅ Proof verified successfully!');
          } else {
            throw new Error('Proof verification failed');
          }
        } else if (data.status === 'expired') {
          setError('Challenge expired. Please try again.');
          setIsWaiting(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 5000);
        } else {
          setError('Verification timeout. Please try again.');
          setIsWaiting(false);
        }
      } catch (err: any) {
        console.error('Polling error:', err);
        setError(`Polling failed: ${err.message}`);
        setIsWaiting(false);
      }
    };

    poll();
  };

  const reset = () => {
    setChallenge(null);
    setChallengeQR(null);
    setIsVerified(false);
    setIsWaiting(false);
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
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12" data-aos="fade-down">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-[var(--accent)]" />
            <span className="text-3xl font-bold gradient">
              {RESTRICTED_CONTENT.game.title}
            </span>
          </div>
          <p className="text-[hsl(var(--muted-foreground))]">
            Age-restricted content • Powered by <span className="text-[var(--accent)]">Solstice Protocol</span>
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          {/* Initial state - not verified, no QR */}
          {!isVerified && !challengeQR && (
            <Card variant="glass" data-aos="fade-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[var(--accent)]" />
                  Age Verification Required (18+)
                </CardTitle>
                <CardDescription>
                  You must verify your age using zero-knowledge proof to access this content
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
                      <span>You scan it with the Solstice app (where you registered your identity)</span>
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
              </CardContent>
            </Card>
          )}

          {/* QR Code displayed, waiting for scan */}
          {challengeQR && !isVerified && (
            <Card variant="glass" data-aos="fade-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-[var(--accent)]" />
                  Scan This QR Code
                </CardTitle>
                <CardDescription>
                  Open the main Solstice app and scan this challenge to verify your age
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
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    This QR code expires in 5 minutes
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg p-4">
                  <p className="text-sm text-[var(--accent)]">
                    <strong>📱 Instructions:</strong> Open the Solstice app on your phone, go to the "Scan Challenge" tab, and scan this QR code with your camera.
                  </p>
                </div>

                <Button onClick={reset} variant="outline" className="w-full">
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Verified state - show content */}
          {isVerified && (
            <>
              <Card variant="accent" className="mb-6" data-aos="zoom-in">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[var(--accent)]" />
                  <h3 className="text-2xl font-bold text-[var(--accent)] mb-2">
                    Age Verified! ✅
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    You have been verified as 18+ using zero-knowledge proof technology
                  </p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                    No personal data was shared in this process
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass" data-aos="fade-up" data-aos-delay="200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    {RESTRICTED_CONTENT.game.title}
                  </CardTitle>
                  <CardDescription>
                    {RESTRICTED_CONTENT.game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                    <h4 className="text-xl font-bold mb-2">1000 SOL Prize Pool</h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Compete in high-stakes games and win big rewards!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[var(--accent)]">1,234</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Active Players</p>
                    </div>
                    <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-[var(--accent)]">24/7</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Live Games</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg p-3 text-center hover:border-[var(--accent)]/50 transition-colors cursor-pointer">
                      <p className="text-lg font-bold text-blue-400">🎰</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Slots</p>
                    </div>
                    <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg p-3 text-center hover:border-[var(--accent)]/50 transition-colors cursor-pointer">
                      <p className="text-lg font-bold text-red-400">🃏</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Poker</p>
                    </div>
                    <div className="bg-[hsl(var(--muted))]/50 border border-[hsl(var(--border))] rounded-lg p-3 text-center hover:border-[var(--accent)]/50 transition-colors cursor-pointer">
                      <p className="text-lg font-bold text-green-400">🎲</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Dice</p>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <Trophy className="w-5 h-5 mr-2" />
                    Enter Game Lobby
                  </Button>

                  <Button onClick={reset} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Logout & Reset
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-[hsl(var(--muted-foreground))]" data-aos="fade-up">
          <p>Powered by <span className="text-[var(--accent)]">Solstice Protocol</span> • Zero-Knowledge Identity Verification</p>
          <p className="mt-1">Built on Solana Devnet • Challenge-Response Architecture</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
