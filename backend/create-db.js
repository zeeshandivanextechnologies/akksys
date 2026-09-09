import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: 'postgres', // Connect to default db first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'akksys'`);
    if (res.rowCount === 0) {
      console.log('Database "akksys" not found, creating it...');
      await client.query('CREATE DATABASE akksys');
      console.log('Database "akksys" created successfully!');
    } else {
      console.log('Database "akksys" already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase();
