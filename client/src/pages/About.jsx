import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 text-white px-3 py-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 border-b-4 border-yellow-500 inline-block pb-2">
          🌐 About Real Time News
        </h1>
        <p className="text-lg leading-relaxed mb-8">
          <strong>Real Time News</strong> is your trusted platform to stay informed about what matters most, as it happens. 
          Our focus is on delivering breaking news, top headlines, and live updates from across the world in a clean, clutter-free experience.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-yellow-400">
          🚀 Why Real Time News?
        </h2>
        <p className="mb-8">
          In a world where news travels fast, Real Time News helps you keep pace. We believe in providing quick, concise,
          and accurate updates without overwhelming our users.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-yellow-400">
          📅 What You Can Expect
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-indigo-700 rounded-xl p-4 shadow-lg hover:scale-105 transform transition">
            <span className="block text-xl font-bold mb-2">🕒 Live News</span>
            <p>Timely updates as events unfold around the world.</p>
          </div>
          <div className="bg-indigo-700 rounded-xl p-4 shadow-lg hover:scale-105 transform transition">
            <span className="block text-xl font-bold mb-2">🌍 Global Perspective</span>
            <p>News from trusted sources across all regions and categories.</p>
          </div>
          <div className="bg-indigo-700 rounded-xl p-4 shadow-lg hover:scale-105 transform transition">
            <span className="block text-xl font-bold mb-2">🔍 Focused Content</span>
            <p>Streamlined news for easier understanding and faster reading.</p>
          </div>
          <div className="bg-indigo-700 rounded-xl p-4 shadow-lg hover:scale-105 transform transition">
            <span className="block text-xl font-bold mb-2">📱 Mobile Friendly</span>
            <p>Optimized layout for seamless experience on all devices.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-3 text-yellow-400">
          📈 Our Vision
        </h2>
        <p className="text-sm text-gray-300">
          To be a reliable source of real-time news that prioritizes accuracy, speed, and simplicity, making sure
          every reader stays updated without confusion or delay.
        </p>
      </div>
    </div>
  );
}
