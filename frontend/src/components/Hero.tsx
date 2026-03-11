'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

function OccupancyIndicator() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.getSummary();
                if (res.success) setStats(res);
            } catch (err) {
                console.error('Failed to fetch occupancy', err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (!stats) return null;

    const isHigh = stats.occupancyRate > 70;
    const isFull = stats.occupancyRate >= 95;

    return (
        <div className="flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
            <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${isFull ? 'text-red-500 bg-red-500' :
                isHigh ? 'text-orange-500 bg-orange-500' : 'text-green-500 bg-green-500'
                }`} />
            <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] text-white/90 uppercase font-black tracking-[0.2em]">
                    {isFull ? 'Restaurant is Full' :
                        isHigh ? 'High Demand Today' : 'Tables Available Now'}
                </span>
                {stats.occupancyRate > 0 && (
                    <span className="text-[8px] text-gold uppercase font-bold tracking-widest mt-1 opacity-80">
                        {stats.occupancyRate}% Capacity • {stats.bookedToday} Bookings Today
                    </span>
                )}
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <section className="relative h-[75vh] w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Full HD Background Image - Maximum Clarity */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=100&w=2000"
                    alt="Spice Garden Imperial Interior"
                    className="w-full h-full object-cover"
                />
                {/* Minimal overlay for center clarity + Top gradient for Navbar visibility */}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/40" />
            </div>

            {/* Content Centered */}
            <div className="relative z-10 text-center px-6 w-full">
                <div className="space-y-8 animate-in fade-in zoom-in duration-1000">
                    <div className="space-y-4">
                        <h1 className="font-serif text-6xl md:text-[8vw] font-bold text-white tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-[0.85] italic">
                            Spice Garden
                        </h1>
                        <div className="flex items-center justify-center gap-8 pt-4">
                            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-gold" />
                            <p className="text-gold font-black tracking-[0.8em] uppercase text-[10px] md:text-sm drop-shadow-lg">
                                Andhra Fine Dining
                            </p>
                            <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-gold" />
                        </div>
                    </div>

                    <p className="font-serif text-xl md:text-[2.5vw] text-white italic font-light max-w-5xl mx-auto leading-tight drop-shadow-2xl opacity-100">
                        “Experience the Royal Essence of <br /> Andhra Cuisine”
                    </p>

                    {/* Live Occupancy Status */}
                    <div className="pt-8 flex justify-center">
                        <OccupancyIndicator />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-80 z-20">
                <span className="text-[10px] text-white/70 uppercase tracking-[0.5em] font-medium">Scroll down</span>
                <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent" />
            </div>
        </section>
    );
}
