const express = require("express");
const router = express.Router();
const productsM = require("../models/products-m");


router.get("/search", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      
      // console.log(req.query);
      const cate = req.query.cate || "";
      const page = req.query.page || 1;
      const perPage = 12;
      const book = req.query.inputBook || "";
      const filter = req.query.filter || "All";
      let prds;
      if (cate != ""){
        prds = await productsM.getBookByCate(cate, filter);
      }
      else{
        prds = await productsM.getBookByName(req.query.inputBook, filter, cate);
      }
      
      let totalPages = Math.ceil(prds.length / perPage);
      for (let i = 0; i < prds.length; i++) {
        prds[i].Rating = await productsM.getStars(prds[i].ProductID);
      }
      // console.log(prds);
      res.render("customers/SearchPage", {
        title: book == "" && filter == "All" ? "Books" : "Search",
        login: true,
        book,
        filter,
        page,
        cate,
        totalPages,
        prds: prds.slice((page - 1) * perPage, page * perPage),
        mainJs: () => "empty",
        navbar: () => "navbar",
        header: () => "header_search",
      });
    }
    else {
      res.redirect("/account/login");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/new_release", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      let prds = await productsM.getNewReleaseBooks(12);
      for (let i = 0; i < prds.length; i++) {
        prds[i].Rating = await productsM.getStars(prds[i].ProductID);
      }
      // console.log(prds);
      res.render("customers/SearchPage", {
        title: "New Release",
        login: true,
        prds,
        mainJs: () => "empty",
        navbar: () => "navbar",
        header: () => "header_search",
      });
    }
    else {
      res.redirect("/account/login");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;