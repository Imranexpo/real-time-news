import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/navbar.css'


const AlertPreferences = () => {
  const [email, setEmail] = useState('');
  const [categories, setCategories] = useState([]);
  const [frequency, setFrequency] = useState('');
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allCategories = ['Politics', 'Sports', 'Technology', 'Business', 'Entertainment', 'Science'];

  const handleCategoryChange = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCancel = () => {
    setEmail('');
    setCategories([]);
    setFrequency('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !frequency || categories.length === 0) {
      alert('All fields are required: email, at least one category, and frequency');
      return;
    }

    const payload = { email, categories, frequency };
    const url = 'https://real-time-news-9sb0.onrender.com/api/preferences';

    try {
      const response = await axios.post(url, payload);
      console.log(response);  
      alert('Preferences saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving preferences');
    }
  };
   useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=in&max=10&apikey=43d4e57d0e06f25df5afefefe68647c7"
        );
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching the news", error);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000); 

    return () => clearInterval(interval); 
  }, [news]);

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center">
  <div className="max-w-screen-xl w-full px-6 py-8 bg-white rounded shadow-2xl flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
        Customize Your News Alerts
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-2">Email:</label>
          <input
            type="email"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <label className="block text-gray-700 text-lg font-semibold mb-4">Select Categories:</label>
        <div className="flex flex-wrap gap-4 mb-6">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                categories.includes(cat) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              } hover:bg-blue-600 hover:text-white transition`}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="block text-gray-700 text-lg font-semibold mb-4">Alert Frequency:</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
          required
        >
          <option value="">-- Select Option --</option>
          <option value="immediate">Immediate</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
        </select>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full p-4 text-white bg-red-500 rounded-lg hover:bg-red-600 transition ease-in-out duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full p-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition ease-in-out duration-300"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  <div className="w-full lg:w-1/2 bg-gray-100 p-0 rounded-xl shadow-lg overflow-hidden">
      {news.length > 0 ? (
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
          <img
            src={news[currentIndex]?.urlToImage || "/default-image.jpg"}
            alt="News"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 text-white px-4 py-2 bg-black bg-opacity-60 rounded">
            <h3 className="text-xl font-bold">Latest News</h3>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4">
            <p className="text-lg font-semibold">
              {news[currentIndex]?.title || "No Title"}
            </p>
            <p className="text-sm">
              {news[currentIndex]?.description || "No Description"}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-600">Loading news...</div>
      )}
    </div>
  );

  </div>
</div>

  );
};

export default AlertPreferences;
