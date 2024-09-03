const sql = require("mssql");
const config = require("../dbconfig");
const fs = require('fs');
const { join } = require('path');

sql.on("error", (err) => {
    throw err;
});


module.exports = class Account {
    constructor(Name, UserName, Photo, Pass, Email, Phone, Gender, DateOfBirth, Address, LockAccount) {
        this.Name = Name;
        this.UserName = UserName;
        this.Photo = Photo;
        this.Pass = Pass;
        this.Email = Email;
        this.Phone = Phone;
        this.Gender = Gender
        this.DateOfBirth = DateOfBirth;
        this.Address = Address;
        this.LockAccount = LockAccount;
    }
    static async get(un) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(
                `SELECT * FROM users WHERE UserName='${un}'`
            );
            await sql.close();
            return rs.recordset[0];
        }
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    static async add(acc) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query(
                `INSERT INTO users (Name, UserName, Photo, Pass, Email,
                    Phone, Gender, DateOfBirth, Address, LockAccount)
                VALUES ('${acc.Name}', '${acc.UserName}', '${acc.Photo}', '${acc.Pass}', '${acc.Email}',
                '${acc.Phone}', '${acc.Gender}', '${acc.DateOfBirth}', '${acc.Address}' , '${acc.LockAccount}')`
            );
            // console.log(rs);
            await sql.close();
            return 1;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }
    static async updateProfile(obj, un) {
        try {
            console.log(obj.Name);
            let pool = await sql.connect(config);
            let rs = await pool.query(
                `UPDATE users
            SET Name = '${obj.Name}',
              Gender = '${obj.Gender}',
              DateOfBirth = '${obj.DateOfBirth}', 
              Address = '${obj.Address}'
            WHERE UserName = '${un}'`
            );
            // console.log(rs);
            await sql.close();
            return 1;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }
    static async updatePass(pass, un) {
        try {
            let pool = await sql.connect(config);
            let rs = await pool.query( 
                `UPDATE users SET Pass = '${pass}' WHERE UserName = '${un}'`
            );
            await sql.close();
            return 1;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }
    static async changeAvatar(Photo, un) {
        try {
            let pool = await sql.connect(config);
            let p =  await pool.query( 
                `SELECT Photo FROM users WHERE UserName = '${un}'`
            );
            let dirPath = join(__dirname, `../${p.recordset[0].Photo}` );
            fs.unlink(dirPath, function (err) {
                if (err) console.log('delete file failed!');
                else console.log('File deleted!');
            });
            
            await pool.query( 
                `UPDATE users SET Photo = '${Photo}' WHERE UserName = '${un}'`
            );
            await sql.close();
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
    }
}