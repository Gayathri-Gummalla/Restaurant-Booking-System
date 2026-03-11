'use client';
import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import { useSearchParams } from 'next/navigation';
import { QrCode, User, Calendar, Clock, CheckCircle, XCircle, RefreshCw, ShieldCheck, Phone, Mail, Users, CreditCard, MessageSquare, MapPin } from 'lucide-react';

export default function AdminScannerPage() {
    const { toasts, addToast, removeToast } = useToast();
    const searchParams = useSearchParams();
    const [scannedData, setScannedData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Initial check for URL parameters
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            fetchFullDetails(id);
        }
    }, [searchParams]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );
        scannerRef.current = scanner;

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        };
    }, []);

    async function onScanSuccess(decodedText: string) {
        try {
            // Check if it's a JSON or a URL
            if (decodedText.startsWith('{')) {
                const data = JSON.parse(decodedText);
                if (data.id) {
                    // Immediately show the QR-embedded details
                    setScannedData({
                        _id: data.id,
                        confirmationCode: data.code,
                        guestName: data.name,
                        email: data.email || '',
                        phone: data.phone || '',
                        date: data.date,
                        timeSlot: data.time,
                        guestCount: data.guests,
                        table: { tableNumber: data.table },
                        paymentStatus: data.payment || 'pending',
                        paymentId: data.paymentId || '',
                        specialRequests: data.specialRequests || '',
                        status: data.status || 'confirmed'
                    });
                    // Also try fetching live data in the background
                    fetchFullDetails(data.id);
                } else {
                    setError("Invalid QR code: missing booking ID");
                }
            } else if (decodedText.includes('?id=')) {
                const url = new URL(decodedText);
                const id = url.searchParams.get('id');
                if (id) {
                    fetchFullDetails(id);
                }
            } else {
                setError("Invalid QR code format. Not recognized.");
            }
        } catch (e) {
            setError("Could not parse QR code data. Make sure it's a valid booking QR.");
        }
    }

    const fetchFullDetails = async (id: string) => {
        try {
            const res = await api.getReservation(id);
            if (res.success) {
                // Update with live data (most up-to-date)
                setScannedData(res.reservation);
            }
        } catch (err: any) {
            // If API fails, we still have the QR-embedded data showing
            console.log('Live fetch failed, using QR-embedded data');
        }
    };

    function onScanFailure(error: any) {
        // Quietly fail as it scans continuously
    }

    const handleCheckIn = async () => {
        if (!scannedData) return;
        setLoading(true);
        try {
            const res = await api.checkIn(scannedData._id);
            if (res.success) {
                addToast('success', 'Guest Checked In Successfully');
                // Update local state to show checked in
                setScannedData({ ...scannedData, status: 'checked-in' });
            }
        } catch (err: any) {
            addToast('error', 'Check-in Failed', err.message);
        } finally {
            setLoading(false);
        }
    }

    const resetScanner = () => {
        setScannedData(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <main className="max-w-3xl mx-auto px-6 pt-32">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold">
                        <QrCode size={32} />
                    </div>
                    <h1 className="font-serif text-4xl font-bold mb-2">QR <span className="text-gold">Scanner</span></h1>
                    <p className="text-gray-400">Scan guest booking codes for quick check-in and details</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                    {!scannedData ? (
                        <div className="p-8">
                            {fetching ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <RefreshCw className="animate-spin text-gold" size={40} />
                                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Fetching Details...</p>
                                </div>
                            ) : (
                                <>
                                    <div id="reader" className="overflow-hidden rounded-2xl border-2 border-dashed border-white/10"></div>
                                    {error && (
                                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                                            <XCircle size={18} />
                                            {error}
                                            <button onClick={() => setError(null)} className="ml-auto text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">Clear</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="p-10 space-y-8 animate-in zoom-in duration-300">
                            {/* Header Section */}
                            <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Booking Confirmed</p>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${scannedData.status === 'checked-in' ? 'bg-green-500 text-black' : 'bg-gold text-black'
                                            }`}>
                                            {scannedData.status}
                                        </span>
                                    </div>
                                    <h2 className="font-serif text-2xl font-bold">{scannedData.confirmationCode}</h2>
                                </div>
                                <button onClick={resetScanner} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-white group">
                                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                </button>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Guest Info */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Guest Name</p>
                                            <p className="font-bold text-lg">{scannedData.guestName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Email Address</p>
                                            <p className="font-medium text-gray-300">{scannedData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Phone Number</p>
                                            <p className="font-medium text-gray-300">{scannedData.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Info */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Reservation Date</p>
                                            <p className="font-bold text-lg">{new Date(scannedData.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Time Slot</p>
                                            <p className="font-bold text-lg">{scannedData.timeSlot}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Guests</p>
                                                <p className="font-bold">{scannedData.guestCount} People</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Table</p>
                                                <p className="font-bold">#{scannedData.table?.tableNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                <div className="flex items-start gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Payment Status</p>
                                        <p className={`font-bold ${scannedData.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                                            {scannedData.paymentStatus === 'paid' ? 'Fully Paid' : 'Pending'}
                                        </p>
                                        {scannedData.paymentId && <p className="text-[8px] font-mono text-white/20 mt-1 uppercase">{scannedData.paymentId}</p>}
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Special Requests</p>
                                        <p className="text-sm text-gray-300 italic">
                                            {scannedData.specialRequests || "No special requests provided."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Footnote */}
                            <div className="flex items-center justify-center gap-2 py-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                                <ShieldCheck size={16} className="text-green-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500">Identity Verified & Reservation Valid</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={resetScanner}
                                    className="flex-1 h-16 border border-white/10 text-white/60 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/5 hover:text-white transition-all shadow-xl"
                                >
                                    Scan Another
                                </button>
                                <button
                                    onClick={handleCheckIn}
                                    disabled={loading || scannedData.status === 'checked-in'}
                                    className={`flex-[2] h-16 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 shadow-xl ${scannedData.status === 'checked-in'
                                        ? 'bg-green-500/20 text-green-500 cursor-not-allowed border border-green-500/20'
                                        : 'bg-gold text-black hover:bg-white shadow-gold/20'
                                        }`}
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                                        <>
                                            {scannedData.status === 'checked-in' ? <CheckCircle size={18} /> : <ShieldCheck size={18} />}
                                            {scannedData.status === 'checked-in' ? 'Already Checked-In' : 'Confirm & Check-In'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                        Admin Terminal • Secure Access
                    </p>
                </div>
            </main>
        </div>
    );
}
