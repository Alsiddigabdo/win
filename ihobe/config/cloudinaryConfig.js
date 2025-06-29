const cloudinary = require('cloudinary').v2;

// استخدام المتغيرات البيئية إذا كانت متوفرة، وإلا استخدام القيم الافتراضية
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyftlowtv',
  api_key: process.env.CLOUDINARY_API_KEY || '611352352948995',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9rEZK2K5yAafu9hqq4LlmGhMuF8',
});

module.exports = cloudinary;


