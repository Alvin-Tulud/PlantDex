//import dotenv from "dotenv";
import mysql from "mysql2";

// Returns query from database
// (currently prints instead of returning anything, will change later)
export async function queryTable(query, values)
{
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    connection.addListener('error', (err) => {
      if (err instanceof Error) {
        console.log(`createConnection error:`, err);
      }
    });

    // Query the db
    // values should be an [array], I think something breaks otherwise
    const result = await connection.promise().query(query, values);
    console.log(result[0]);
    console.log("Finished query");
    return(result[0]);
  } catch (err) {
    console.error("Error querying db:", err.message);
  } finally {
    if (connection) {
      await connection.end();  // Close the connection
      console.log("Connection closed");
    }
  }
}
//queryTable("SELECT * FROM plant WHERE fk_user_id = ? ORDER BY addition_date DESC", [1]);



// Updates table
// (Are we supposed to return anything?)
export async function updateTable(query, values)
{
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    connection.addListener('error', (err) => {
      if (err instanceof Error) {
        console.log(`createConnection error:`, err);
      }
    });

    // Modify the db
    // values should be an [array], I think something breaks otherwise
    const result = await connection.execute(query, values);
    console.log("Finished executing - check for error logs");
    return result;
  } catch (err) {
    console.error("Error modifying db:", err.message);
  } finally {
    if (connection) {
      await connection.end();  // Close the connection
      console.log("Connection closed");
    }
  }
}
//updateTable("INSERT INTO user (username) VALUES (?)", ["testuser128"]);