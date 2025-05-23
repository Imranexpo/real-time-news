const express = require('express');
const router = express.Router();
const axios = require('axios');
const nodemailer = require('nodemailer');
const { User, Preference } = require('../models/user');

// Load environment variables
require('dotenv').config();

const NEWS_API_KEY = process.env.NEWS_API_KEY || 'c38bede86ae4451d99041d1bda860587';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'imranexpo864@gmail.com',
    pass: process.env.EMAIL_PASS || 'tnju ivqd emvc xeas', // use environment variable in production!
  },
});

// Email template generator
const generateEmailTemplate = (articles) => {
  if (!articles.length) return `<p>No matching news found at the moment.</p>`;
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2e6c80;">📰 Real-Time News Updates</h2>
      ${articles.map(article => `
        <div style="margin-bottom: 25px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
          <h3 style="margin: 0;">${article.title}</h3>
          ${article.urlToImage ? `<img src="${article.urlToImage}" style="max-width:100%; height:auto;" />` : ''}
          <p>${article.description || 'No description available.'}</p>
          <a href="${article.url}" style="color: #1a73e8;" target="_blank">Read more</a><br/>
          <small style="color: #999;">Source: ${article.source?.name || 'Unknown'}</small>
        </div>
      `).join('')}
      <p style="font-size: 12px; color: #999;">You're receiving this email based on your preferences.</p>
    </div>
  `;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Wall Street Journal news
router.get('/wsj-news', async (req, res) => {
  try {
    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        domains: 'wsj.com',
        apiKey: NEWS_API_KEY,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching WSJ news:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch WSJ news', error: error.message });
  }
});

// Save preferences and send news email
router.post('/preferences', async (req, res) => {
  const { email, categories, frequency } = req.body;
  if (!email || !categories || !categories.length || !frequency) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const preference = new Preference({ email, categories, frequency });
    await preference.save();

    if (frequency === 'immediate') {
      let allArticles = [];

      for (const category of categories) {
        const { data } = await axios.get(NEWS_API_URL, {
          params: {
            apiKey: NEWS_API_KEY,
            category,
            country: 'us',
          },
        });

        if (data?.articles?.length) {
          allArticles = allArticles.concat(data.articles);
        }
      }

      // Remove duplicate articles by title
      const uniqueArticles = Array.from(
        new Map(allArticles.map(article => [article.title, article])).values()
      );

      // Filter relevant articles
      const filteredNews = uniqueArticles.filter(article =>
        categories.some(category =>
          (article.title + article.description + article.content)
            .toLowerCase()
            .includes(category.toLowerCase())
        )
      );

      const mailOptions = {
        from: `"Real-Time News" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '📰 Real-Time News Updates',
        html: generateEmailTemplate(filteredNews),
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: 'Preferences saved and email sent (if immediate)' });
  } catch (error) {
    console.error('Error saving preferences:', error.response?.data || error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
