const express = require("express");
const router = express.Router();
const productsM = require("../models/products-m");
const cart = require("../models/cart-m");


router.get('/', async (req, res, next) => {
    if (req.isAuthenticated()) {
        let prds = await cart.getCart(req.user.UserID);
        
        let CartQuantity = prds.map(item => item.Quantity);
        for (let i = 0; i < prds.length; i++) {
            prds[i] = await productsM.getBook(prds[i].ProductID);
            prds[i].Instock = prds[i].Quantity;
            prds[i].Rating = await productsM.getStars(prds[i].ProductID);
            prds[i].Cate = (await cart.getCategory(prds[i].CateID)).CateName;
            prds[i].CartQuantity = await CartQuantity[i];
        }
        res.render('customers/Cart', {
            prds,
            title: 'Shopping Cart',
            text: 'Cart',
            login: true,
            UserID: req.user.UserID,
            mainJs: () => 'empty',
            navbar:()=>'empty',
            header: () => 'header_text',
        })
    }
    else {
      res.redirect("/account/login");
    }
});

router.post('/', async(req, res, next) => {
    try{
        let {CustomerID, ProductID, quantity} = req.body;
        if(quantity == 0){
            cart.Delete(CustomerID, ProductID);
        }
        else
            cart.UpdateData(CustomerID, ProductID, quantity);
        res.send(req.body);
    } catch(err){
        next(err);
    }
});
router.post('/add', async(req, res, next) => {
    try{
        let {CustomerID, ProductID, quantity} = req.body;
        cart.addProduct(CustomerID, ProductID, quantity);
        res.send(req.body);
    } catch(err){
        next(err);
    }
})
module.exports = router;