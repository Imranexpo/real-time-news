import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [news, setNews] = useState([]);
  useEffect(() => {
  axios.get('http://localhost:5000/api/news')
    .then((res) => setNews(res.data.articles))
    .catch((err) => console.error('Error fetching news:', err));
}, []);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🌍 Global Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
          >
            {item.urlToImage ? (
              <img
                src={item.urlToImage}
                alt={item.title}
                className="w-full h-52 object-cover"
              />
            ) : (
              <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-gray-600">
                No Image Available
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-700 mb-2">
                {item.description
                  ? item.description.slice(0, 100) + '...'
                  : 'No description available.'}
              </p>
              <div className="text-xs text-gray-500 flex justify-between">
                <span>📰 {item.source.name}</span>
                <span>
                  🕒{' '}
                  {new Date(item.publishedAt).toLocaleDateString()} <br />
                  {new Date(item.publishedAt).toLocaleTimeString()}
                </span>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-blue-600 text-sm font-medium hover:underline"
              >
                👉 Read Full Article
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
