const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

// Lấy tất cả người dùng, có thể tìm kiếm, lọc, và sắp xếp
router.get('/all', async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const { search, filter, sort } = req.query;
      const users = await UserModel.getAllUsers({ search, filter, sort });
      res.json(users);
    } else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Lấy thông tin người dùng theo ID
router.get('/:userId', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const userId = req.params.userId;
      const user = await UserModel.getUserById(userId);

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ success: false, message: 'User not found.' });
      }
    } else {
      res.redirect("/account/login");
    }
  } catch (error) {
    console.error(`Error fetching user data: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Thêm người dùng mới
router.post('/add', async (req, res) => {
  try {
    const userData = req.body;
    const rowsAffected = await UserModel.addUser(userData);

    if (rowsAffected > 0) {
      res.status(201).json({ success: true, message: 'User added successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to add user.' });
    }
  } catch (error) {
    console.error('Error in POST /add:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Cập nhật thông tin người dùng
router.put('/update/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    const rowsAffected = await UserModel.updateUser(userId, updatedUserData);

    if (rowsAffected > 0) {
      res.status(200).json({ success: true, message: 'User updated successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'User not found or could not be updated.' });
    }
  } catch (error) {
    console.error('Error in PUT /update:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Xóa người dùng
router.delete('/delete/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const rowsAffected = await UserModel.deleteUser(userId);

    if (rowsAffected > 0) {
      res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'User not found or could not be deleted.' });
    }
  } catch (error) {
    console.error('Error in DELETE /delete:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
