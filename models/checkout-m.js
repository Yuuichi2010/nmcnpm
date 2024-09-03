const sql = require("mssql");
const config = require("../dbconfig");
const tbName1 = "orders";
const tbName2 = "orderdetails";

sql.on("error", (err) => {
    throw err;
});

module.exports = class orders {
    constructor(OrderID, CreateTime, Status, TotalPrice, BuyerID){
        this.OrderID = OrderID;
        this.CreateTime = CreateTime;
        this.Status = Status;
        this.TotalPrice = TotalPrice;
        this.BuyerID = BuyerID;
    }

    static async getID(){
        try {
            let pool = await sql.connect(config);
            let orderID = await pool.query(
                `SELECT COUNT(*) as a FROM orders`
            );
            orderID = orderID.recordset[0].a;
            await sql.close();
            return orderID;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }

    static async CreateNewOrder(BuyerID) {
        try {
            let pool = await sql.connect(config);
            // Insert a new order without specifying OrderID (let SQL Server manage it)
            await pool.query(
                `INSERT INTO orders (CreateTime, Status, TotalPrice, BuyerID) VALUES (null, 'Processing', null, ${BuyerID});
                SELECT SCOPE_IDENTITY() as NewOrderID;`
            );
            await sql.close();
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }
    
    static async purchase(OrderID, BuyerID, bookArrayJSON, formattedDate, TotalPrice){
        try{
            let pool = await sql.connect(config);
            await pool.query(
                `UPDATE orders SET TotalPrice = ${TotalPrice} WHERE OrderID = ${OrderID}`
            );  
            await pool.query(
                `UPDATE orders SET CreateTime = '${formattedDate}' WHERE OrderID = ${OrderID}`
            );

            bookArrayJSON = JSON.parse(bookArrayJSON);
            OrderID = parseInt(OrderID);

            // Insert into orderdetails with the generated OrderID
            for(let i = 0; i < bookArrayJSON.length; i++){
                await pool.query(
                    `INSERT INTO orderdetails (OrderID, ProductID, Quantity) 
                    VALUES (${OrderID}, ${bookArrayJSON[i].ProductID}, ${bookArrayJSON[i].Quantity})`
                );

                // Xoá giỏ hàng
                await pool.query(
                    `DELETE FROM cartdetails WHERE BuyerID = ${BuyerID} AND ProductID = ${bookArrayJSON[i].ProductID}`
                );

                // Cập nhật warehouse
                await pool.query(
                    `UPDATE products SET Quantity = ${bookArrayJSON[i].Instock} - ${bookArrayJSON[i].Quantity} WHERE ProductID = ${bookArrayJSON[i].ProductID}`
                );
            }

            await sql.close();
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }
    static async getMonthlyOrders(selectedYear) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(
                `SELECT MONTH(O.CreateTime) as month,SUM((od.Quantity * pd.PriceIn)) as TotalIn, SUM((od.Quantity * pd.PriceOut)) as TotalOut
                FROM orders o, orderdetails od, products pd
                WHERE o.OrderID = od.OrderID
                    and od.ProductID = pd.ProductID
                    and o.Status = 'Completed'
                    and YEAR(O.CreateTime) = ${selectedYear}
                GROUP BY MONTH(O.CreateTime)`
            );
            await sql.close();
            return rs.recordset;
        } catch (err) {
            throw err;
        }
    }
    static async getDailyOrders(selectedYear,seletectedMonth) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(
                `SELECT DAY(O.CreateTime) as day,SUM((od.Quantity * pd.PriceIn)) as TotalIn, SUM((od.Quantity * pd.PriceOut)) as TotalOut
                FROM orders o, orderdetails od, products pd
                WHERE o.OrderID = od.OrderID
                    and od.ProductID = pd.ProductID
                    and o.Status = 'Completed'
                    and YEAR(O.CreateTime) = ${selectedYear}
                    and MONTH(O.CreateTime) = ${seletectedMonth}
                GROUP BY DAY(O.CreateTime)`
            );
            await sql.close();
            return rs.recordset;
        } catch (err) {
            throw err;
        }
    }
}