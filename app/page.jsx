'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import FeaturesStacked from './components/FeaturesStacked';
import Navbar from './components/Navbar';
import CreatedBy from './components/CreatedBy';

export default function HomePage() {
  const router = useRouter();
  const swiperRef = useRef(null);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-10 gap-10 bg-transparent">
        
        {/* Left Text Section */}
        <div className="flex flex-col items-start justify-center w-full md:w-1/2 gap-5">
          <h1
            style={{ fontFamily: 'var(--font-manrope)' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] mb-4"
          >
            Track Your YouTube
            <br />
            Learning
          </h1>

          <button
            onClick={() => router.push('/login')}
            style={{ fontFamily: 'var(--font-manrope)' }}
            className="group inline-flex items-center gap-2 px-6 py-2 
              bg-white/10 hover:bg-white/20 text-white 
              text-sm md:text-base font-semibold 
              rounded-full shadow-lg 
              transition-all duration-300 
              ring-1 ring-white/10 hover:ring-white/20 backdrop-blur-md"
          >
            Get Started
            <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <p
            style={{ fontFamily: 'var(--font-nunito)' }}
            className="text-sm md:text-lg mt-4 text-white/80 max-w-xl"
          >
            “<span className="text-purple-400">Chrono</span>” (time) + “<span className="text-purple-400">Learn</span>” = time-based learning.
          </p>

          <p
            style={{ fontFamily: 'var(--font-nunito)' }}
            className="text-sm md:text-lg text-white/80 max-w-xl"
          >
            Generate a personalized study calendar from any YouTube playlist and stay consistent every day.
          </p>
        </div>

        {/* Video Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <video
            src="/images/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Features Section */}
      <FeaturesStacked />

      {/* Created By Section */}
      <CreatedBy />
    </>
  );
}
