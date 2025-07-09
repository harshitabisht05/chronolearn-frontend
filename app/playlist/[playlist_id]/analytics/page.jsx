'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Pie } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const { playlist_id } = useParams();
  const [progress, setProgress] = useState(null);
  const [watchTime, setWatchTime] = useState(null);
  const [streaks, setStreaks] = useState(null);
  const [chartSummary, setChartSummary] = useState(null);
  const [playlistInfo, setPlaylistInfo] = useState(null); // Added
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

const router = useRouter();

useEffect(() => {
  if (!playlist_id) return;

  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login'); // ⬅️ Redirect to login page
    return;
  }

  const fetchAnalytics = async (userToken) => {
    try {
      setLoading(true);

      const [
        progressRes,
        watchTimeRes,
        streakRes,
        chartRes,
        playlistInfoRes
      ] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/playlist/${playlist_id}/progress`, {
          headers: { Authorization: `Bearer ${userToken}` }
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/playlist/${playlist_id}/watch-time`, {
          headers: { Authorization: `Bearer ${userToken}` }
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/playlist/${playlist_id}/streak`, {
          headers: { Authorization: `Bearer ${userToken}` }
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/playlist/${playlist_id}/chart-data`, {
          headers: { Authorization: `Bearer ${userToken}` }
        }).then(r => r.json()),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/playlist/${playlist_id}`, {
          headers: { Authorization: `Bearer ${userToken}` }
        }).then(r => r.json()),
      ]);

      setProgress(progressRes);
      setWatchTime(watchTimeRes);
      setStreaks(streakRes);
      setChartSummary(chartRes);
      setPlaylistInfo(playlistInfoRes);
    } catch (err) {
      setError('❌ Failed to fetch analytics data.');
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics(token);
}, [playlist_id]);



  const formatSeconds = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const pieData = chartSummary && {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Video',
        data: [
          chartSummary?.completed_videos ?? 0,
          (chartSummary?.total_videos ?? 0) - (chartSummary?.completed_videos ?? 0),
        ],
        backgroundColor: ['#5714f2', '#1A0649'],
        borderColor: ['#ffffff20'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#ffffffcc', // ⬅️ Text color for legend
        font: {
          size: 20, // Optional: adjust font size
          family: 'var(--font-nunito)', // Optional: custom font
        },
      },
    },
    tooltip: {
      bodyColor: '#ffffff',       
      titleColor: '#ffffff',      
      bodyFont: {
        family: 'var(--font-nunito)',
      },
      titleFont: {
        family: 'var(--font-nunito)',
      },
    },
  },
};

  return (
    <>
    <Navbar />
    <div className="min-h-screen px-6 md:px-16 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-manrope)' }}>
        📈 Playlist Analytics
      </h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-white/70">Loading analytics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-full">
            {/* Progress */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow border border-white/20">
              <h2 style={{ fontFamily: 'var(--font-manrope)' }} className="text-xl font-semibold mb-2">🎯 Progress</h2>
              {progress && (
                <ul className="text-white/80 space-y-1">
                  <li>Total Videos: {progress.total_videos}</li>
                  <li>Completed: {progress.completed}</li>
                  <li>Percentage: {progress.percentage}%</li>
                </ul>
              )}
            </div>

            {/* Watch Time */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow border border-white/20">
              <h2 style={{ fontFamily: 'var(--font-manrope)' }} className="text-xl font-semibold mb-2">⏱ Watch Time</h2>
              {watchTime && (
                <ul style={{ fontFamily: 'var(--font-nunito)' }} className="text-white/80 space-y-1">
                  <li>Total: {formatSeconds(watchTime.total_time_sec)}</li>
                  <li>Completed: {formatSeconds(watchTime.completed_sec)}</li>
                  <li>Remaining: {formatSeconds(watchTime.remaining_sec)}</li>
                </ul>
              )}
            </div>

            {/* Streak */}
            <div className="backdrop-blur-md bg-white/10 p-6 rounded-xl shadow border border-white/20">
              <h2 style={{ fontFamily: 'var(--font-manrope)' }} className="text-xl font-semibold mb-2">🔥 Watch Streak</h2>
              {streaks && (
                <ul style={{ fontFamily: 'var(--font-nunito)' }} className="text-white/80 space-y-1">
                  <li>Current Streak: {streaks.current_streak} days</li>
                  <li>Max Streak: {streaks.max_streak} days</li>
                </ul>
              )}
            </div>
          </div>

          {/* Playlist Card - Middle Column */}
          {playlistInfo && (
            <div className="flex items-center justify-center w-full">
              <a
                href={playlistInfo.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-md bg-white/10 rounded-xl shadow-lg border border-white/10 overflow-hidden h-fit max-w-sm w-full hover:scale-[1.02] transition-transform duration-200"
              >
                {playlistInfo.thumbnail && (
                  <img
                    src={playlistInfo.thumbnail}
                    alt={playlistInfo.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-center" style={{ fontFamily: 'var(--font-manrope)' }}>
                    {playlistInfo.title}
                  </h2>
                </div>
              </a>
            </div>
          )}

          {/* Right Column - Pie Chart */}
          {pieData && (
            <div className=" backdrop-blur-md bg-white/10 p-6 rounded-xl shadow border border-white/20 h-fit">
              <h2 style={{ fontFamily: 'var(--font-manrope)' }} className="text-xl font-semibold mb-4">📊 Completion Summary</h2>
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}
