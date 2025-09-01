import mysql from 'mysql2/promise';

export async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bd_tcc'
  });

  return connection;
  
}