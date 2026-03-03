'use client';
import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, ChevronRight, CheckCircle2, Layout, User as UserIcon, Phone, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';

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
                setStep(4);
                addToast('success', 'Table booked successfully!');
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
                            Step {step} of 4
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
                                            Loading available slots...
                                        </div>
                                    ) : (
                                        slots.map((slot) => (
                                            <button
                                                key={slot.timeSlot}
                                                disabled={!slot.isAvailable}
                                                onClick={() => setFormData({ ...formData, timeSlot: slot.timeSlot })}
                                                className={`h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all border ${formData.timeSlot === slot.timeSlot
                                                    ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                                                    : slot.isAvailable
                                                        ? 'bg-white border-gray-100 text-gray-900 hover:border-gold hover:text-gold'
                                                        : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                                                    }`}
                                            >
                                                {slot.timeSlot}
                                            </button>
                                        ))
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
                                    {loading ? 'Processing...' : 'Complete Booking'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && confirmation && (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-green-200">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="font-serif text-4xl font-black text-gray-900 mb-2">Booking Confirmed!</h3>
                            <p className="text-gray-500 font-light mb-12">Your table is reserved. We look forward to serving you.</p>

                            <div className="w-full bg-gray-50 rounded-[2.5rem] p-10 space-y-8 text-left border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />

                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Confirmation Code</p>
                                        <p className="font-mono text-lg font-black text-gold tracking-wider">{confirmation.confirmationCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Guests</p>
                                        <p className="font-serif text-lg font-bold text-gray-900">{confirmation.guestCount} People</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Date & Time</p>
                                        <p className="font-serif text-lg font-bold text-gray-900">
                                            {new Date(confirmation.date).toLocaleDateString()} at {confirmation.timeSlot}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Location</p>
                                        <p className="font-serif text-lg font-bold text-gray-900">Table {selectedTable?.tableNumber}</p>
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
