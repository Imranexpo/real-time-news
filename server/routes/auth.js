const express = require('express');
const router = express.Router();
const { User, Preference } = require('../models/user');
const axios = require('axios');
const nodemailer = require('nodemailer');

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateEmailTemplate = (articles) => {
  if (!articles.length) return `<p>No matching news found at the moment.</p>`;
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>📰 Real-Time News Updates</h2>
      ${articles.map(article => `
        <div style="margin-bottom: 25px;">
          <h3>${article.title}</h3>
          ${article.urlToImage ? `<img src="${article.urlToImage}" style="width:100%;max-width:600px;" />` : ''}
          <p>${article.description || 'No description.'}</p>
          <a href="${article.url}" target="_blank">Read more</a>
          <br/><small>Source: ${article.source?.name || 'Unknown'}</small>
        </div>
      `).join('')}
    </div>
  `;
};

// User registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// General news
router.get('/news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'latest',
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ message: "Error fetching news", error: error.message });
  }
});

// Weather news
router.get('/weather-news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'weather',
        language: 'en',
        apiKey: process.env.NEWS_API_KEY
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather news:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather news', error: error.message });
  }
});

// WSJ news
router.get('/wsj-news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        domains: 'wsj.com',
        apiKey: process.env.NEWS_API_KEY
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching WSJ news:', error.message);
    res.status(500).json({ message: 'Failed to fetch WSJ news', error: error.message });
  }
});

// User preferences + send news email immediately
router.post('/preferences', async (req, res) => {
  const { email, categories, frequency } = req.body;
  if (!email || !categories || !categories.length || !frequency) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const preference = await Preference.create({ email, categories, frequency });

    if (frequency === 'immediate') {
      let allArticles = [];

      for (const category of categories) {
        const response = await axios.get(NEWS_API_URL, {
          params: {
            category,
            country: 'us',
            apiKey: process.env.NEWS_API_KEY
          }
        });

        if (response.data?.articles) {
          allArticles.push(...response.data.articles);
        }
      }

      // Remove duplicate articles by title
      const uniqueArticles = Array.from(
        new Map(allArticles.map(item => [item.title, item])).values()
      );

      const filteredNews = uniqueArticles.filter(article =>
        categories.some(category =>
          (article.title + article.description + article.content).toLowerCase().includes(category.toLowerCase())
        )
      );

      const mailOptions = {
        from: `"Real-Time News" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '📰 Real-Time News Updates',
        html: generateEmailTemplate(filteredNews)
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: 'Preferences saved and news sent.' });
  } catch (error) {
    console.error('Error saving preferences:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
