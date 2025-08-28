
const URL = require('../models/urlModel');
const validUrl = require('valid-url'); // A package to validate URLs


exports.shortenUrl = async (req, res) => {
  const { url } = req.body; // Get the URL from the request body

  // Validate the URL
  if (!url || !validUrl.isUri(url)) {
    return res.status(400).json({ message: 'Invalid URL provided. Please ensure it starts with http:// or https://' });
  }

  try {
    // Check if the URL already exists in the database
    let urlDoc = await URL.findOne({ originalUrl: url });

    if (urlDoc) {
      // If it exists, return the existing short URL
      return res.status(200).json({ shortUrl: `${req.protocol}://${req.get('host')}/${urlDoc.shortId}` });
    } else {
      // If it doesn't exist, create a new entry
      // nanoid is already set as default in the model, so we just need to save
      urlDoc = new URL({ originalUrl: url });
      await urlDoc.save();

      // Respond with the newly created short URL
      // Construct the full short URL: base_url + shortId
      res.status(201).json({ shortUrl: `${req.protocol}://${req.get('host')}/${urlDoc.shortId}` });
    }
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ message: 'Server error while shortening URL' });
  }
};

// Controller function to redirect to the original URL
exports.redirectToOriginalUrl = async (req, res) => {
  const { shortId } = req.params; // Get the shortId from the URL parameters

  try {
    // Find the URL document by its shortId
    const urlDoc = await URL.findOne({ shortId: shortId });

    if (!urlDoc) {
      // If no URL is found with that shortId, return a 404 error
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Redirect the user to the original URL
    // We use a 301 Moved Permanently status code for SEO benefits,
    // but 302 Found (temporary redirect) is also common.
    res.redirect(301, urlDoc.originalUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ message: 'Server error during redirection' });
  }
};