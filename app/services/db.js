

// Returns query from database
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export function queryTable(query, values) {
  return pool.execute(query, values)
    .then(([rows]) => {
      console.log("Finished query");
      return rows;
    });
}

export function updateTable(query, values) {
  return pool.execute(query, values)
    .then(([result]) => {
      console.log("Finished executing INSERT");
      return result;
    });
}
