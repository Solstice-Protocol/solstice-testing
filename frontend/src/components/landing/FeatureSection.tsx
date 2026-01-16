import { Link } from 'react-router-dom';
import { VideoBackground } from './VideoBackground';
import { ArrowRight } from 'lucide-react';

const FEATURES = [
    {
        title: "Mines",
        description: "Uncover gems, avoid the mines.",
        link: "/casino/mines",
        size: "large"
    },
    {
        title: "Plinko",
        description: "Watch the balls drop.",
        link: "/casino/plinko",
        size: "medium"
    },
    {
        title: "Roulette",
        description: "Spin the wheel.",
        link: "/casino/roulette",
        size: "small"
    },
    {
        title: "Dice",
        description: "Roll for riches.",
        link: "/casino/dice",
        size: "small"
    }
];

export function FeatureSection() {
    return (
        <section className="w-full py-[160px] px-6 bg-black">
            <div className="max-w-[1024px] mx-auto">
                <div className="mb-[80px] text-center">
                    <h2 className="text-[56px] font-semibold text-[#F5F5F7] leading-[1.1] mb-6">Originals</h2>
                    <p className="text-[22px] text-[rgba(255,255,255,0.8)] font-medium">Provably fair games built for speed.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Large Card - Spans 2 cols, 2 rows on lg */}
                    <Link to={FEATURES[0].link} className="relative group rounded-[28px] overflow-hidden lg:col-span-2 lg:row-span-2 md:col-span-2">
                        <VideoBackground className="transition-transform duration-700 group-hover:scale-105" overlayOpacity={0.4} />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <h3 className="text-[48px] font-semibold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{FEATURES[0].title}</h3>
                            <p className="text-[18px] text-[rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{FEATURES[0].description}</p>
                        </div>
                    </Link>

                    {/* Medium Card - Spans 1 col, 2 rows */}
                    <Link to={FEATURES[1].link} className="relative group rounded-[28px] overflow-hidden lg:col-span-1 lg:row-span-2">
                        <VideoBackground className="transition-transform duration-700 group-hover:scale-105" overlayOpacity={0.4} />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <h3 className="text-[32px] font-semibold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{FEATURES[1].title}</h3>
                            <p className="text-[16px] text-[rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{FEATURES[1].description}</p>
                        </div>
                    </Link>

                    {/* Small Cards */}
                    {FEATURES.slice(2).map((feature, i) => (
                        <Link key={i} to={feature.link} className="relative group rounded-[28px] overflow-hidden">
                            <VideoBackground className="transition-transform duration-700 group-hover:scale-105" overlayOpacity={0.4} />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="flex items-center justify-between w-full">
                                    <h3 className="text-[28px] font-semibold text-white">{feature.title}</h3>
                                    <ArrowRight className="text-white w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
