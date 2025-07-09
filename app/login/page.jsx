'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true); // Show loader

    try {
      const formBody = new URLSearchParams();
      formBody.append('username', email);
      formBody.append('password', password);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('users_id', data.users_id);
      setMessage('✅ Logged in successfully!');

      setTimeout(() => {
        setLoading(false);
        router.push('/import');
      }, 1200);
    } catch (err) {
      console.error('Login error:', err);
      setMessage('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
<div className="min-h-screen flex flex-col md:flex-row text-white">

  {/* 🔴 Left Side: Video background */}
  <div className="w-full md:w-1/2 p-4 sm:p-8 flex justify-center items-center">
    <video
      src="/images/demo.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-auto max-h-[400px] sm:max-h-[500px] md:max-h-[90vh] rounded-2xl shadow-lg object-cover"
    />
  </div>

  {/* ✅ Right Login Form Section */}
  <div className="w-full md:w-1/2 flex justify-center items-center p-6 sm:p-10 md:p-16">
    <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl px-6 py-10 sm:px-10 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
        Welcome Back
      </h2>
      <p className="text-white/70 text-sm mb-8" style={{ fontFamily: 'var(--font-nunito)' }}>
        Don't have an account?{' '}
        <Link href="/register" className="text-violet-400 hover:underline">Create one</Link>
      </p>

      {message && (
        <p className={`text-center mb-4 text-sm ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner message="Signing you in..." />
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full bg-[#2a2a3b] rounded-lg px-4 py-3 outline-none text-white placeholder-white/50 focus:ring-2 focus:ring-violet-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ fontFamily: 'var(--font-nunito)' }}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            className="w-full bg-[#2a2a3b] rounded-lg px-4 py-3 outline-none text-white placeholder-white/50 focus:ring-2 focus:ring-violet-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ fontFamily: 'var(--font-nunito)' }}
          />

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-3 font-semibold transition-all shadow-md hover:shadow-lg"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Sign in
          </button>
        </form>
      )}
    </div>
  </div>
</div>

    </>
  );
}
