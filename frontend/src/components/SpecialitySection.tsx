'use client';
import { Crown, Sparkles, Gem, ShieldCheck } from 'lucide-react';

export default function SpecialitySection() {
    const traits = [
        {
            icon: <Crown className="w-10 h-10" />,
            title: "Imperial Service",
            desc: "Experience the legendary hospitality that once graced the courts of royal dynasties."
        },
        {
            icon: <Sparkles className="w-10 h-10" />,
            title: "Celestial Flavors",
            desc: "Our master chefs use ancient techniques to create a divine balance of 24 distinct spices."
        },
        {
            icon: <Gem className="w-10 h-10" />,
            title: "Private Enclaves",
            desc: "Secluded dining chambers designed for intimate conversations and high-profile gatherings."
        },
        {
            icon: <ShieldCheck className="w-10 h-10" />,
            title: "Curated Exclusivity",
            desc: "Hand-picked ingredients from our private estates, ensuring a rare and superior harvest."
        }
    ];

    return (
        <section className="py-40 px-6 bg-bg relative overflow-hidden">
            {/* Royal Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-deep-red/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <div className="flex flex-col items-center text-center mb-32">
                    <div className="flex items-center gap-6 mb-8 text-gold">
                        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-gold/60" />
                        <Crown className="w-6 h-6 animate-pulse" />
                        <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>
                    <h2 className="font-serif text-5xl md:text-8xl font-bold mb-10 tracking-tight text-white italic">The Royal Legacy</h2>
                    <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-xl md:text-2xl font-light">
                        Spice Garden is not merely a restaurant; it is a sanctuary where the grandeur of history
                        meets the pinnacle of modern luxury. We cater to those who seek nothing less than the extraordinary.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {traits.map((trait, idx) => (
                        <div
                            key={idx}
                            className="group relative p-10 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-gold/30 hover:bg-white/[0.03] transition-all duration-700 overflow-hidden"
                        >
                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gold/0 group-hover:border-gold/40 group-hover:w-16 group-hover:h-16 transition-all duration-700" />

                            <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center text-gold mb-10 group-hover:scale-110 group-hover:bg-gold/15 transition-all duration-700 border border-gold/10">
                                {trait.icon}
                            </div>
                            <h3 className="font-serif text-3xl font-bold mb-6 group-hover:text-gold transition-colors">{trait.title}</h3>
                            <p className="text-gray-500 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                                {trait.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Celebrity Quote Section */}
                <div className="mt-40 p-16 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 text-center max-w-4xl mx-auto relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-gold text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-full">
                        Patron Testimonial
                    </div>
                    <p className="font-serif text-3xl md:text-4xl text-white opacity-90 italic mb-8 leading-snug">
                        "The most exquisite Andhra dining experience I've had anywhere in the world. It truly feels like walking into a modern palace."
                    </p>
                    <div className="flex flex-col items-center">
                        <span className="font-black uppercase tracking-[0.2em] text-gold text-xs">A-List Film Celebrity</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 italic">Private Guest Signature</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
