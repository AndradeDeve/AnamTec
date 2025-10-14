import mysql from 'mysql2/promise';
import dotenv from 'dotenv'

dotenv.config()

// Banco em nuvem

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 3,
//   enableKeepAlive: true,
//   queueLimit: 0
// });

// export default pool;
  
// Banco local

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
