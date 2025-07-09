'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Navbar from '@/app/components/Navbar';

export default function PlaylistPage() {
  const params = useParams();
  const playlist_id = params.playlist_id;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const menuRefs = useRef([]);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (!stored) return;
    setToken(stored);
    fetchVideos(stored);
  }, [playlist_id]);

  const fetchVideos = async (userToken) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/calendar/playlist/${playlist_id}/videos`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setVideos(data.map((v) => ({ ...v, showMenu: false })));
      } else {
        setMessage(extractErrorMessage(data.detail) || 'Failed to fetch videos.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to fetch videos.');
    }
    setLoading(false);
  };

const handleUpdate = async (videoId, updatedStatus) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/calendar/video/${videoId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: updatedStatus }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, status: updatedStatus } : v))
      );
    } else {
      setMessage(extractErrorMessage(data.detail) || '❌ Failed to update video.');
    }

    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    console.error(err);
    setMessage('❌ Error while updating.');
  }
};



  const extractErrorMessage = (detail) => {
    if (Array.isArray(detail)) return `❌ ${detail.map((e) => e.msg).join(', ')}`;
    if (typeof detail === 'string') return `❌ ${detail}`;
    if (typeof detail === 'object' && detail?.msg) return `❌ ${detail.msg}`;
    return '❌ Unknown error occurred.';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      menuRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          setVideos((prev) =>
            prev.map((v, i) => (i === index ? { ...v, showMenu: false } : v))
          );
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [videos]);

  return (
    <>
      <Navbar />
    <div className="min-h-screen px-6 md:px-16 py-12">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-manrope)' }}>
        🎞️ Playlist Videos
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading videos...</p>
      ) : message ? (
        <p className="text-yellow-300 text-sm mb-4">{message}</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-400">No videos found in this playlist.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos
            .filter((video) => !filterStatus || video.status === filterStatus)
            .map((video, index) => (
              <div
                key={video.id}
                ref={(el) => (menuRefs.current[index] = el)}
                className="rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition overflow-hidden bg-[#1d1d2e]"
              >
                {/* Thumbnail */}
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-52 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-6 relative">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-manrope)' }}>
                      {index + 1}. {video.title}
                    </h2>

                    {/* 3-dot icon */}
                    <button
                      onClick={() =>
                        setVideos((prev) =>
                          prev.map((v, i) =>
                            i === index ? { ...v, showMenu: !v.showMenu } : { ...v, showMenu: false }
                          )
                        )
                      }
                      className="text-white hover:text-gray-300"
                    >
                      <BsThreeDotsVertical size={20} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">
                    📅 Scheduled: {video.scheduled_date?.split('T')[0] || 'N/A'}
                  </p>

                    {/* ✅ Mark as Completed */}
                    {video.status !== 'Completed' ? (
                    <button
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg text-sm font-semibold mb-4"
                        onClick={() => {
                        handleUpdate(video.id, 'Completed');
                        setVideos((prev) =>
                            prev.map((v) =>
                            v.id === video.id ? { ...v, status: 'Completed' } : v
                            )
                        );
                        }}
                    >
                        ✅ Mark as Completed
                    </button>
                    ) : (
                    <div className="text-green-400 font-semibold text-sm mb-4">✅ Completed</div>
                    )}


                  {/* Dropdown */}
                {video.showMenu && (
                <div className="absolute right-4 top-12 backdrop-blur-md bg-white/10 text-sm text-white rounded-xl shadow-2xl border border-white/20 w-64 z-50 p-4 space-y-3">
                    <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:underline"
                    >
                    📺 View on YouTube
                    </a>

                    <Link
                    href={`/playlist/${playlist_id}/calendar`}
                    className="block hover:underline"
                    >
                    📅 View on Calendar
                    </Link>

                    <div className="mt-2">
                    <label className="block mb-1">🛠 Change Status:</label>
                    <select
                        className="w-full bg-[#2e2e42] border border-white/20 text-white rounded-lg px-2 py-1 text-sm"
                        value={video.status}
                        onChange={(e) => handleUpdate(video.id, e.target.value)}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    </div>
                </div>
                )}

                </div>
              </div>
            ))}
        </div>
      )}
    </div>
    </>
  );
}
