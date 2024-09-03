const sql = require("mssql");
const config = require("../dbconfig");
const tbName = "orders";

sql.on("error", (err) => {
    throw err;
});

module.exports = class Order {
    constructor(
        FeedbackID,
        ProductID,
        UserID,
        Feedback,
        Rating,
    ) {
        this.FeedbackID = FeedbackID;
        this.ProductID = ProductID;
        this.UserID = UserID;
        this.Feedback = Feedback;
        this.Rating = Rating;
    }
    static async getOrders(BuyerID) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(`
            SELECT  OrderID, Status, TotalPrice
            FROM    orders 
            WHERE   BuyerID = ${BuyerID}
            and CreateTime is not null
            ORDER BY OrderID DESC;
            `);
            await sql.close();
            return rs.recordset;
        } catch (err) {
            console.error("Error:", 0);
            throw err;
        }
    }
    static async getProductList(OrderID) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(`
            SELECT  SUM(od.Quantity) as Quantity, c.CateName, p.ProductName, p.PriceOut, p.Photo, p.ProductID, p.Quantity as Instock
            FROM    orderdetails od, products p, category c
            WHERE   od.OrderID = ${OrderID} AND
                    od.ProductID = p.ProductID AND
                    p.CateID = c.CateID
            GROUP BY
                    od.OrderID, p.ProductID, c.CateName, p.ProductName, p.PriceOut, p.Photo, p.Quantity
            `);
            await sql.close();
            return rs.recordset;
        } catch (err) {
            console.error("Error:", 0);
            throw err;
        }
    }
};