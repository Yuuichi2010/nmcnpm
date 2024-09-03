const express = require('express');
const router = express.Router();
const OrderController = require('./OrderController');

// Đường dẫn cho trang quản lý đơn hàng
router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('admin/OrderManagement', {
            layout: 'admin',
            mainJs: () => '_js/mainT',
            title: 'Manage User'
        });
    }
    else {
      res.redirect("/account/login");
    }
});





router.use('/', OrderController);

module.exports = router;