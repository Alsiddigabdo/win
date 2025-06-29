const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const requireLogin = require('../middleware/requireLogin');

// رفع صورة واحدة
router.post('/upload/single', requireLogin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'لم يتم رفع أي صورة' 
      });
    }

    // رابط الصورة على Cloudinary
    const imageUrl = req.file.path;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      publicId: req.file.filename,
      message: 'تم رفع الصورة بنجاح'
    });
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الصورة'
    });
  }
});

// رفع عدة صور
router.post('/upload/multiple', requireLogin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'لم يتم رفع أي صور' 
      });
    }

    const imageUrls = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    res.json({
      success: true,
      images: imageUrls,
      message: `تم رفع ${req.files.length} صور بنجاح`
    });
  } catch (error) {
    console.error('خطأ في رفع الصور:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الصور'
    });
  }
});

// رفع صورة بروفايل
router.post('/upload/avatar', requireLogin, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'لم يتم رفع أي صورة' 
      });
    }

    const avatarUrl = req.file.path;
    
    res.json({
      success: true,
      avatarUrl: avatarUrl,
      publicId: req.file.filename,
      message: 'تم رفع صورة البروفايل بنجاح'
    });
  } catch (error) {
    console.error('خطأ في رفع صورة البروفايل:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع صورة البروفايل'
    });
  }
});

module.exports = router; 