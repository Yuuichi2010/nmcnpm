// routes_controller/feedback-r.js

const express = require('express');
const router = express.Router();
const FeedbackModel = require('../models/FeedbackModel');

// Lấy tất cả feedback
router.get('/all', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const { search, sort } = req.query;
      const feedbacks = await FeedbackModel.getAllFeedback({ search, sort });
      res.json(feedbacks);
    } else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Xóa feedback
router.delete('/:feedbackId', async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    const result = await FeedbackModel.deleteFeedback(feedbackId);

    if (result > 0) {
      res.status(200).json({ success: true, message: 'Feedback deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Feedback not found or could not be deleted.' });
    }
  } catch (error) {
    console.error('Error in DELETE /feedback:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Đánh dấu feedback là đã xử lý
router.put('/:feedbackId', async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    const result = await FeedbackModel.markFeedbackAsResolved(feedbackId);

    if (result > 0) {
      res.status(200).json({ success: true, message: 'Feedback marked as resolved.' });
    } else {
      res.status(404).json({ success: false, message: 'Feedback not found or could not be updated.' });
    }
  } catch (error) {
    console.error('Error in PUT /feedback:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        res.render('admin/Feedback', {
            title: 'Feedback',
            layout: 'admin',
            mainCss: () => '_css/styleT',
            mainJs: () => '_js/mainT',
            footer: () => 'empty'
        });
    }
    else {
      res.redirect("/account/login");
    }
});


module.exports = router;
