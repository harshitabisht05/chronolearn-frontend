'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from '@/app/components/Navbar';


export default function CalendarPage() {
  const params = useParams();
 const playlist_id = params?.playlist_id;
if (!playlist_id) return <p className="text-red-500">Invalid playlist ID</p>;

  const [calendarData, setCalendarData] = useState([]);
  const [token, setToken] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [videosOnDate, setVideosOnDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (!stored) {
  setMessage('❌ No token found.');
  setLoading(false);
  return;
}

    setToken(stored);
    fetchCalendarData(stored);
  }, [playlist_id]);

  const fetchCalendarData = async (userToken) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/calendar/playlist/${playlist_id}/calendar-view`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setCalendarData(data);
      } else {
        setMessage('❌ Failed to load calendar');
      }
    } catch (err) {
      setMessage('❌ Network error.');
    }
    setLoading(false);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    const isoDate = date.toISOString().split('T')[0];
    const found = calendarData.find((entry) => entry.date === isoDate);
    setVideosOnDate(found ? found.videos : []);
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const iso = date.toISOString().split('T')[0];
    const found = calendarData.find((d) => d.date === iso);
    if (found) {
      return <div className="text-green-400 text-xs text-center mt-1">🎥 {found.videos.length}</div>;
    }
    return null;
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen px-6 md:px-16 py-12">
      <h1 className="text-3xl font-bold mb-10" style={{ fontFamily: 'var(--font-manrope)' }}>
        📅 Playlist Calendar View
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading calendar...</p>
      ) : message ? (
        <p className="text-red-400">{message}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Calendar Left */}
<div className="w-full max-w-md rounded-3xl p-1 bg-white/10 border border-white/20 shadow-2xl backdrop-blur-md mx-auto md:mx-0">
  <div className="w-full rounded-3xl p-6 bg-white/5 backdrop-blur-md styled-calendar">

    <Calendar
      onChange={onDateChange}
      tileContent={tileContent}
      className="styled-calendar text-xl"
    />
  </div>
</div>


          {/* Videos Right */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {selectedDate
                ? `Videos on ${selectedDate.toDateString()}`
                : '📆 Select a date to view scheduled videos'}
            </h2>

            {selectedDate && videosOnDate.length === 0 && (
              <p className="text-gray-400">No videos scheduled for this day.</p>
            )}

            <div className="grid gap-6 w-full">
              {videosOnDate.map((v) => (
                <a
                  key={v.id}
                  href={v.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#1d1d2e] rounded-xl border border-white/10 shadow-md overflow-hidden hover:scale-[1.01] transition cursor-pointer"
                >
                  {v.thumbnail && (
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{v.title}</h3>
                    <p className="text-sm text-gray-400">Status: {v.status}</p>
                  </div>
                </a>

              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
