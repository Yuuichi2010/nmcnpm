const express = require('express');
const router = express.Router();
const WarehouseController = require('./WarehouseController');

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('admin/Warehouse', {
            title: 'Warehouse',
            layout: 'admin',
            mainCss: () => '_css/styleT',
            mainJs: () => '_js/mainT',
            footer: () => 'empty'
        });
    }
    else {
      res.redirect("/account/login");
    }
});

router.put('/', async (req, res) => {
    console.log('Route /warehouse is called');
    res.render('admin/Warehouse', {
        title: 'Warehouse',
        layout: 'admin',
        mainCss: () => '_css/styleT',
        mainJs: () => '_js/mainT',
        footer: () => 'empty'
    });
});



router.use('/', WarehouseController);

module.exports = router;