'use client';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div>
        <h1>Welcome to the task manager app </h1><br />
        <p>Proceed with login to access the feature </p><br />
        {/* show login button to redirect */}
        <button onClick={() => { router.push('/auth/login') }} >Login</button>
      </div>
    </div>
  );
}
