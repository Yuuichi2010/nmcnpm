const sql = require("mssql");
const config = require("../dbconfig");
const tbName = "productfeedbacks";

sql.on("error", (err) => {
    throw err;
});

module.exports = class Feedback {
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
    static async getFeedbacks(ProductID) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(`
            SELECT  pf.Feedback, pf.Rating, u.Photo, u.Name
            FROM    productfeedbacks pf, users u
            WHERE   pf.ProductID = ${ProductID} AND
                    pf.UserID = u.UserID
            `);
            await sql.close();
            return rs.recordset;
        } catch (err) {
            console.error("Error:", 0);
            throw err;
        }
    }
    static async getCountStars(ProductID) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(`
            SELECT
                r.Rating,
                COALESCE(COUNT(pf.Rating), 0) AS Num,
                (SELECT COUNT(*) FROM productfeedbacks WHERE ProductID = ${ProductID}) AS TotalNum
            FROM
                (VALUES (1), (2), (3), (4), (5)) r(Rating)
            LEFT JOIN
                productfeedbacks pf ON r.Rating = pf.Rating AND pf.ProductID = ${ProductID}
            GROUP BY
                r.Rating
            ORDER BY
                r.Rating DESC;
            `);
            await sql.close();
            return rs.recordset;
        } catch (err) {
            console.error("Error:", 0);
            throw err;
        }
    }
    static async addFeedback(FeedbackID, ProductID, UserID, Feedback, Rating) {
        try {
            let pool = await sql.connect(config);
            await pool.query(`
                INSERT INTO productfeedbacks (ProductID, UserID, Feedback, Rating)
                VALUES (${ProductID}, '${UserID}', '${Feedback}', '${Rating}');
            `);
            await sql.close();
        } catch (err) {
            console.error("Error:", 0);
            throw err;
        }
    }
};