import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoBackground } from './VideoBackground';

export function LandingHero() {
    return (
        <div className="relative w-full h-screen min-h-[1180px] flex items-center justify-center overflow-hidden">
            <VideoBackground overlayOpacity={0.3} />

            <div className="relative z-10 w-[87.5%] max-w-[1024px] flex flex-col items-center text-center space-y-8">
                <h1 className="text-hero text-white tracking-tight animate-fade-in-up">
                    Play to <br />
                    <span className="opacity-90">Win Big</span>
                </h1>

                <p className="text-[22px] font-semibold text-[rgba(255,255,255,0.9)] max-w-[420px] leading-[1.4] animate-fade-in-up animation-delay-200">
                    Experience provably fair gaming with instant payouts. Your next big win is just one bet away.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-400">
                    <Link
                        to="/casino"
                        className="glass-button h-[56px] px-8 rounded-full flex items-center gap-2 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
                    >
                        Play Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        to="/promotions"
                        className="h-[56px] px-8 rounded-full flex items-center gap-2 text-[rgba(255,255,255,0.8)] font-semibold hover:text-white transition-colors"
                    >
                        View Promotions
                    </Link>
                </div>
            </div>
        </div>
    );
}
