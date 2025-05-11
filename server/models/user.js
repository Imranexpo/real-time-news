const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

const preferenceSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
   frequency: {
    type: String,
    enum: ['immediate', 'hourly', 'daily'], 
    required: true,
  },
});


const User = mongoose.model('User', userSchema);
const Preference = mongoose.model('Preference', preferenceSchema);

module.exports = {
  User,
  Preference
};

