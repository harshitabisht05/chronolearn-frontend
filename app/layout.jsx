import { icons } from 'lucide-react';
import './globals.css';
import localFont from 'next/font/local';
import React from 'react';

const nunito = localFont({
  src: '../public/fonts/Nunito-Regular.ttf',
  variable: '--font-nunito',
});

const manrope = localFont({
  src: '../public/fonts/manrope-regular.otf',
  variable: '--font-manrope',
});

export const metadata = {
  icons: {
    icon: '/images/logo.png',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/images/logo.png', sizes: '16x16' },
      { rel: 'icon', url: '/images/logo.png', sizes: '32x32' },
      { rel: 'icon', url: '/images/logo.png', sizes: '48x48' },
      { rel: 'icon', url: '/images/logo.png', sizes: '64x64' },
    ],
  },
  title: 'ChronoLearn',
  description: 'Extract Video from youtube and geneted a calendar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable} ${manrope.variable}`}>
      <body className="relative overflow-x-hidden text-white">
        {/* 🔵 Fullscreen background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source src="/images/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🔴 Optional dark overlay */}
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-0" />

        {/* Page content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
