'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChefHat, Flame, Leaf, CalendarDays } from 'lucide-react';
import { menuData } from '@/data/menuData';
import BookingModal from '@/components/BookingModal';

export default function MenuPage() {
    const params = useParams();
    const categoryId = params.id as string;
    const category = menuData[categoryId];
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const checkAuth = () => {
            const user = localStorage.getItem('user');
            setIsAuthenticated(!!user);
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    if (isAuthenticated === null) {
        return <div className="min-h-screen bg-black" />; // Loading state
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/30">
                        <ChefHat size={40} className="text-gold" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-white tracking-tight">Members Only</h1>
                        <p className="text-gray-400 font-medium leading-relaxed italic">
                            “Join our inner circle to explore the culinary secrets and royal flavors of Andhra.”
                        </p>
                    </div>
                    <div className="pt-8 flex flex-col gap-4">
                        <Link
                            href="/auth"
                            className="bg-gold text-black font-black text-xs uppercase tracking-[0.2em] py-5 rounded-full shadow-2xl shadow-gold/20 hover:bg-[#c29744] transition-all transform hover:-translate-y-1"
                        >
                            Login / Register to View Menu
                        </Link>
                        <Link
                            href="/"
                            className="text-white/50 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="font-serif text-4xl font-bold mb-4">Category Not Found</h1>
                <Link href="/" className="text-gold hover:underline font-sans">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-gold selection:text-white">
            {/* Header / Back Button */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 h-20 flex items-center justify-between ${isScrolled ? 'bg-black/90 backdrop-blur-lg shadow-2xl border-b border-white/5' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Link
                        href={`/#${categoryId}`}
                        className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-[0.3em] hover:text-gold transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Menu
                    </Link>
                    <div className="hidden md:flex flex-col items-center">
                        <span className="font-serif text-xl font-bold text-white leading-none">Spice Garden</span>
                        <span className="text-[8px] uppercase font-black tracking-[0.5em] text-gold">Andhra Fine Dining</span>
                    </div>

                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="flex items-center gap-2 bg-gold hover:bg-[#c29744] text-black font-black text-[10px] uppercase tracking-[0.2em] px-6 h-12 rounded-full shadow-lg shadow-gold/20 transition-all transform hover:-translate-y-1 active:scale-[0.98]"
                    >
                        <CalendarDays size={16} />
                        Book Table
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative py-32 px-6 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={category.bannerImage}
                        alt={category.name}
                        className="w-full h-full object-cover animate-ken-burns"
                    />
                </div>

                <div className="relative z-10 text-center max-w-4xl animate-in fade-in zoom-in duration-1000">
                    <span className="text-gold font-black uppercase tracking-[0.6em] text-[10px] mb-4 block">Our Signature</span>
                    <h1 className="font-serif text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 drop-shadow-2xl">
                        {category.name}
                    </h1>
                    <div className="flex items-center justify-center gap-6 mb-8">
                        <div className="h-px w-12 bg-white/30" />
                        <ChefHat className="text-gold" size={32} />
                        <div className="h-px w-12 bg-white/30" />
                    </div>
                </div>
            </section>

            {/* Description & List */}
            <section className="py-24 px-6 md:px-16 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 max-w-2xl mx-auto space-y-6">
                        <p className="text-gray-500 text-lg leading-relaxed font-light italic">
                            "{category.description}"
                        </p>
                        <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {category.items.map((item, index) => (
                            <div
                                key={item.id}
                                className="group relative animate-in fade-in slide-in-from-bottom duration-700"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-100 mb-6">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Badges */}
                                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                                        <div className={`p-2 rounded-full backdrop-blur-md ${item.isVeg ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            <Leaf size={14} className={item.isVeg ? 'block' : 'hidden'} />
                                            <div className={`w-3.5 h-3.5 border-2 ${item.isVeg ? 'border-green-600' : 'border-red-600'} rounded-sm flex items-center justify-center`} style={{ display: item.isVeg ? 'none' : 'flex' }}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                            </div>
                                        </div>
                                        {item.spiceLevel > 0 && (
                                            <div className="p-2 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 backdrop-blur-md">
                                                <Flame size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                        <span className="text-white font-black text-[10px] uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                            Signature Dish
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 px-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-gold transition-colors duration-300">
                                            {item.name}
                                        </h3>
                                        <span className="font-serif text-xl font-bold text-gold">₹{item.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed font-light line-clamp-2">
                                        {item.description}
                                    </p>
                                    <div className="pt-2 flex items-center gap-2">
                                        {[...Array(item.spiceLevel)].map((_, i) => (
                                            <span key={i} className="text-orange-500">🌶</span>
                                        ))}
                                        <span className={`text-[10px] font-black uppercase tracking-widest ml-auto ${item.isVeg ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 px-6 border-t border-gray-100 text-center bg-gray-50/50">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <span className="font-serif text-3xl font-bold text-gray-900">Spice Garden</span>
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gold">Andhra Fine Dining</span>
                    </div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                        © {new Date().getFullYear()} Spice Garden. All rights reserved.
                    </p>
                </div>
            </footer>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
            />
        </div>
    );
}
