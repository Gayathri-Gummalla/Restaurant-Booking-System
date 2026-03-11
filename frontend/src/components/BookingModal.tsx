'use client';
import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, ChevronRight, CheckCircle2, Layout, User as UserIcon, Phone, Mail, CreditCard, ShieldCheck, QrCode, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';
import { QRCodeSVG } from 'qrcode.react';

interface Table {
    _id: string;
    tableNumber: number;
    capacity: number;
    location: string;
    description: string;
}

interface TimeSlot {
    timeSlot: string;
    available: number;
    total: number;
    isAvailable: boolean;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const { toasts, addToast, removeToast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        timeSlot: '',
        guestCount: 2,
        tableId: '',
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
    });

    // Data State
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [availableTables, setAvailableTables] = useState<Table[]>([]);
    const [allTables, setAllTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [confirmation, setConfirmation] = useState<any>(null);
    const [depositAmount, setDepositAmount] = useState(500);
    const [isTableOversized, setIsTableOversized] = useState(false);
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    // Load available slots when date or guest count changes
    useEffect(() => {
        if (isOpen && step === 1) {
            fetchSlots();
        }
    }, [formData.date, formData.guestCount, isOpen, step]);

    // Load tables when time slot is selected
    useEffect(() => {
        if (formData.timeSlot && step === 2) {
            fetchTables();
        }
    }, [formData.timeSlot, step]);

    // Load all tables for the layout
    useEffect(() => {
        if (isOpen) {
            const fetchAllTables = async () => {
                try {
                    const res = await api.getTables();
                    if (res.success) setAllTables(res.tables);
                } catch (err) {
                    console.error('Failed to load table layout');
                }
            };
            fetchAllTables();
        }
    }, [isOpen]);

    // Pre-fill user data if logged in
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [isOpen]);

    const fetchSlots = async () => {
        try {
            const res = await api.getSlots(formData.date, formData.guestCount);
            if (res.success) {
                setSlots(res.slotAvailability);
            }
        } catch (err) {
            addToast('error', 'Failed to load availability');
        }
    };

    const fetchTables = async () => {
        setLoading(true);
        try {
            const res = await api.getAvailability(formData.date, formData.timeSlot, formData.guestCount);
            if (res.success) {
                setAvailableTables(res.availableTables);
            }
        } catch (err) {
            addToast('error', 'Failed to load tables');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            addToast('error', 'Please fill in all contact details');
            return;
        }

        setLoading(true);
        try {
            const res = await api.createReservation({
                guestName: formData.name,
                email: formData.email,
                phone: formData.phone,
                table: formData.tableId,
                date: formData.date,
                timeSlot: formData.timeSlot,
                guestCount: formData.guestCount,
                specialRequests: formData.specialRequests
            });

            if (res.success) {
                setConfirmation(res.reservation);
                setStep(4); // Move to Payment Step
                addToast('success', 'Details confirmed! Proceed to payment.');
            }
        } catch (err: any) {
            addToast('error', 'Booking failed', err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const isTableAvailable = (id: string) => availableTables.some(t => t._id === id);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-gray-900">Reserve a Table</h2>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-black flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-gold" />
                            Step {step} of 5
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">

                    {/* Step 1: Date & Guests */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                        <Calendar size={12} className="text-gold" />
                                        Select Date
                                    </label>
                                    <input
                                        type="date"
                                        min={today}
                                        max={maxDateStr}
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                        <Users size={12} className="text-gold" />
                                        Number of Guests
                                    </label>
                                    <select
                                        value={formData.guestCount}
                                        onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                                        className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-gold/20 focus:outline-none appearance-none transition-all"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <Clock size={12} className="text-gold" />
                                    Choose Preferred Time Slot
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {slots.length === 0 ? (
                                        <div className="col-span-full py-12 text-center text-gray-400 italic">
                                            No slots available for this date/guest count.
                                        </div>
                                    ) : (
                                        (() => {
                                            const availableSlots = slots.filter(s => s.isAvailable);
                                            return slots.map((slot) => {
                                                const nextAvailable = availableSlots.find((s) => {
                                                    // Find the first available slot that is after this current slot
                                                    const currentIndex = slots.findIndex(orig => orig.timeSlot === slot.timeSlot);
                                                    const slotIndex = slots.findIndex(orig => orig.timeSlot === s.timeSlot);
                                                    return slotIndex > currentIndex;
                                                });

                                                return (
                                                    <div key={slot.timeSlot} className="relative group">
                                                        <button
                                                            disabled={!slot.isAvailable}
                                                            onClick={() => setFormData({ ...formData, timeSlot: slot.timeSlot })}
                                                            className={`w-full h-14 rounded-xl flex flex-col items-center justify-center transition-all border relative overflow-hidden ${formData.timeSlot === slot.timeSlot
                                                                ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                                                                : slot.isAvailable
                                                                    ? 'bg-white border-gray-100 text-gray-900 hover:border-gold hover:text-gold'
                                                                    : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <span className={`text-sm font-black ${!slot.isAvailable && 'opacity-50'}`}>{slot.timeSlot}</span>
                                                            {!slot.isAvailable ? (
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-red-500 mt-1">Filled</span>
                                                            ) : slot.available <= 2 ? (
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-orange-500 mt-1">
                                                                    Only {slot.available} Left
                                                                </span>
                                                            ) : null}
                                                        </button>

                                                        {/* Tooltip for next available slot */}
                                                        {!slot.isAvailable && nextAvailable && (
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                                                Next Available: {nextAvailable.timeSlot}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            });
                                        })()
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={!formData.timeSlot}
                                onClick={() => setStep(2)}
                                className="w-full h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-all duration-300 group disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 shadow-xl"
                            >
                                Choose Your Table
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Table Selection */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Layout size={16} className="text-gold" />
                                    Layout View & Table Selection
                                </h3>
                                <div className="flex items-center gap-4 text-[9px] uppercase font-black tracking-widest text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> Open
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Booked
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gold" /> Selected
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {allTables.map((table) => {
                                        const available = isTableAvailable(table._id);
                                        const isSelected = formData.tableId === table._id;

                                        return (
                                            <button
                                                key={table._id}
                                                disabled={!available}
                                                onClick={() => {
                                                    setFormData({ ...formData, tableId: table._id });
                                                    setSelectedTable(table);
                                                    if (table.capacity > formData.guestCount) {
                                                        setIsTableOversized(true);
                                                        setDepositAmount(800);
                                                    } else {
                                                        setIsTableOversized(false);
                                                        setDepositAmount(500);
                                                    }
                                                }}
                                                className={`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all border-2 relative ${isSelected
                                                    ? 'bg-gold border-gold text-white shadow-xl shadow-gold/30 -translate-y-1'
                                                    : available
                                                        ? 'bg-white border-white text-gray-900 hover:border-green-500/50 hover:shadow-lg'
                                                        : 'bg-white/50 border-transparent text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                {!isSelected && (
                                                    <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`} />
                                                )}
                                                <div className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                                                    Table
                                                </div>
                                                <div className="text-3xl font-serif font-black">{table.tableNumber}</div>
                                                <div className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/5 flex items-center gap-1">
                                                    <Users size={10} /> {table.capacity}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {isTableOversized && (
                                <div className="p-6 bg-gold/5 border border-gold/20 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-500">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Large Table Selection</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            You've selected a table for {selectedTable?.capacity} guests. Since you have only {formData.guestCount} guests, a ₹300 premium space surcharge will be added to the booking deposit.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="h-16 flex-1 border border-gray-100 text-gray-500 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    disabled={!formData.tableId}
                                    onClick={() => setStep(3)}
                                    className="h-16 flex-[2] bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-all duration-300 disabled:opacity-50 shadow-xl"
                                >
                                    Confirm Details
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact Details */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-left">
                            <div className="bg-gold/5 border border-gold/10 p-6 rounded-3xl flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Your Selection</p>
                                    <p className="font-serif text-lg font-bold text-gray-900">
                                        Table {selectedTable?.tableNumber} • {formData.date} • {formData.timeSlot}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Guests</p>
                                    <p className="font-bold text-gray-900">{formData.guestCount} People</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                        <UserIcon size={12} className="text-gold" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                            <Mail size={12} className="text-gold" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                            <Phone size={12} className="text-gold" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="Your contact number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Special Requests (Optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Any dietary preferences, celebrations, or table location requests?"
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        className="w-full p-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 font-medium focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="h-16 flex-1 border border-gray-100 text-gray-500 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    disabled={loading}
                                    onClick={handleConfirmBooking}
                                    className="h-16 flex-[2] bg-gold text-white rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-all duration-300 shadow-xl shadow-gold/20"
                                >
                                    {loading ? 'Processing...' : 'Review & Pay'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-left">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 text-gold">
                                    <CreditCard size={32} />
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-gray-900">Secure Payment</h3>
                                <p className="text-gray-500 text-sm">Complete your reservation with a small booking deposit</p>
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                    <span className="text-gray-500 font-medium">Standard Booking Deposit</span>
                                    <span className="text-xl font-bold text-gray-900">₹500.00</span>
                                </div>
                                {isTableOversized && (
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 text-gold animate-in fade-in">
                                        <span className="font-bold">Large Table Surcharge</span>
                                        <span className="text-xl font-black">+ ₹300.00</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-gray-900 font-bold">Total to Pay Now</span>
                                    <span className="text-2xl font-serif font-black text-gold">₹{depositAmount}.00</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={async () => {
                                        if (!confirmation?._id) return;
                                        setLoading(true);
                                        // Simulate payment delay
                                        await new Promise(resolve => setTimeout(resolve, 2000));

                                        try {
                                            const res = await api.updateReservation(confirmation._id, {
                                                paymentStatus: 'paid',
                                                paymentId: 'SIM-' + Math.random().toString(36).substring(2, 10).toUpperCase()
                                            });

                                            if (res.success) {
                                                setConfirmation(res.reservation);
                                                setStep(5);
                                                addToast('success', 'Payment successful! Booking confirmed.');
                                            }
                                        } catch (err: any) {
                                            addToast('error', 'Payment update failed', err.message);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="w-full h-16 bg-black text-white rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-all duration-300 shadow-xl"
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                                        <>
                                            <ShieldCheck size={18} />
                                            Pay Securely Now
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                                    Protected by 256-bit SSL Encryption
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Confirmation */}
                    {step === 5 && confirmation && (
                        <div className="py-8 flex flex-col items-center text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl shadow-green-200">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="font-serif text-3xl font-black text-gray-900 mb-2">Booking Confirmed!</h3>
                            <p className="text-gray-500 text-sm mb-8">Show this QR code at the restaurant entrance.</p>

                            <div className="w-full bg-gray-50 rounded-[2.5rem] p-8 space-y-6 text-left border border-gray-100 relative overflow-hidden">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex-shrink-0">
                                        <QRCodeSVG
                                            value={JSON.stringify({
                                                id: confirmation._id,
                                                code: confirmation.confirmationCode,
                                                name: confirmation.guestName,
                                                email: confirmation.email,
                                                phone: confirmation.phone,
                                                date: confirmation.date,
                                                time: confirmation.timeSlot,
                                                guests: confirmation.guestCount,
                                                table: confirmation.table?.tableNumber || '',
                                                payment: confirmation.paymentStatus,
                                                paymentId: confirmation.paymentId || '',
                                                specialRequests: confirmation.specialRequests || '',
                                                status: confirmation.status
                                            })}
                                            size={160}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 relative z-10 flex-1">
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Confirmation Code</p>
                                            <p className="font-mono text-lg font-black text-gold tracking-wider">{confirmation.confirmationCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Guests</p>
                                            <p className="font-serif text-base font-bold text-gray-900">{confirmation.guestCount} People</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Table</p>
                                            <p className="font-serif text-base font-bold text-gray-900">#{selectedTable?.tableNumber}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Date & Time</p>
                                            <p className="font-serif text-base font-bold text-gray-900">
                                                {new Date(confirmation.date).toLocaleDateString()} at {confirmation.timeSlot}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-12 w-full h-16 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-all duration-300 shadow-xl"
                            >
                                Back to Menu
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
