import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

const fetchWeatherNews = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/weather-news'); 
    setArticles(response.data.articles);
  } catch (error) {
    if(error){setError('Failed to fetch weather news.')}
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchWeatherNews();
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
    <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">🌤 Weather News Updates</h1>

        {loading && <p className="text-center text-gray-600">Loading weather news...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && articles.length > 0 && (
          <>
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 md:h-full">
                  <img
                    src={articles[0].urlToImage || 'https://via.placeholder.com/600x400'}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">
                    {articles[0].title}
                  </h2>
                  <p className="text-lg text-gray-700 mb-4">
                    {articles[0].description || 'No description available.'}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>Source:</strong> {articles[0].source?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <strong>Published:</strong>{' '}
                    {new Date(articles[0].publishedAt).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <a
                    href={articles[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                  >
                    Read Full Article
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                >
                  <img
                    src={article.urlToImage || 'https://via.placeholder.com/400x200'}
                    alt="News"
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {article.description?.substring(0, 100) || 'No description.'}...
                    </p>
                    <div className="text-xs text-gray-500 mb-2">
                      <p><strong>Source:</strong> {article.source?.name || 'Unknown'}</p>
                      <p>
                        <strong>Published:</strong>{' '}
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        {new Date(article.publishedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-blue-600 hover:underline"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !articles.length && (
          <p className="text-center text-gray-600">No weather-related news found.</p>
        )}
      </div>
    </div>
  );
};

export default WeatherNews;
