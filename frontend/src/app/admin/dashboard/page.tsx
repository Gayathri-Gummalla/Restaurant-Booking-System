'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { ToastContainer, useToast } from '@/components/Toast';
import { BarChart3, Users, Calendar, Table as TableIcon, LogOut, RefreshCw, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { toasts, addToast, removeToast } = useToast();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [upcoming, setUpcoming] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        try {
            const [dashData, analyticsData] = await Promise.all([
                api.getDashboard(),
                api.request<any>('/admin/analytics')
            ]);
            setStats(dashData.stats);
            setUpcoming(dashData.upcomingReservations);
            setAnalytics(analyticsData.analytics);
        } catch (err: any) {
            if (err.message.toLowerCase().includes('authorized')) {
                localStorage.removeItem('adminToken');
                router.push('/admin');
            }
            addToast('error', 'Failed to load panel', err.message);
        } finally {
            setLoading(false);
        }
    }, [router, addToast]);

    useEffect(() => {
        if (!localStorage.getItem('adminToken')) {
            router.push('/admin');
            return;
        }
        fetchAllData();

        const socket = getSocket();
        socket.emit('join_admin');
        socket.on('new_reservation', () => {
            addToast('info', 'New Request Received');
            fetchAllData();
        });
        socket.on('reservation_updated', () => fetchAllData());

        return () => {
            socket.off('new_reservation');
            socket.off('reservation_updated');
        };
    }, [fetchAllData, router, addToast]);

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin');
    };

    if (loading) return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
            <RefreshCw className="w-10 h-10 text-gold animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-bg text-white flex">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Sidebar */}
            <aside className="w-72 bg-card border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                        <BarChart3 className="text-black w-6 h-6" />
                    </div>
                    <span className="font-serif text-xl font-bold tracking-tight">Admin<span className="text-gold">Panel</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink href="/admin/dashboard" icon={BarChart3} label="Insights" active />
                    <SidebarLink href="/admin/reservations" icon={Calendar} label="Reservations" />
                    <SidebarLink href="/admin/tables" icon={TableIcon} label="Floor Map" />
                </nav>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="font-serif text-4xl font-bold mb-2">Internal Insights</h1>
                        <p className="text-gray-500 font-medium">Monitoring real-time business health</p>
                    </div>
                    <button
                        onClick={fetchAllData}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-gold/10 hover:border-gold/30 transition-all text-gold"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <InsightCard icon={TrendingUp} label="Daily Bookings" value={analytics?.analytics?.statusStats?.today?.[0]?.count || 0} trend="+12% from avg" />
                    <InsightCard icon={Users} label="Occupancy Rate" value={`${analytics?.occupancyRate}%`} trend={`${analytics?.bookedToday} tables filled`} />
                    <InsightCard icon={AlertCircle} label="Cancellation Rate" value={`${Math.round(analytics?.statusStats?.cancellationRate?.[0]?.rate || 0)}%`} trend="Lifetime avg" />
                    <InsightCard icon={BarChart3} label="Peak Activity" value={analytics?.peakSlots?.[0]?._id} trend={`${analytics?.peakSlots?.[0]?.count} bookings`} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="font-serif text-2xl font-bold flex items-center gap-3">
                            <Clock className="text-gold" /> Immediate Arrivals
                        </h2>
                        <div className="bg-card border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/2">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Guest</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Time</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Party</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Table</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/2">
                                    {upcoming.map(res => (
                                        <tr key={res._id} className="hover:bg-white/2 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-sm">{res.guestName}</p>
                                                <p className="text-[10px] text-gold font-mono uppercase tracking-tighter">{res.confirmationCode}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium">{res.timeSlot}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400 font-bold">{res.guestCount}</td>
                                            <td className="px-6 py-4 text-sm font-medium">#{res.table?.tableNumber}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${res.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    }`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Peak Times & Stats */}
                    <div className="space-y-8">
                        <h2 className="font-serif text-2xl font-bold">Popular Slots</h2>
                        <div className="bg-card border border-white/5 rounded-3xl p-8 space-y-6">
                            {analytics?.peakSlots?.map((slot: any) => (
                                <div key={slot._id} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span>{slot._id}</span>
                                        <span className="text-gold">{slot.count} Bookings</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full"
                                            style={{ width: `${(slot.count / (analytics.peakSlots[0].count || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, icon: Icon, label, active = false }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                    ? 'bg-gold text-black font-bold shadow-lg shadow-gold/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
                }`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );
}

function InsightCard({ icon: Icon, label, value, trend }: any) {
    return (
        <div className="bg-card border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Icon className="text-gold" size={20} />
            </div>
            <div>
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.25em] mb-1">{label}</h4>
                <p className="text-3xl font-serif font-bold text-white">{value}</p>
            </div>
            <p className="text-[10px] font-bold text-gold uppercase tracking-widest">{trend}</p>
        </div>
    );
}
