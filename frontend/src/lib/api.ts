const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined'
        ? (localStorage.getItem('token') || localStorage.getItem('adminToken'))
        : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data as T;
}

export const api = {
    // Availability
    getSlots: (date: string, guestCount?: number) =>
        request<any>(`/availability/slots?date=${date}${guestCount ? `&guestCount=${guestCount}` : ''}`),
    getAvailability: (date: string, timeSlot: string, guestCount?: number) =>
        request<any>(`/availability?date=${date}&timeSlot=${timeSlot}${guestCount ? `&guestCount=${guestCount}` : ''}`),

    // Reservations
    createReservation: (body: any) =>
        request<any>('/reservations', { method: 'POST', body: JSON.stringify(body) }),
    getReservations: (email?: string, confirmationCode?: string) =>
        request<any>(`/reservations?${email ? `email=${email}` : ''}${confirmationCode ? `confirmationCode=${confirmationCode}` : ''}`),
    getReservation: (id: string) =>
        request<any>(`/reservations/${id}`),
    updateReservation: (id: string, body: any) =>
        request<any>(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    cancelReservation: (id: string) =>
        request<any>(`/reservations/${id}`, { method: 'DELETE' }),

    // Tables
    getTables: () => request<any>('/tables'),

    // Auth
    login: (email: string, password: string) =>
        request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name: string, email: string, password: string) =>
        request<any>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    getMe: () => request<any>('/auth/me'),

    // Admin
    getDashboard: () => request<any>('/admin/dashboard'),
    getAdminReservations: (params?: Record<string, string>) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : '';
        return request<any>(`/admin/reservations${qs}`);
    },
    updateStatus: (id: string, status: string) =>
        request<any>(`/admin/reservations/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }),
    getOccupancy: (startDate: string, endDate: string) =>
        request<any>(`/admin/occupancy?startDate=${startDate}&endDate=${endDate}`),
    request,
};
