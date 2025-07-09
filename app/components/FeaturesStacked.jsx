'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    icon: '📺',
    title: 'YouTube Playlist Input',
    description: 'Accept any playlist URL and extract video data using YouTube API.',
  },
  {
    icon: '⏱️',
    title: 'Smart Scheduling',
    description: 'Choose between “X hours per day” or “Finish by date” to auto-generate schedule.',
  },
  {
    icon: '🗓️',
    title: 'Calendar View',
    description: 'Visual display of scheduled videos by date.',
  },
  {
    icon: '✅',
    title: 'Progress Tracking',
    description: 'Mark videos as Not Started, In Progress or Completed.',
  },
  {
    icon: '🔥',
    title: 'Streak Tracker',
    description: 'See how many consecutive days you’ve stayed on track.',
  },
  {
    icon: '📊',
    title: 'Completion Analytics',
    description: 'View percentage progress, total watch time, and remaining time and much more.',
  },
  {
    icon: '📂',
    title: 'User Dashboard',
    description: 'Overview of all playlists and their progress.',
  },
];

export default function FeaturesStacked() {
  return (
    <section
      id="features"
      className="relative z-20 py-24 px-6 text-white"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left Visual Image (mockup uploaded) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl"
        >
          <Image
            src="/images/logo.png" // Rename uploaded image to this path OR use your uploaded URL
            alt="ChronoLearn Visual"
            width={500}
            height={200}
            className=" object-contain"
          />
        </motion.div>

        {/* Right Feature List */}
        <div className="w-full flex flex-col gap-8 max-w-2xl">
          <h2
            style={{ fontFamily: 'var(--font-manrope)' }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Why use <span className="text-purple-500">ChronoLearn</span>?
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl w-full"
          >
            <div className="flex flex-col gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex gap-4 items-start border-t border-white/10 pt-4"
                >
                  <div className="text-green-400 text-2xl">{feature.icon}</div>
                  <div>
                    <h3 
                    style={{ fontFamily: 'var(--font-manrope)' }}
                    className="font-semibold text-lg">{feature.title}</h3>
                    <p style={{ fontFamily: 'var(--font-nunito)' }}
                    className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
