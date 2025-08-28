// models/urlModel.js
const mongoose = require('mongoose');
const { nanoid } = require('nanoid'); // Import nanoid for generating short IDs

const urlSchema = new mongoose.Schema({
  // The original long URL provided by the user
  originalUrl: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends of a string
  },
  // The short, unique code generated for the URL
  shortId: {
    type: String,
    required: true,
    unique: true,
    // Use nanoid to generate a default short ID if not provided
    default: () => nanoid(7), // Generates a 7-character short ID
  },
  // You can optionally add more fields like:
  // clicks: { type: Number, default: 0 },
  // createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true 
});


urlSchema.index({ shortId: 1 }, { unique: true });

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;