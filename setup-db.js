const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password'
  });

  connection.connect((err) => {
    if (err) {
      console.error('✗ Connection failed:', err.message);
      process.exit(1);
    }
    console.log('✓ Connected to MySQL server');

    // Create database
    const dbName = process.env.DB_NAME || 'learn_your_way';
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
      if (err) {
        console.error('✗ Error creating database:', err.message);
        connection.end();
        process.exit(1);
      }
      console.log(`✓ Database '${dbName}' ready`);

      // Use the database
      connection.query(`USE ${dbName}`, (err) => {
        if (err) {
          console.error('✗ Error selecting database:', err.message);
          connection.end();
          process.exit(1);
        }

        // Read schema file
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        let schema = fs.readFileSync(schemaPath, 'utf8');

        // Remove comments and split statements
        schema = schema
          .split('\n')
          .filter(line => !line.trim().startsWith('--'))
          .join('\n');

        const statements = schema.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);

        console.log(`\nExecuting ${statements.length} SQL statements...\n`);

        let completed = 0;

        // Execute statements sequentially
        const executeNext = (index) => {
          if (index >= statements.length) {
            console.log(`\n✓ Schema applied successfully to '${dbName}'`);
            connection.end();
            process.exit(0);
            return;
          }

          connection.query(statements[index], (err) => {
            completed++;
            if (err) {
              if (err.message.includes('Duplicate')) {
                console.log(`[${completed}/${statements.length}] ⚠ (Already exists)`);
              } else {
                console.error(`✗ Error at statement ${completed}:`, err.message);
                connection.end();
                process.exit(1);
              }
            } else {
              console.log(`[${completed}/${statements.length}] ✓`);
            }
            executeNext(index + 1);
          });
        };

        executeNext(0);
      });
    });
  });
}

setupDatabase();
