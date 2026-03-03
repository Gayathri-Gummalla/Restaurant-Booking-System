'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ToastContainer, useToast } from '@/components/Toast';

export default function AdminLoginPage() {
    const { toasts, addToast, removeToast } = useToast();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('adminToken')) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.login(email, password);
            localStorage.setItem('adminToken', res.token);
            localStorage.setItem('adminUser', JSON.stringify(res.admin));
            addToast('success', 'Welcome back!');
            router.push('/admin/dashboard');
        } catch (err: any) {
            addToast('error', 'Login Failed', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="card fade-up" style={{ width: '100%', maxWidth: 400, padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
                    <h1 className="font-serif" style={{ fontSize: '1.8rem' }}>Admin Access</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Management Portal</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            id="admin-email"
                            type="email"
                            placeholder="admin@restaurant.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button id="btn-admin-login" className="btn btn-gold" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                        {loading ? <span className="spinner" /> : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="/" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textDecoration: 'none' }}>← Back to Website</a>
                </div>
            </div>
        </div>
    );
}
