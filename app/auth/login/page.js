'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { request } from "@/lib/api";

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
            const res = await request.post('/auth/login', form);

            console.log(res);

            if (res?.data?.user) {
                setUser(res.data.user);    // store user in global context
                router.push("/tasks");
            } else {
                setError("Login failed. No user returned.");
            }
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || "Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: 350, margin: "80px auto", textAlign: "center" }}>
            <h1>Login</h1>

            <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={onChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={onChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

            <div>
                {/* dummy credentials */}
                <p>Username: emilys</p>
                <p>Password: emilyspass</p>
            </div>
        </div>
    );
}
