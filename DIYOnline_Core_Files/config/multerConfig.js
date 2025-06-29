const multer = require("multer");
const path = require("path");
const { createCloudinaryStorage } = require("./cloudinaryConfig");

// إنشاء تخزين Cloudinary للصور العامة
const storage = createCloudinaryStorage("images");

// إعداد رفع الملفات
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // حجم الملف الأقصى 5 ميغابايت
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|webp/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)"));
    }
  },
});

module.exports = upload;
