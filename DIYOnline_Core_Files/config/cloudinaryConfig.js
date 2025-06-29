const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

// إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name",
  api_key: process.env.CLOUDINARY_API_KEY || "your_api_key", 
  api_secret: process.env.CLOUDINARY_API_SECRET || "your_api_secret",
});

// دالة لإنشاء تخزين Cloudinary مع مجلد مخصص
function createCloudinaryStorage(folderName) {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderPath = `DIYOnline/${folderName.trim()}`;
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;
      
      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
        resource_type: "auto", // يدعم الصور والفيديوهات والملفات الأخرى
      };
    },
  });
}

module.exports = {
  cloudinary,
  createCloudinaryStorage
};

