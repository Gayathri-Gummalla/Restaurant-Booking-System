'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        // Initial user check
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminToken');
        setUser(null);
        window.location.href = '/';
    };

    const navLinks = [
        { href: '/#cuisines', label: 'Cuisines' },
        { href: '/#about', label: 'About' },
        ...(user ? [{ href: '/my-reservations', label: 'My Bookings' }] : []),
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            const id = href.replace('/#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
            }
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-16 flex items-center justify-between ${isScrolled ? 'bg-black/90 backdrop-blur-lg h-20 shadow-2xl border-b border-white/5' : 'bg-transparent h-24'
                }`}
        >
            {/* Left: Logo & Name */}
            <Link href="/" className="flex items-center gap-4 group">
                <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Unique Professional Logo: Interlocking SG Monogram */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold via-gold-dark to-gold rounded-full shadow-[0_0_20px_rgba(212,168,83,0.3)] group-hover:rotate-[360deg] transition-transform duration-1000" />
                    <div className="absolute inset-[2px] bg-black rounded-full" />
                    <div className="relative flex items-center justify-center leading-none">
                        <span className="font-serif text-gold font-black text-xl tracking-tighter shadow-sm">SG</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-serif text-2xl font-bold text-white transition-colors leading-none group-hover:text-gold">Spice Garden</span>
                    <span className="text-[8px] uppercase font-bold tracking-[0.4em] text-gold mt-1">Imperial Dining</span>
                </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className={`text-sm font-bold tracking-widest transition-all relative group text-white ${!isScrolled ? 'drop-shadow-md' : ''}`}
                    >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                    </Link>
                ))}
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold">{user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 rounded-full border border-gold/30 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-gold hover:text-black transition-all"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/auth"
                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-[11px] font-black uppercase tracking-[0.2em] text-black hover:bg-gold-light transition-all shadow-xl shadow-gold/20 hover:-translate-y-0.5"
                    >
                        <User size={14} fill="currentColor" />
                        Login / Sign Up
                    </Link>
                )}
            </div>

            {/* Mobile Toggle */}
            <button
                className="md:hidden p-2 transition-all text-gold"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-top-1 duration-300 md:hidden shadow-3xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-lg font-medium tracking-widest text-white hover:text-gold"
                            onClick={(e) => scrollToSection(e, link.href)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user ? (
                        <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-gold text-center">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em]"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth"
                            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-gold text-black text-xs font-black uppercase tracking-[0.2em] shadow-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <User size={16} fill="currentColor" /> Login / Sign Up
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
