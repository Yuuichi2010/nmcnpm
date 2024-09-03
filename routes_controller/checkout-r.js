const express = require("express");
const router = express.Router();
const checkoutM = require("../models/checkout-m");

router.get('/', async (req, res, next) => {
    if (req.isAuthenticated()) {
        let OrderID = await checkoutM.getID() + 1;
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
        let year = today.getFullYear();
    
        checkoutM.CreateNewOrder(req.user.UserID);
        res.render('customers/Checkout',{
            day: day,
            month: month,
            year: year,
            OrderID: OrderID,
            title: 'Checkout',
            text: 'Check Out',
            login: true,
            User: req.user,
            mainJs: () => 'empty',
            navbar:()=>'empty',
            header: () => 'header_text',
        })
    }
    else {
      res.redirect("/account/login");
    }
});

router.get('/done', async (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('customers/Done' ,{
            title: 'Done',
            text: 'Done',
            login: true,
            mainJs: () => 'empty',
            navbar:()=>'empty',
            header: () => 'header_text',
        })
    }
    else {
      res.redirect("/account/login");
    }
});

router.post('/purchase', async (req, res, next) => {
    try {
        let {OrderID, BuyerID, BookArray: bookArrayJSON, TotalPayment, formattedDate } = req.body;
            checkoutM.purchase(OrderID, BuyerID, bookArrayJSON, formattedDate, TotalPayment);
        res.send(req.body);
    } catch (err) {
        next(err);
    }
});
module.exports = router;