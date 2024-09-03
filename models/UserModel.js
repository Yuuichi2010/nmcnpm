const sql = require('mssql');
const config = require('../dbconfig');

class UserModel {

  static async getAllUsers({ search, filter, sort }) {
    try {
      await sql.connect(config);
      let query = 'SELECT * FROM users';

      // Thêm điều kiện tìm kiếm nếu có
      if (search) {
        query += ` WHERE username LIKE '%${search}%' OR email LIKE '%${search}%'`;
      }

      // Thêm điều kiện lọc nếu có
      if (filter) {
        query += ` WHERE role = '${filter}'`;
      }

      // Thêm điều kiện sắp xếp nếu có
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

  static async getUserById(userId) {
    try {
      await sql.connect(config);

      const result = await sql.query`SELECT * FROM users WHERE id = ${userId}`;
      return result.recordset[0];
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }

  static async addUser(userData) {
    try {
      await sql.connect(config);

      const result = await sql.query`
        INSERT INTO users (username, email, password, role)
        VALUES (${userData.username}, ${userData.email}, ${userData.password}, ${userData.role})
      `;

      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }

  static async updateUser(userId, updatedUserData) {
    try {
      await sql.connect(config);

      // Xây dựng câu truy vấn UPDATE dựa trên thông tin cập nhật
      let updateQuery = 'UPDATE users SET';
      Object.entries(updatedUserData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateQuery += ` ${key} = '${value}',`;
        }
      });

      updateQuery = updateQuery.slice(0, -1);
      updateQuery += ` WHERE id = ${userId}`;

      const result = await sql.query(updateQuery);
      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }

  static async deleteUser(userId) {
    try {
      await sql.connect(config);

      const result = await sql.query`DELETE FROM users WHERE id = ${userId}`;
      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }
}

module.exports = UserModel;
