'use client';

import { useAuth } from '@/components/AuthProvider';
import GlobalHeader from '@/components/GlobalHeader';

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div style={{ padding: '2rem' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <GlobalHeader />
            <div style={{ padding: '2rem' }}>
                <h1>Profile</h1>

                <div style={{
                    maxWidth: '600px',
                    marginTop: '2rem',
                    backgroundColor: '#f8f9fa',
                    padding: '2rem',
                    borderRadius: '8px'
                }}>
                    <h2>User Information</h2>

                    <div style={{ marginTop: '1rem' }}>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>User ID:</strong> {user.id}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
