'use client';
import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; type: ToastType; title: string; message?: string; }

let addToastGlobal: ((type: ToastType, title: string, msg?: string) => void) | null = null;

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
}

const icons = {
    success: '✓',
    error: '✕',
    info: '●',
};

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: number) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="toast-wrap">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span style={{
                        fontSize: '1rem',
                        color: t.type === 'success' ? 'var(--green)' : t.type === 'error' ? 'var(--red)' : 'var(--gold)',
                        marginTop: 1,
                    }}>
                        {icons[t.type]}
                    </span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.title}</div>
                        {t.message && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>{t.message}</div>}
                    </div>
                    <button
                        onClick={() => removeToast(t.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1rem', padding: '0 2px' }}
                    >×</button>
                </div>
            ))}
        </div>
    );
}
