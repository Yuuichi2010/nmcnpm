const sql = require('mssql');
const config = require('../dbconfig');


class OrderModel {
    static async getAllOrders(status, search) {
        try {
            await sql.connect(config);
            const request = new sql.Request();

            let query = 'SELECT o.OrderID, u.Name, u.Email, o.TotalPrice, o.CreateTime, o.Status FROM orders o JOIN users u ON o.BuyerID = u.UserID';

            if (status) {
                query += ' WHERE o.Status = @status';
                request.input('status', sql.NVarChar, status);
            }

            if (search) {
                query += (status ? ' AND ' : ' WHERE ') + '(u.Name LIKE @search OR u.Email LIKE @search)';
                request.input('search', sql.NVarChar, `%${search}%`);
            }



            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await sql.close();
        }
    }


    static async getOrderByID(OrderID) {
        try {
            await sql.connect(config);
            const result = await sql.query`	SELECT
      o.OrderID,
      o.CreateTime,
      u.Name AS BuyerName,
      u.Email AS BuyerEmail,
      o.Status,
      sh.ShipmentDetail,
      u.Address AS BuyerAddress,
      p.ProductName,
      p.Author,
      p.Photo,
      od.Quantity,
      p.PriceOut AS ProductPrice,
      sh.Price AS ShippingFee,
      (p.PriceOut * od.Quantity) AS Subtotal,
      ((p.PriceOut * od.Quantity) + sh.Price) as TotalPrice
  FROM
      orders o
  JOIN
      users u ON o.BuyerID = u.UserID
  JOIN
      shipments sh ON o.OrderID = sh.OrderID
  JOIN
      orderdetails od ON o.OrderID = od.OrderID
  JOIN
      products p ON od.ProductID = p.ProductID
  WHERE
      o.OrderID = ${OrderID};
  
  `;
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await sql.close();
        }
    }

    static async updateOrderStatus(orderId, selectedStatus) {
        try {
            await sql.connect(config);

            const result = await sql.query`UPDATE orders SET Status = ${selectedStatus} WHERE OrderID = ${orderId}`;

            return result.rowsAffected;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await sql.close();
        }
    }



    static async getOrdersByStatus(status) {
        try {
            await sql.connect(config);
            const result = await sql.query`
          SELECT 
              o.OrderID,
              u.Name,
              u.Email,
              o.TotalPrice,
              o.CreateTime,
              o.Status
          FROM 
              orders o
          JOIN 
              users u ON o.BuyerID = u.UserID
          WHERE
              o.Status = ${status};
      `;

            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await sql.close();
        }
    }


    static async getOrdersBySearch(query) {
        try {
            await sql.connect(config);
            console.log('Query:', query);
            const result = await sql.query`
        SELECT 
            o.OrderID,
            u.Name,
            u.Email,
            o.TotalPrice,
            o.CreateTime,
            o.Status
        FROM 
            orders o
        JOIN 
            users u ON o.BuyerID = u.UserID
        WHERE
            u.Name LIKE '%${query}%' OR
            u.Email LIKE '%${query}%';`;
            return result.recordset;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await sql.close();
        }
    }



}

module.exports = OrderModel;