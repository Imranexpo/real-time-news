const express = require('express');
const router = express.Router();
const {User, Preference} = require('../models/user');
const axios = require('axios');
const nodemailer = require('nodemailer');
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
  }
});
const generateEmailTemplate = (articles) => {
  if (!articles.length) {
    return `<p>No matching news found at the moment.</p>`;
  }
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2e6c80;">📰 Real-Time News Updates</h2>
      ${articles.map(article => `
        <div style="margin-bottom: 25px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
          <h3 style="margin: 0;">${article.title}</h3>
          ${article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" style="max-width: 100%; height: auto; margin: 10px 0;" />` : ''}
          <p style="margin: 5px 0; color: #444;">${article.description || 'No description available.'}</p>
          <a href="${article.url}" style="color: #1a73e8;" target="_blank">Read more</a><br/>
          <small style="color: #999;">Source: ${article.source?.name || 'Unknown'}</small>
        </div>
      `).join('')}
      <p style="margin-top: 30px; font-size: 12px; color: #999;">You're receiving this email based on your selected preferences.</p>
    </div>
  `;
};

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

router.get('/news', async (req, res) => {
  try {
    const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'latest',
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY
      }
    });

    res.status(200).json(newsResponse.data); 
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ message: "Error fetching news", error: error.message });
  }
});

router.get('/weather-news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        q: 'weather',
        language: 'en',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather news:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather news', error: error.message });
  }
});

router.get('/wsj-news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        domains: 'wsj.com',
        apiKey: process.env.NEWS_API_KEY
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching WSJ news:', error.message);
    res.status(500).json({ message: 'Failed to fetch WSJ news', error: error.message });
  }
});

router.post('/preferences', async (req, res) => {
  const { email, categories, frequency } = req.body;
  if (!email || !categories || categories.length === 0 || !frequency) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const preference = new Preference({ email, categories, frequency });
    await preference.save();
      if (frequency === 'immediate') {
      let allArticles = [];
      for (const category of categories) {
      const response = await axios.get(NEWS_API_URL, {
        params: {
          apiKey: process.env.NEWS_API_KEY,
          category,
          country: 'us',
        },
      });

      if (response.data && response.data.articles) {
        allArticles = [...allArticles, ...response.data.articles];
      }
    }
         const uniqueArticles = Array.from(
      new Map(allArticles.map(item => [item.title, item])).values()
    );

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
    res.status(201).json({ message: 'Preferences saved successfully' });
  
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
