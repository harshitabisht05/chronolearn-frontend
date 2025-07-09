'use client';

import { FaLinkedin, FaGithub, FaGlobe, FaEnvelope } from 'react-icons/fa';

export default function CreatedBy() {
  return (
        <div className="flex items-center justify-center mb-8"> {/* optional background */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 bg-white/5 p-10 rounded-3xl border border-white/10 max-w-4xl shadow-2xl backdrop-blur-md">
            {/* Profile Image */}
            <img
            src="../images/harshita.jpg"
            alt="Harshita Bisht"
            className="w-52 h-auto rounded-full object-cover border-2 border-white/30 shadow-lg"
            />

            {/* Right Content */}
            <div className="text-white" style={{ fontFamily: 'var(--font-manrope)' }}>
            <p className="text-xl text-white/80">Created by</p>
            <p className="text-3xl font-bold mt-1">Harshita Bisht</p>

            <p className="mt-6 text-lg text-white/70">Contact Info</p>
            <div className="flex gap-6 mt-3 text-white/90 text-2xl">
                <a href="https://harshitabisht-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
                <FaGlobe className="hover:text-white transition" />
                </a>
                <a href="https://www.linkedin.com/in/harshitabisht0511" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="hover:text-white transition" />
                </a>
                <a href="https://github.com/harshitabisht05" target="_blank" rel="noopener noreferrer">
                <FaGithub className="hover:text-white transition" />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=harshitabisht0515@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                <FaEnvelope className="hover:text-white transition" />
                </a>
            </div>
            </div>
        </div>
        </div>

  );
}
