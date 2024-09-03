const express = require("express");
const router = express.Router();
const Orders = require("../models/checkout-m");

router.get("/", async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.session.passport.user === "bookseller") {
            const today = new Date();
            let year = req.query.year || today.getFullYear();
            let month = req.query.month || today.getMonth() + 1;
            if (month < (today.getMonth() + 1)) {
                month = today.getMonth() + 1;
            }
            
            let monthlyList = await Orders.getMonthlyOrders(year);
            for (let index = 0; index < monthlyList.length; index++) {
                monthlyList[index].price = monthlyList[index].TotalOut - monthlyList[index].TotalIn;
            }
            
            let dailyList = await Orders.getDailyOrders(year,month);
            for (let index = 0; index < dailyList.length; index++) {
                dailyList[index].price = dailyList[index].TotalOut - dailyList[index].TotalIn;
            }
            res.render("bookseller/Dashboard", {
                title: "Bookseller Dashboard",
                layout: "admin",
                Month: month,
                Year: year,
                MonthlyList: JSON.stringify(monthlyList),
                DailyList: JSON.stringify(dailyList),
                mainJs: () => 'empty',
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/account/login');
    }
});

module.exports = router;
