const sql = require('mssql');
const config = require('../dbconfig');


class WarehouseModel {

  static async getAllProduct({ search, filter, sort }) {
    try {
      await sql.connect(config);
      let query = 'SELECT * FROM products';

      // Thêm điều kiện tìm kiếm nếu có
      if (search) {
        query += ` WHERE ProductName LIKE '%${search}%' OR Author LIKE '%${search}%'`;
      }

      // Thêm điều kiện lọc nếu có
      if (filter) {
        query += ` JOIN category AS c ON products.CateID = c.CateID WHERE c.CateName = N'${filter}'`;
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


  static async getProduct(filter) {
    try {
      await sql.connect(config);
      let query = `SELECT * FROM dbo.products AS p JOIN dbo.category AS c ON p.CateID = c.CateID WHERE CateName = N'${filter}'`;


      const result = await sql.query(query);
      return result.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }

  static async getProductData(productID) {
    try {
      await sql.connect(config);


      const result = await sql.query`SELECT * FROM products WHERE ProductID = ${productID}`;
      return result.recordset;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }

  static async updateProduct(productID, updatedProductData) {
    try {
      await sql.connect(config);

      // Xây dựng câu truy vấn UPDATE dựa trên thông tin cập nhật
      let updateQuery = 'UPDATE products SET';
      Object.entries(updatedProductData).forEach(([key, value]) => {
        // Chỉ thêm vào câu truy vấn nếu giá trị không phải là undefined
        if (value !== undefined) {
          updateQuery += ` ${key} = '${value}',`;
        }
      });

      updateQuery = updateQuery.slice(0, -1);

      updateQuery += ` WHERE ProductID = ${productID}`;

      const result = await sql.query(updateQuery);
      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }


  static async exportProduct(ProductID) {
    try {
      await sql.connect(config);


      const result = await sql.query`UPDATE products SET Status = 'Active' WHERE ProductID = ${ProductID}`;
      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }
  static async deleteProduct(ProductID) {
    try {
      await sql.connect(config);

      const result = await sql.query`DELETE FROM products WHERE ProductID = ${ProductID}`;
      return result.rowsAffected;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await sql.close();
    }
  }



}

module.exports = WarehouseModel;