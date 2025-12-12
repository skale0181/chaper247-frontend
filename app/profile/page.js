'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import GlobalHeader from '@/components/GlobalHeader';
import { usePopup } from '@/components/PopupMessage';

const ProfilePage = () => {
    const { user } = useAuth();
    const { showSuccess } = usePopup();
    const [staySignedIn, setStaySignedIn] = useState(false);

    // Initialize state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('staySignedIn') === 'true';
            setStaySignedIn(storedValue);
        }
    }, []);

    const handleStaySignedInChange = (e) => {
        const newValue = e.target.checked;
        setStaySignedIn(newValue);
        localStorage.setItem('staySignedIn', String(newValue));

        if (newValue) {
            showSuccess('You will stay signed in on this device.');
        } else {
            showSuccess('You will be logged out after 10 minutes of inactivity.');
        }
    };

    if (!user) {
        return (
            <div>
                <div>Loading profile...</div>
            </div>
        );
    }

    return (
        <>
            <GlobalHeader />
            <div style={styles.container}>
                <div style={styles.contentWrapper}>
                    <h1 style={styles.pageTitle}>My Profile</h1>

                    <div style={styles.grid}>
                        {/* Profile Card */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.cardTitle}>User Information</h2>
                            </div>
                            <div style={styles.profileSection}>
                                <div style={styles.imageContainer}>
                                    <img
                                        src={user.image}
                                        alt={user.username}
                                        style={styles.profileImage}
                                    />
                                    <div style={styles.roleTag}>User</div>
                                </div>

                                <div style={styles.infoGrid}>
                                    <div style={styles.infoItem}>
                                        <span style={styles.label}>Full Name</span>
                                        <span style={styles.value}>{user.firstName} {user.lastName}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <span style={styles.label}>Username</span>
                                        <span style={styles.value}>@{user.username}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <span style={styles.label}>Email</span>
                                        <span style={styles.value}>{user.email}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <span style={styles.label}>User ID</span>
                                        <span style={styles.value}>#{user.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Card */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.cardTitle}>Settings</h2>
                            </div>
                            <div style={styles.settingsSection}>
                                <div style={styles.settingItem}>
                                    <div>
                                        <div style={styles.settingLabel}>Stay Signed In</div>
                                        <div style={styles.settingDescription}>
                                            Disable automatic logout due to inactivity on this device.
                                        </div>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={staySignedIn}
                                            onChange={handleStaySignedInChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SwitchStyle />
        </>
    );
};

const styles = {
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f4f6f8',
    },
    loadingText: {
        fontSize: '18px',
        color: '#666',
        fontWeight: '500',
    },
    container: {
        minHeight: 'calc(100vh - 64px)', // Adjust for header height
        padding: '40px 20px',
        background: '#f4f6f8',
    },
    contentWrapper: {
        maxWidth: '1000px',
        margin: '0 auto',
    },
    pageTitle: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1f36',
        marginBottom: '30px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        height: 'fit-content',
    },
    cardHeader: {
        padding: '20px 24px',
        borderBottom: '1px solid #e1e8ed',
        backgroundColor: '#ffffff',
    },
    cardTitle: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1f36',
    },
    profileSection: {
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: '30px',
    },
    profileImage: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '4px solid #fff',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
    },
    roleTag: {
        position: 'absolute',
        bottom: '0',
        right: '0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 10px',
        borderRadius: '20px',
        border: '2px solid #fff',
    },
    infoGrid: {
        width: '100%',
        display: 'grid',
        gap: '20px',
    },
    infoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: '1px solid #f0f2f5',
    },
    label: {
        fontSize: '14px',
        color: '#697386',
        fontWeight: '500',
    },
    value: {
        fontSize: '15px',
        color: '#1a1f36',
        fontWeight: '500',
    },
    settingsSection: {
        padding: '24px',
    },
    settingItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
    },
    settingLabel: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '4px',
    },
    settingDescription: {
        fontSize: '13px',
        color: '#666',
        maxWidth: '250px',
        lineHeight: '1.4',
    },
    // Switch Toggle Styles
    switch: {
        position: 'relative',
        display: 'inline-block',
        width: '50px',
        height: '26px',
    },
    slider: {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#e1e8ed',
        transition: '.4s',
        borderRadius: '34px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        '::before': { // Note: pseudo-elements can't be styled inline easily in React, wait...
            // React inline styles don't support pseudo-elements directly.
            // I'll simulate the slider logic with CSS classes in a style tag or just handle it simply.
            // Actually, for single file without CSS modules, I'll add a <style> tag in the render.
        }
    }
};

// Since we cannot use pseudo-elements in inline styles easily, 
// I'll add a specialized Switch component with internal styled-jsx or standard CSS classes
// But for simplicity in this file replacement, I'll inject a small style tag.

export default ProfilePage;

// Injecting styles for the toggle switch
function SwitchStyle() {
    return (
        <style jsx global>{`
            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
            }
            .switch input { 
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
                border-radius: 34px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
            input:checked + .slider {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
            }
            input:checked + .slider:before {
                -webkit-transform: translateX(24px);
                -ms-transform: translateX(24px);
                transform: translateX(24px);
            }
        `}</style>
    );
}

