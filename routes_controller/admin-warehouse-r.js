const express = require("express");
const router = express.Router();
const productsM = require("../models/products-m");
const multer = require("multer");
const upload = multer({ dest: 'image/books' });

router.get("/addProduct", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      res.render("admin/AddProduct", {
        layout: "admin",
        title: "Add Product",
        mainJs: () => "_js/mainT",
      });
    }
    else {
      res.redirect("/account/login");
    }
  } catch (err) {
    next(err);
  }
});

router.post('/addProduct', upload.single('img'), async (req, res, next) => {
  try {
    const bookName = req.body.bookName;
    const author = req.body.author;
    const category = req.body.category;
    const pubCompany = req.body.pubCompany;
    const pubYear = req.body.pubYear;
    const inPrice = req.body.inPrice;
    const quantity = req.body.quantity;
    const des = req.body.des;
    const Photo = `/image/books/${req.file.filename}`;
    await productsM.addProduct(bookName, author, category, pubCompany, pubYear, inPrice, quantity, des, Photo);
    res.render("admin/AddProduct", {
      layout: "admin",
      title: "Add Product",
      nofi: "Add product to warehouse successfully!",
      mainJs: () => "_js/mainT",
    });
  } catch (err) {
    next(err);
  }
});

router.get("/postProduct", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      let BookID = req.query.ProductID || -1;
      if (BookID == -1) {
        next(-1);
      }
      let Product = await productsM.getBook(BookID);
      res.render("admin/PostProduct", {
        Product,
        layout: "admin",
        title: "Post Product",
        mainJs: () => "_js/mainT",
      });
    }
    else {
      res.redirect("/account/login");
    }
  } catch (err) {
    next(err);
  }
});


router.post('/postProduct', async (req, res, next) => {
  try {
    let ProductID = req.body.ProductID;
    let SalePrice = req.body.SalePrice;
    let Description = req.body.Description;
    await productsM.postProduct(ProductID, SalePrice, Description);
    res.send('done');
  } catch (err) {
    next(err);
  }
})

module.exports = router;
