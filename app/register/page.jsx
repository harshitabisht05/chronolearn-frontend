'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';


export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || 'Registration failed.');
        return;
      }

      setMessage('🎉 Registration successful! Please log in.');
      setEmail('');
      setPassword('');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Something went wrong. Please try again.');
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

  {/* ✅ Right Form Section */}
  <div className="w-full md:w-1/2 flex justify-center items-center p-6 sm:p-10 md:p-16">
    <div className="w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl px-6 py-10 sm:px-10 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
        Create an account
      </h2>
      <p className="text-white/70 text-sm mb-8" style={{ fontFamily: 'var(--font-nunito)' }}>
        Already have an account?{' '}
        <Link href="/login" className="text-violet-400 hover:underline">Log in</Link>
      </p>

      {message && (
        <p className={`text-center mb-4 text-sm ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="w-full bg-[#2a2a3b] rounded-md px-4 py-3 outline-none text-white placeholder-white/50"
          style={{ fontFamily: 'var(--font-nunito)' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
          className="w-full bg-[#2a2a3b] rounded-md px-4 py-3 outline-none text-white placeholder-white/50"
          style={{ fontFamily: 'var(--font-nunito)' }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-violet-500 hover:bg-violet-600 text-white rounded-md py-3 text-base font-semibold transition-all"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Create account
        </button>
      </form>
    </div>
  </div>
</div>

    </>
  );
}
