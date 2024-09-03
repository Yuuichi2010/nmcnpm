const express = require('express');
const router = express.Router();
const UserController = require('./UserController');

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('admin/Users', {
            title: 'User Management',
            layout: 'admin',
            mainCss: () => '_css/styleT',
            mainJs: () => '_js/mainT',
            footer: () => 'empty'
        });
    } else {
        res.redirect("/account/login");
    }
});

router.put('/', async (req, res) => {
    console.log('Route /users is called');
    res.render('admin/Users', {
        title: 'User Management',
        layout: 'admin',
        mainCss: () => '_css/styleT',
        mainJs: () => '_js/mainT',
        footer: () => 'empty'
    });
});

router.use('/', UserController);
module.exports = router;
