import { LandingNavigation } from '@/components/landing/LandingNavigation';
import { LandingHero } from '@/components/landing/LandingHero';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { Shield } from 'lucide-react';

export function CasinoLanding() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <LandingNavigation />

            <main>
                <LandingHero />
                <FeatureSection />
                <FAQSection />
            </main>

            <footer className="py-[64px] bg-black border-t border-[rgba(255,255,255,0.1)]">
                <div className="max-w-[1024px] mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-6 h-6 text-white" fill="white" />
                        <span className="text-[18px] font-bold">Solstice</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                        <div className="flex flex-col gap-4">
                            <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Platform</span>
                            <a href="#" className="text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white hover:underline">Games</a>
                            <a href="#" className="text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white hover:underline">Promotions</a>
                            <a href="#" className="text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white hover:underline">VIP</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-[12px] font-semibold text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Support</span>
                            <a href="#" className="text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white hover:underline">Help Center</a>
                            <a href="#" className="text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white hover:underline">Fairness</a>
                            <a href="#" className="text-[14px] text-[rgba(255,255,255,0.8)] hover:text-white hover:underline">Contact</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1024px] mx-auto px-6 mt-16 text-[12px] text-[rgba(255,255,255,0.4)]">
                    © 2026 Solstice Protocol. All rights reserved. 18+ only.
                </div>
            </footer>
        </div>
    );
}
