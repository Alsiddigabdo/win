const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

// إعداد التخزين على Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ihobe-uploads', // اسم مجلد الصور في Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

// إعداد Multer مع Cloudinary
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // حد أقصى 10 ميجابايت
  }
});

module.exports = upload;


