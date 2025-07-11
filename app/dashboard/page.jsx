'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scheduleModalPlaylist, setScheduleModalPlaylist] = useState(null);
  const [scheduleType, setScheduleType] = useState('by-hours');
  const [start_date, setStartDate] = useState('');
  const [hours_per_day, setHoursPerDay] = useState('');
  const [target_date, setTargetDate] = useState('');
  const menuRefs = useRef([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      setToken(stored);
      setLoading(true); // trigger loading indicator
      setTimeout(() => fetchDashboard(stored), 0); // defer fetch to after render

    } else {
      router.push('/login');
    }
  }, []);

  const fetchDashboard = async (userToken) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/user/me/dashboard`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (!res.ok) setError(data.detail || 'Failed to load dashboard.');
      else setPlaylists(data.map((p) => ({ ...p, showMenu: false })));
    } catch {
      setError('❌ Something went wrong.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      menuRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setPlaylists((prev) =>
            prev.map((p, i) => (i === index ? { ...p, showMenu: false } : p))
          );
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [playlists]);

  return (
    <>
      <Navbar />
    <div className="min-h-screen px-6 md:px-16 py-12">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-manrope)' }}>
        📊 Your Study Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading your playlists...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-400">You have no imported playlists yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {playlists.map((pl, index) => (
            <div
              key={pl.playlist_id}
              className="bg-[#1d1d2e] rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition overflow-visible"
              ref={(el) => (menuRefs.current[index] = el)}
            >
              {pl.thumbnail && (
                <img
                  loading="lazy"
                  src={pl.thumbnail}
                  alt={pl.title}
                  className="w-full h-60 object-cover"
                />
              )}

              <div className="p-6 relative">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-manrope)' }}>
                    {pl.title}
                  </h2>
                  <button
                    onClick={() =>
                      setPlaylists((prev) =>
                        prev.map((p, i) =>
                          i === index ? { ...p, showMenu: !p.showMenu } : { ...p, showMenu: false }
                        )
                      )
                    }
                    className="text-white hover:text-gray-300"
                  >
                    <BsThreeDotsVertical size={20} />
                  </button>
                </div>

                {pl.showMenu && (
                  <div className="absolute top-12 right-6 backdrop-blur-md bg-white/10 text-sm text-white rounded-xl shadow-2xl border border-white/20 w-52 z-30">
                    <button
                      onClick={() => setScheduleModalPlaylist(pl)}
                      className="w-full text-left px-4 py-2 hover:bg-[#3a3a4a] text-white"
                    >
                      ⏰ Schedule Playlist
                    </button>
                    <Link href={`/playlist/${pl.playlist_id}`} className="block px-4 py-2 hover:bg-[#3a3a4a] text-white">
                      📺 View Playlist
                    </Link>
                    <Link href={`/playlist/${pl.playlist_id}/calendar`} className="block px-4 py-2 hover:bg-[#3a3a4a] text-white">
                      📅 View Calendar
                    </Link>
                    <Link href={`/playlist/${pl.playlist_id}/analytics`} className="block px-4 py-2 hover:bg-[#3a3a4a] text-white">
                      📊 View Analytics
                    </Link>
                    <a href={pl.youtube_url} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-[#3a3a4a] text-white">
                      🔗 Open in YouTube
                    </a>
                  </div>
                )}

                <div className="mt-4 text-sm text-white/80 space-y-1">
                  <p>🎞️ Total Videos: {pl.total_videos}</p>
                  <p>✅ Completed: {pl.completed}</p>
                  <p>📈 Progress: {pl.percent_complete}%</p>
                  <p>
                    🗓️ Schedule: {pl.scheduled_start || 'N/A'} → {pl.scheduled_end || 'N/A'}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${pl.percent_complete}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {scheduleModalPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1d1d2e] p-6 rounded-xl w-full max-w-lg border border-white/20 shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-manrope)' }}>
              {scheduleModalPlaylist.scheduled_start ? 'Reschedule Playlist?' : 'Schedule Playlist'}
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/schedule/${scheduleType}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                      scheduleType === 'by-hours'
                        ? {
                            playlist_id: scheduleModalPlaylist.playlist_id,
                            hours_per_day,
                            start_date,
                          }
                        : {
                            playlist_id: scheduleModalPlaylist.playlist_id,
                            target_date,
                            start_date,
                          }
                    ),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.detail || 'Scheduling failed');
                  setShowSuccessModal(true);
                  setScheduleModalPlaylist(null);
                  fetchDashboard(token);

                  setScheduleModalPlaylist(null);
                  fetchDashboard(token);
                } catch (err) {
                  alert('❌ ' + err.message);
                }
              }}
            >
              <div className="flex flex-col gap-2 mb-4 text-white">
                <label style={{ fontFamily: 'var(--font-manrope)' }}>
                  Start Date:
                  <input
                    type="date"
                    required
                    value={start_date}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 bg-transparent border border-white/20 px-2 py-1 rounded text-white"
                  />
                </label>

                {scheduleType === 'by-hours' ? (
                  <label style={{ fontFamily: 'var(--font-manrope)' }}>
                    Hours per Day:
                    <input
                      type="number"
                      required
                      min={0.5}
                      step={0.1}
                      value={hours_per_day}
                      onChange={(e) => setHoursPerDay(e.target.value)}
                      className="w-full mt-1 bg-transparent border border-white/20 px-2 py-1 rounded text-white"
                    />
                  </label>
                ) : (
                  <label style={{ fontFamily: 'var(--font-manrope)' }}>
                    Target End Date:
                    <input
                      type="date"
                      required
                      value={target_date}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full mt-1 bg-transparent border border-white/20 px-2 py-1 rounded text-white"
                    />
                  </label>
                )}
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setScheduleType('by-hours')}
                  style={{ fontFamily: 'var(--font-manrope)' }}
                  className={`px-4 py-2 rounded-full border ${
                    scheduleType === 'by-hours' ? 'border-violet-500 text-violet-400' : 'border-white/30 text-white/60'
                  }`}
                >
                  By Hours
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('by-date')}
                  style={{ fontFamily: 'var(--font-manrope)' }}
                  className={`px-4 py-2 rounded-full border ${
                    scheduleType === 'by-date' ? 'border-violet-500 text-violet-400' : 'border-white/30 text-white/60'
                  }`}
                >
                  By Target Date
                </button>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setScheduleModalPlaylist(null)}
                  className="text-sm text-white/60 hover:text-red-400"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSuccessModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-[#1d1d2e] text-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-white/20 text-center">
      <h3 className="text-2xl font-bold mb-2">🎉 Done!</h3>
      <p className="mb-6">Your playlist was scheduled successfully.</p>
      <button
        onClick={() => setShowSuccessModal(false)}
        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
    </>
  );
}
