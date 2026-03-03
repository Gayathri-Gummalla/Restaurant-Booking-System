'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';

export default function AuthPage() {
    const router = useRouter();
    const { toasts, addToast, removeToast } = useToast();
    const [isLogin, setIsLogin] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Redirect if already logged in
        if (localStorage.getItem('token')) {
            router.push('/');
        }
    }, [router]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = { name: '', email: '', password: '', confirmPassword: '' };
        let isValid = true;

        if (!isLogin && !formData.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            let res;
            if (isLogin) {
                res = await api.login(formData.email, formData.password);
                addToast('success', 'Welcome back to Spice Garden!');
            } else {
                res = await api.register(formData.name, formData.email, formData.password);
                addToast('success', 'Account created! Welcome to the Royal Family.');
            }

            // Save token and user data
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));

            // Redirect based on role or to home
            if (res.user.role === 'admin') {
                localStorage.setItem('adminToken', res.token);
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            addToast('error', isLogin ? 'Sign In Failed' : 'Registration Failed', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            {/* Full HD Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920"
                    alt="Luxury Restaurant Interior"
                    className="w-full h-full object-cover"
                />
                {/* 60% Dark Overlay and Blur */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            </div>

            {/* Back to Home Link */}
            <Link
                href="/"
                className="absolute top-10 left-10 z-20 flex items-center gap-2 text-white/70 hover:text-gold transition-all font-medium tracking-wide group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="uppercase text-[10px] tracking-[0.2em] font-bold">Return to Garden</span>
            </Link>

            {/* Authentication Card */}
            <div className={`w-full max-w-md transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} z-10`}>
                <div className="bg-white rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] p-8 md:p-12 relative overflow-hidden group">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">S</span>
                            </div>
                            <span className="font-serif text-lg font-bold text-gray-400 tracking-widest uppercase">Spice Garden</span>
                        </div>
                        <p className="text-[10px] text-gold font-bold uppercase tracking-[0.4em] mb-3">
                            {isLogin ? 'Welcome Back' : 'Experience the Royal Taste'}
                        </p>
                        <h2 className="font-serif text-3xl font-bold text-gray-900 leading-tight">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h2>
                    </div>

                    {/* Login/Signup Toggle */}
                    <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Register
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <UserIcon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-300 group-focus-within:text-gold'}`} size={16} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className={`w-full bg-gray-50 border-2 ${errors.name ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-gold'} focus:bg-white rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300`}
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.name}</p>}
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-300 group-focus-within:text-gold'}`} size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    className={`w-full bg-gray-50 border-2 ${errors.email ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-gold'} focus:bg-white rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300`}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-300 group-focus-within:text-gold'}`} size={16} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className={`w-full bg-gray-50 border-2 ${errors.password ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-gold'} focus:bg-white rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300`}
                                />
                                {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.password}</p>}
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-gray-300 group-focus-within:text-gold'}`} size={16} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className={`w-full bg-gray-50 border-2 ${errors.confirmPassword ? 'border-red-100 focus:border-red-400' : 'border-transparent focus:border-gold'} focus:bg-white rounded-xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-300`}
                                    />
                                    {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gold hover:bg-[#c29744] text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 rounded-xl shadow-xl shadow-gold/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                isLogin ? 'Sign In Now' : 'Create Royal Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-[11px] font-medium">
                            {isLogin ? "New to Spice Garden?" : "Already a member?"}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-gold font-bold hover:text-[#c29744] transition-colors ml-1 uppercase tracking-wider"
                            >
                                {isLogin ? 'Join Us' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Subtle Brand Tagline at Bottom */}
            <div className="absolute bottom-8 left-0 right-0 text-center z-10 pointer-events-none opacity-40">
                <p className="font-serif text-white text-xs tracking-[0.5em] uppercase">Andhra Fine Dining Excellence</p>
            </div>
        </div>
    );
}
