const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './.env' });

async function setupDatabase() {
  let connection;
  try {
    // Connect to MySQL server (without specifying a database yet)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      multipleStatements: true // Enable multiple statements execution
    });

    

    console.log('✓ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'learn_your_way';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database '${dbName}' ready`);

    // Select the database
    await connection.execute(`USE ${dbName}`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      await connection.execute(statement);
    }

    console.log(`✓ Schema applied successfully to '${dbName}'`);
  } catch (error) {
    console.error('✗ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
