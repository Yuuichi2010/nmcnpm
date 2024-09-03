const express = require('express');
const router = express.Router();
const OrderModel = require('../models/OrderModel');

router.get('/all', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const { status, search } = req.query;
      console.log('status:', status);
      console.log('search:', search);
      const orders = await OrderModel.getAllOrders(status, search);
      res.json(orders);
    }
    else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.get('/:OrderID', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const OrderID = req.params.OrderID;
      const orders = await OrderModel.getOrderByID(OrderID);
      res.json(orders);
    }
    else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/complete', async (req, res) => {
  try {
    const orderId = req.body.orderId;
    console.log('orderId:', orderId);
    const newStatus = 'Completed';

    const rowsAffected = await OrderModel.updateOrderStatus(orderId, newStatus);

    if (rowsAffected > 0) {
      res.status(200).json({ success: true, message: 'Order marked as completed successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Order not found or could not be marked as completed.' });
    }
  } catch (error) {
    console.error('Error in /complete:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.get('/filter', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const status = req.query.status;
      const filteredOrders = await OrderModel.getOrdersByStatus(status);
      res.json(filteredOrders);
    }
    else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const query = req.query.query;
      const searchResults = await OrderModel.getOrdersBySearch(query);
      res.json(searchResults);
    }
    else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/updateStatus', async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const selectedStatus = req.body.selectedStatus;

    const rowsAffected = await OrderModel.updateOrderStatus(orderId, selectedStatus);

    if (rowsAffected > 0) {
      res.status(200).json({ success: true, message: 'Order status updated successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Order not found or could not update status.' });
    }
  } catch (error) {
    console.error('Error in /update-status:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});


module.exports = router;