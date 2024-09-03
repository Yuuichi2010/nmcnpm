const express = require("express");
const router = express.Router();
const productsM = require("../models/products-m");

//get HomePage
router.get("/", async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      let prds = await productsM.getActiveBooks(4);
      for (let i = 0; i < prds.length; i++) {
        prds[i].Descrip = prds[i].Descrip.split("\n")[0];
        prds[i].Rating = await productsM.getStars(prds[i].ProductID);
      }

      let featuredPrd = await productsM.getFeaturedBook();
      featuredPrd.Descrip = featuredPrd.Descrip.split("\n")[0];
      featuredPrd.Rating = await productsM.getStars(featuredPrd.ProductID);

      let newPrds = await productsM.getNewReleaseBooks(16);
      for (let i = 0; i < newPrds.length; i++) {
        newPrds[i].Rating = await productsM.getStars(newPrds[i].ProductID);
      }

      let commingSoonPrds = await productsM.getDeactiveBooks(4);
      for (let i = 0; i < commingSoonPrds.length; i++) {
        commingSoonPrds[i].Rating = await productsM.getStars(commingSoonPrds[i].ProductID);
        commingSoonPrds[i].Descrip = commingSoonPrds[i].Descrip.split('\n')[0];
      }

      res.render("customers/HomePage", {
        title: "Home Page",
        login: true,
        prds,
        newPrds,
        featuredPrd,
        commingSoonPrds,
        mainJs: () => "empty",
        navbar: () => "navbar",
        header: () => "header_search",
      });
    } else {
      res.redirect("/account/login");
    }

  } catch (err) {
    next(err);
  }
});

router.get("/aboutus", async (req, res, next) => {
  try {
    if(req.isAuthenticated()) {
      res.render("customers/AboutUs", {
        title: "About Us",
        login: true,
        mainJs: () => "empty",
        navbar: () => "navbar",
        header: () => "header_search",
      });
    } else {
      res.redirect("/account/login");
    }
  } catch (err) {
    next(err);
  }
});

//get About Us page
router.get("/Us", async (req, res, next) => {
  try {
    if(req.isAuthenticated()) {
      res.render("customers/Us", {
        title: "Group 11",
        login: true,
        mainJs: () => "empty",
        navbar: () => "navbar",
        header: () => "header_search"
      });
    } else {
      res.redirect("/account/login");
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
