import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingNavigation() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 h-[44px] transition-all duration-300",
                scrolled ? "bg-[rgba(22,22,23,0.8)] backdrop-blur-md" : "bg-transparent"
            )}
        >
            <div className="max-w-[1024px] mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    {/* Replaced generic Shield with a simpler minimalist icon representation or text as per "Apple logo SVG" inspiration 
               Since I don't have the Apple logo SVG, I'll use a very clean text/icon combo */}
                    <Shield className="w-4 h-4 text-white" fill="white" />
                </Link>

                {/* Menu Items */}
                <div className="hidden md:flex items-center gap-8">
                    {['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'Vision', 'AirPods', 'TV & Home', 'Entertainment', 'Accessories', 'Support'].map((item) => (
                        /* Just placeholders to mimic the Apple style structure requested, 
                           in a real scenario these would be 'Games', 'VIP', 'About', etc.
                           I will use relevant casino links but keep the style. */
                        null
                    ))}
                    <Link to="/casino/slots" className="text-[12px] font-semibold text-[rgba(255,255,255,0.8)] hover:text-white transition-opacity">Games</Link>
                    <Link to="/vip" className="text-[12px] font-semibold text-[rgba(255,255,255,0.8)] hover:text-white transition-opacity">VIP</Link>
                    <Link to="/promotions" className="text-[12px] font-semibold text-[rgba(255,255,255,0.8)] hover:text-white transition-opacity">Promotions</Link>
                    <Link to="/profile" className="text-[12px] font-semibold text-[rgba(255,255,255,0.8)] hover:text-white transition-opacity">Profile</Link>
                </div>

                {/* Mobile Menu Trigger (Simple dot or icon) */}
                <div className="md:hidden">
                    <div className="w-4 h-[1px] bg-white mb-1"></div>
                    <div className="w-4 h-[1px] bg-white"></div>
                </div>
            </div>
        </nav>
    );
}
