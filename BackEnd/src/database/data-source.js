import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

dotenv.config()
// const pool = mysql.createPool({
  
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 4,
//   queueLimit: 0
// });

// export default pool;
  

  const pool = mysql.createPool({
    
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bd_tcc',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
export default pool;
  