'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GlobalHeader = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    if (!user) return null;

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
                    Todo App
                </h2>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    Welcome, {user.firstName || user.username || 'User'}!
                </span>
            </div>

            <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link
                    href="/tasks"
                    style={{
                        textDecoration: 'none',
                        color: '#007bff',
                        fontWeight: '500'
                    }}
                >
                    Tasks
                </Link>
                <Link
                    href="/profile"
                    style={{
                        textDecoration: 'none',
                        color: '#007bff',
                        fontWeight: '500'
                    }}
                >
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default GlobalHeader;
