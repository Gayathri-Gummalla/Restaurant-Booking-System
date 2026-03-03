'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CuisineSection from '@/components/CuisineSection';
import AboutSection from '@/components/AboutSection';
import { ToastContainer, useToast } from '@/components/Toast';

export default function HomePage() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-white selection:bg-gold selection:text-white">
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <main>
        {/* Section 1: Hero */}
        <div className="w-full">
          <Hero />
        </div>

        {/* Section 2: Cuisine Section */}
        <CuisineSection />

        {/* Section 3: About (Interactive Full Story) */}
        <AboutSection />
      </main>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-gray-100 text-center bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-center space-y-3">
            <h3 className="font-serif text-5xl md:text-6xl font-black text-gray-900 tracking-tight">Spice Garden</h3>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs uppercase font-black tracking-[0.4em] text-gold">Andhra Fine Dining</span>
              <div className="w-12 h-0.5 bg-gold/30 rounded-full" />
            </div>
          </div>

          <div className="max-w-md">
            <p className="text-gray-500 font-medium leading-relaxed italic">
              Plot No. 42, Jubilee Hills, Road No. 36,<br />
              Near Metro Station, Hyderabad - 500033
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            <a href="#" className="hover:text-gold transition-all hover:tracking-[0.3em]">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-all hover:tracking-[0.3em]">Terms of Service</a>
            <a href="#" className="hover:text-gold transition-all hover:tracking-[0.3em]">Contact Us</a>
          </div>

          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest pt-4 opacity-60">
            © {new Date().getFullYear()} Spice Garden. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
