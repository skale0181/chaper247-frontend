'use client';

import Link from 'next/link';

export default function SignupPage() {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Not Implemented</h1>
                <Link href="/auth/login" style={styles.button}>
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        padding: "40px 30px",
        textAlign: "center",
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#333",
        marginBottom: "16px",
        marginTop: 0,
    },
    button: {
        display: "inline-block",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#ffffff",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "8px",
        textDecoration: "none",
        transition: "transform 0.2s ease, opacity 0.3s ease",
        cursor: "pointer",
    }
};
