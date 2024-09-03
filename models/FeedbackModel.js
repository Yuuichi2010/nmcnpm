// models/FeedbackModel.js

const sql = require('mssql');
const config = require('../dbconfig');

class FeedbackModel {
  static async getAllFeedback({ search, sort }) {
    try {
      await sql.connect(config);
      let query = `
        SELECT f.FeedbackID, f.Feedback, f.Rating, p.ProductName, u.UserName 
        FROM productfeedbacks f
        JOIN products p ON f.ProductID = p.ProductID
        JOIN users u ON f.UserID = u.UserID
      `;

      if (search) {
        query += ` WHERE f.Feedback LIKE '%${search}%' OR u.UserName LIKE '%${search}%' OR p.ProductName LIKE '%${search}%'`;
      }

      if (sort) {
        query += ` ORDER BY ${sort}`;
      }

      const result = await sql.query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }

  static async deleteFeedback(feedbackId) {
    try {
      await sql.connect(config);
      const result = await sql.query`DELETE FROM productfeedbacks WHERE FeedbackID = ${feedbackId}`;
      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }

  static async markFeedbackAsResolved(feedbackId) {
    try {
      await sql.connect(config);
      const result = await sql.query`UPDATE productfeedbacks SET Resolved = 1 WHERE FeedbackID = ${feedbackId}`;
      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }
}

module.exports = FeedbackModel;
