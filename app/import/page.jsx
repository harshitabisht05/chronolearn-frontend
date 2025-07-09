'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ImportPlaylistPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [token, setToken] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // default: today
  const [hoursPerDay, setHoursPerDay] = useState(1.5);  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setToken(storedToken);
  }, []);

  const handleImport = async () => {
    setLoading(true);
    setMessage('');
    setErrors([]);
    setResponse(null);

    if (!token) {
      setMessage('❌ You must be logged in to import.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/import`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ youtube_url: url }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.detail)) {
          setErrors(data.detail);
        } else {
          setMessage(data.detail || '❌ Failed to import playlist.');
        }
      } else {
        setResponse(data);
        setMessage('✅ Playlist imported successfully!');
      }
    } catch (err) {
      setMessage('❌ Something went wrong.');
    }

    setLoading(false);
  };
  
  const handleSchedule = async () => {
    if (!response?.playlist_id) {
      setMessage("❌ Playlist ID missing for scheduling.");
      return;
    }

    setScheduleLoading(true);
    setMessage('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/calendar/schedule/by-hours`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playlist_id: response.playlist_id,
            hours_per_day: hoursPerDay,
            start_date: startDate,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || '❌ Failed to schedule.');
      } else {
        setMessage('📅 Playlist scheduled successfully!');
      }
    } catch (err) {
      setMessage('❌ Something went wrong during scheduling.');
    }

    setScheduleLoading(false);
  };


  return (
    <>
<>
  <Navbar />
  <div className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-12 py-10 md:py-16 text-white">
    <div className="w-full max-w-5xl backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl px-6 sm:px-10 py-10 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
        Import Playlist
      </h2>
      <p className="text-white/70 text-sm mb-6" style={{ fontFamily: 'var(--font-nunito)' }}>
        Paste your YouTube playlist URL below to get started.
      </p>

      {typeof message === 'string' && message && (
        <p className={`text-center mb-4 text-sm ${message.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}

      {errors.length > 0 && (
        <ul className="mt-4 text-red-400 text-sm list-disc list-inside space-y-1">
          {errors.map((err, idx) => (
            <li key={idx}>{err.msg || JSON.stringify(err)}</li>
          ))}
        </ul>
      )}

      {/* Playlist Input Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-6">
        <input
          type="text"
          placeholder="https://youtube.com/playlist?list=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ fontFamily: 'var(--font-nunito)' }}
          className="flex-1 bg-[#2a2a3b] rounded-lg px-4 py-3 outline-none text-white placeholder-white/50 focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={handleImport}
          disabled={loading || !url}
          style={{ fontFamily: 'var(--font-manrope)' }}
          className="px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-3 font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
        >
          {loading ? <LoadingSpinner message="Importing playlist..." /> : 'Import Playlist'}
        </button>
      </div>

      {/* Schedule Options */}
      {response && (
        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="flex-1">
              <label className="text-white/80 text-sm font-medium" style={{ fontFamily: 'var(--font-manrope)' }}>
                Start Date:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full bg-[#2a2a3b] text-white px-3 py-2 rounded-lg outline-none mt-1"
              />
            </div>

            <div className="flex-1">
              <label className="text-white/80 text-sm font-medium" style={{ fontFamily: 'var(--font-manrope)' }}>
                Hours Per Day:
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                className="w-full bg-[#2a2a3b] text-white px-3 py-2 rounded-lg outline-none mt-1"
                required
                placeholder="Hours per day"
              />
            </div>

            <button
              onClick={handleSchedule}
              disabled={scheduleLoading}
              style={{ fontFamily: 'var(--font-manrope)' }}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              {scheduleLoading ? 'Scheduling...' : '📅 Schedule'}
            </button>
          </div>
        </div>
      )}

      {/* Playlist Preview Grid */}
      {response && (
        <div className="mt-8 text-white w-full">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">{response.message}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
            {response.videos.map((video, idx) => (
              <div
                key={idx}
                className="bg-[#1d1d2e] border border-white/10 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative w-full h-40">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {formatDuration(video.duration_seconds)}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium line-clamp-2">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</>

    </>
  );
}
