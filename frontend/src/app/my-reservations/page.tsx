'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import { Search, Mail, Key, Calendar, Users, MapPin, Hash, Trash2, Edit3, X, RefreshCw, AlertCircle } from 'lucide-react';

interface Reservation {
    _id: string; confirmationCode: string; guestName: string; email: string;
    date: string; timeSlot: string; guestCount: number; status: string;
    specialRequests: string; table: { tableNumber: number; location: string };
}
type Mode = 'email' | 'code';

export default function MyReservationsPage() {
    const { toasts, addToast, removeToast } = useToast();
    const [mode, setMode] = useState<Mode>('email');
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [searched, setSearched] = useState(false);
    const [cancelId, setCancelId] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!value.trim()) return;
        setLoading(true);
        setSearched(false);
        try {
            const data = await api.getReservations(
                mode === 'email' ? value : undefined,
                mode === 'code' ? value : undefined
            );
            setReservations(data.reservations || []);
            setSearched(true);
        } catch (err: any) {
            addToast('error', 'Search Failed', err.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmCancel = async () => {
        if (!cancelId) return;
        try {
            await api.cancelReservation(cancelId);
            setReservations(prev => prev.map(r => r._id === cancelId ? { ...r, status: 'cancelled' } : r));
            addToast('success', 'Booking Cancelled');
            setCancelId(null);
        } catch (err: any) {
            addToast('error', 'Cancellation Failed', err.message);
        }
    };

    return (
        <div className="min-h-screen bg-bg text-white pb-32">
            <Navbar />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <main className="max-w-4xl mx-auto px-6 pt-20">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl font-bold mb-4">Manage <span className="text-gold">Reservations</span></h1>
                    <p className="text-gray-400">View, modify, or cancel your upcoming dining experiences</p>
                </div>

                {/* Search Control */}
                <div className="bg-card border border-white/5 rounded-3xl p-8 shadow-2xl mb-12">
                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8 w-fit mx-auto">
                        <button onClick={() => setMode('email')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'email' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-400'}`}>
                            <Mail size={14} className="inline mr-2" /> Email Address
                        </button>
                        <button onClick={() => setMode('code')} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'code' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-400'}`}>
                            <Key size={14} className="inline mr-2" /> Confirmation Code
                        </button>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" />
                        <input
                            type={mode === 'email' ? 'email' : 'text'}
                            placeholder={mode === 'email' ? 'Enter your email account...' : 'Enter RB-XXXX code...'}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-16 pr-44 text-lg focus:border-gold outline-none transition-all"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading || !value.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-8 btn-gold disabled:opacity-50"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Reservation List */}
                <div className="space-y-6">
                    {searched && reservations.length === 0 && (
                        <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/10">
                            <X className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No active reservations found for this search.</p>
                        </div>
                    )}

                    {reservations.map(res => (
                        <div key={res._id} className="relative bg-card border border-white/5 rounded-3xl p-8 hover:border-gold/30 transition-all group overflow-hidden">
                            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${res.status === 'confirmed' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                                }`}>
                                {res.status}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-1 border-r border-white/5 pr-4">
                                    <p className="font-serif text-2xl font-bold mb-1">{res.timeSlot}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{new Date(res.date).toLocaleDateString()}</p>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <InfoItem icon={Users} label="Party Size" value={`${res.guestCount} People`} />
                                    <InfoItem icon={MapPin} label="Table Info" value={`#${res.table?.tableNumber} (${res.table?.location})`} />
                                    <InfoItem icon={Hash} label="Reference" value={res.confirmationCode} />
                                </div>

                                <div className="md:col-span-1 flex items-center justify-end gap-3">
                                    {res.status === 'confirmed' && (
                                        <button
                                            onClick={() => setCancelId(res._id)}
                                            className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Cancel Confirmation */}
            {cancelId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border border-red-500/30 rounded-[2.5rem] p-12 max-w-sm w-full text-center shadow-2xl">
                        <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
                        <h3 className="font-serif text-2xl font-bold mb-4 text-white">Cancel Booking?</h3>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">This will release the table immediately. This action cannot be undone.</p>
                        <div className="space-y-3">
                            <button onClick={confirmCancel} className="w-full h-14 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all">Yep, Release Table</button>
                            <button onClick={() => setCancelId(null)} className="w-full h-14 bg-white/5 text-gray-400 font-bold rounded-2xl hover:bg-white/10 transition-all">Nevermind</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: any) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                <Icon size={10} /> {label}
            </div>
            <p className="text-sm font-bold text-gray-200">{value}</p>
        </div>
    );
}
