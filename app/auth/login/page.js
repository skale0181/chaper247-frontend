'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { request } from "@/lib/api";
import { API_ROUTES } from "@/configue/routes";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();  // updates global auth state

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await request.post(API_ROUTES.AUTH.LOGIN, form);
            console.log(res);
            if (res.status === 200) {
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
                router.push("/tasks");
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Login</h1>

                <form onSubmit={onSubmit} style={styles.form}>
                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={onChange}
                        required
                        style={styles.input}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={onChange}
                        required
                        style={styles.input}
                    />

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.demoCredentials}>
                    <p style={styles.demoTitle}>Demo Credentials:</p>
                    <p style={styles.demoText}>Username: emilys</p>
                    <p style={styles.demoText}>Password: emilyspass</p>
                </div>

                <div style={styles.signupSection}>
                    <p style={styles.signupText}>
                        Don't have an account?{" "}
                        <Link href="/auth/signup" style={styles.signupLink}>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// CSS styles object
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
        marginBottom: "30px",
        marginTop: "0",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginBottom: "20px",
    },
    input: {
        padding: "14px 16px",
        fontSize: "15px",
        border: "2px solid #e1e8ed",
        borderRadius: "8px",
        outline: "none",
        transition: "border-color 0.3s ease",
        fontFamily: "inherit",
    },
    button: {
        padding: "14px 16px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#ffffff",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "transform 0.2s ease, opacity 0.3s ease",
        marginTop: "8px",
    },
    error: {
        color: "#e74c3c",
        fontSize: "14px",
        marginTop: "10px",
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#ffe6e6",
        borderRadius: "6px",
    },
    demoCredentials: {
        marginTop: "25px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
    },
    demoTitle: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#495057",
        marginBottom: "8px",
        marginTop: "0",
    },
    demoText: {
        fontSize: "13px",
        color: "#6c757d",
        margin: "4px 0",
    },
    signupSection: {
        marginTop: "25px",
        paddingTop: "20px",
        borderTop: "1px solid #e9ecef",
    },
    signupText: {
        fontSize: "14px",
        color: "#666",
        margin: "0",
    },
    signupLink: {
        color: "#667eea",
        textDecoration: "none",
        fontWeight: "600",
        transition: "color 0.3s ease",
    },
};
