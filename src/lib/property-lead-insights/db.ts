import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

export async function getDbConnection() {
  if (connection) {
    return connection;
  }

  connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'gold',
  });

  return connection;
}

export async function closeDbConnection() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}
