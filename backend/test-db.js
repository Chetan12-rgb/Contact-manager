
const pool = require("./db");

async function testConnection() {
  try {
    const [rows] = await pool.query(
      "SELECT DATABASE() AS database_name, 1 AS test"
    );

    console.log("Database connection successful!");
    console.log(rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
