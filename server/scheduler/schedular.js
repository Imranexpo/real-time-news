const cron = require('node-cron');
const axios = require('axios');
const {Preference} = require('../models/user');
const nodemailer = require('nodemailer');
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'imranexpo864@gmail.com',
    pass: 'tnju ivqd emvc xeas'
  }
});

const sendScheduledEmails = async (frequency) => {
  const preferences = await Preference.find({ frequency });
  for (const pref of preferences) {
    let allArticles = [];
    for (const category of pref.categories) {
      const response = await axios.get(NEWS_API_URL, {
        params: {
          apiKey: 'c38bede86ae4451d99041d1bda860587',
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
      pref.categories.some(category =>
        (article.title + article.description + article.content)
          .toLowerCase()
          .includes(category.toLowerCase())
      )
    );
    const mailOptions = {
      from: `"Real-Time News" <imranexpo864@gmail.com>`,
      to: pref.email,
      subject: '📰 Your Real-Time News Updates',
      html: generateEmailTemplate(filteredNews),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Sent to ${pref.email} for ${frequency}`);
  }
};

// Hourly (every 1 hour)
cron.schedule('0 * * * *', () => {
  sendScheduledEmails('hourly');
});

// Daily (every day at 8 AM)
cron.schedule('0 8 * * *', () => {
  sendScheduledEmails('daily');
});

const generateEmailTemplate = (articles) => {
  if (!articles.length) return `<p>No matching news found at the moment.</p>`;
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
    </div>
  `;
};
