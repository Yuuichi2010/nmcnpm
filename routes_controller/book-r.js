const express = require('express');
const router = express.Router();
const productsM = require("../models/products-m");
const feedbacksM = require("../models/feedbacks-m");

router.get('/:bookID', async (req, res) => {
    if (req.isAuthenticated()) {
        let bookID = req.params.bookID;
        let Book = await productsM.getBook(bookID);
        Book.Rating = await productsM.getStars(bookID)
        Book.Rating = Book.Rating.toPrecision(2);
        let Ratings = await feedbacksM.getCountStars(bookID);
        Book.Total = Ratings[0].TotalNum;
        //Feedback
        let Feedbacks = await feedbacksM.getFeedbacks(bookID);
    
        res.render('customers/Item.hbs', {
            title: Book.ProductName,
            login: true, Book, Ratings, Feedbacks,
            mainJs: () => "empty",
            UserID: req.user.UserID,
            navbar: () => "navbar",
            header: () => "header_search",
        });
    }
    else {
      res.redirect("/account/login");
    }
});

module.exports = router;