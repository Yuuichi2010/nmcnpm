var config = {
  server: "localhost",
  port : 1433,
  database: process.env.DB_NAME, 
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  options: {
    enableArithAbort : true, 
    trustServerCertificate: true,
  },
  connectionTimeout: 150000, 
  pool: 
  { max : 10, min : 0, idleTimeoutMillis : 30000, },
  
};

module.exports = config; 