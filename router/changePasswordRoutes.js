const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// عرض صفحة تغيير كلمة المرور
router.get('/change-password', authMiddleware, (req, res) => {
    res.render('changePassword', {
        userId: req.session.userId,
        isAdmin: res.locals.isAdmin,
        unreadCount: res.locals.unreadCount
    });
});

// معالجة طلب تغيير كلمة المرور
router.post('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.userId;

    try {
        // التحقق من تطابق كلمة المرور الجديدة مع التأكيد
        if (newPassword !== confirmPassword) {
            return res.render('changePassword', {
                errorMessage: 'كلمة المرور الجديدة وتأكيدها غير متطابقين',
                userId: req.session.userId,
                isAdmin: res.locals.isAdmin,
                unreadCount: res.locals.unreadCount
            });
        }

        // التحقق من قوة كلمة المرور
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.render('changePassword', {
                errorMessage: 'كلمة المرور الجديدة لا تلبي متطلبات الأمان',
                userId: req.session.userId,
                isAdmin: res.locals.isAdmin,
                unreadCount: res.locals.unreadCount
            });
        }

        // الحصول على كلمة المرور الحالية من قاعدة البيانات
        const [user] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
        
        if (user.length === 0) {
            return res.render('changePassword', {
                errorMessage: 'المستخدم غير موجود',
                userId: req.session.userId,
                isAdmin: res.locals.isAdmin,
                unreadCount: res.locals.unreadCount
            });
        }

        // التحقق من صحة كلمة المرور الحالية
        const isMatch = await bcrypt.compare(currentPassword, user[0].password);
        
        if (!isMatch) {
            return res.render('changePassword', {
                errorMessage: 'كلمة المرور الحالية غير صحيحة',
                userId: req.session.userId,
                isAdmin: res.locals.isAdmin,
                unreadCount: res.locals.unreadCount
            });
        }

        // تشفير كلمة المرور الجديدة
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // تحديث كلمة المرور في قاعدة البيانات
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        // إضافة إشعار للمستخدم
        await db.query(
            'INSERT INTO notifications (user_id, sender_id, message, type) VALUES (?, ?, ?, ?)',
            [userId, userId, 'تم تغيير كلمة المرور الخاصة بك بنجاح', 'security']
        );

        // إرسال رسالة نجاح
        return res.render('changePassword', {
            successMessage: 'تم تغيير كلمة المرور بنجاح',
            userId: req.session.userId,
            isAdmin: res.locals.isAdmin,
            unreadCount: res.locals.unreadCount
        });
    } catch (error) {
        console.error('خطأ في تغيير كلمة المرور:', error);
        return res.render('changePassword', {
            errorMessage: 'حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى',
            userId: req.session.userId,
            isAdmin: res.locals.isAdmin,
            unreadCount: res.locals.unreadCount
        });
    }
});

module.exports = router;
