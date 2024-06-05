const cloudinary = require('cloudinary').v2;
require('dotenv').config();  

cloudinary.config({ 
  cloud_name: process.env.MY_CLOUD_NAME, 
  api_key: process.env.MY_API_KEY, 
  api_secret: process.env.MY_API_SECRET
});

module.exports = cloudinary;