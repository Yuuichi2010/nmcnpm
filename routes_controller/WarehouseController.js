const express = require('express');
const router = express.Router();
const WarehouseModel = require('../models/WarehouseModel');

router.get('/all', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const { search, filter, sort } = req.query;
      const Warehouse = await WarehouseModel.getAllProduct({ search, filter, sort });
      res.json(Warehouse);
    }
    else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/filter', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const { filter } = req.query;
      const Warehouse = await WarehouseModel.getProduct(filter);
      res.json(Warehouse);
    }
    else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/product/:productID', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const productID = req.params.productID;
      const productData = await WarehouseModel.getProductData(productID);

      res.json(productData);
    }
    else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(`Error fetching product data: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/updateProduct/:ProductID', async (req, res) => {
  try {
    const ProductID = req.params.ProductID;
    const updatedProductData = req.body;

    const rowsAffected = await WarehouseModel.updateProduct(ProductID, updatedProductData);

    if (rowsAffected > 0) {
      res.status(200).json({ success: true, message: 'Product updated successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found or could not be updated.' });
    }
  } catch (error) {
    console.error('Error in PUT /updateProduct:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


router.put('/exportProduct', async (req, res, next) => {
  try {

    const { ProductID } = req.query;

    const Warehouse = await WarehouseModel.exportProduct(ProductID);

    res.json(Warehouse);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/deleteProduct', async (req, res, next) => {
  try {
    const { productID } = req.query;
    const result = await WarehouseModel.deleteProduct(productID);

    if (result.success) {
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to delete product' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});



router.put('/export/:ProductID', async (req, res) => {
  try {
    const ProductID = req.params.ProductID;
    console.log('ProductID:', ProductID);
    const newStatus = 'Active';

    const rowsAffected = await WarehouseModel.exportProduct(ProductID, newStatus);

    if (rowsAffected > 0) {
      res.status(200).json({ success: true, message: 'Product marked as export successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found or could not be export.' });
    }
  } catch (error) {
    console.error('Error in /complete:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.delete('/delete/:ProductID', async (req, res) => {
  try {
    const ProductID = req.params.ProductID;


    const rowsAffected = await WarehouseModel.deleteProduct(ProductID);

    if (rowsAffected > 0) {
      res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found or could not be deleted.' });
    }
  } catch (error) {
    console.error('Error in DELETE /products:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});



module.exports = router;