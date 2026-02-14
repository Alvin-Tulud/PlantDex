import snowflake from "snowflake-sdk";
import dotenv from "dotenv";

dotenv.config();

const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT,
    username: process.env.SNOWFLAKE_USERNAME,
    password: process.env.SNOWFLAKE_PASSWORD,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE
});

export function connectSnowflake() {
    return new Promise((resolve, reject) => {
        connection.connect((err, conn) => {
            if (err) {
                console.error("Unable to connect:", err);
                reject(err);
            } else {
                console.log("✅ Connected to Snowflake");
                resolve(conn);
            }
        });
    });
}

export function query(sql, binds = []) {
    return new Promise((resolve, reject) => {
        connection.execute({
            sqlText: sql,
            binds,
            complete: (err, stmt, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        });
    });
}
