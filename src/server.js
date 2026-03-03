const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files from html directory
app.use(express.static(path.join(__dirname, '../html')));

const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pgPool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'postgres',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
});

// Redis client
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
});

// Connect to Redis on startup
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err.message);
  }
})();

// Endpoint 1: Return success running info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    app_name: process.env.APP_NAME || 'demo-server',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint 2: Read test data from PostgreSQL
app.get('/api/postgres', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT id, title, description, created_at FROM demo ORDER BY id LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No demo data found in database',
      });
    }
    res.json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// Endpoint 3: Write test data to Redis
app.post('/api/redis', async (req, res) => {
  try {
    const testKey = 'demo:test';
    const testValue = `Hello from Redis - ${new Date().toISOString()}`;
    await redisClient.set(testKey, testValue, { EX: 3600 });
    res.json({
      status: 'success',
      data: {
        key: testKey,
        value: testValue,
        ttl: 3600,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// Endpoint 4: Read test data from Redis
app.get('/api/redis', async (req, res) => {
  try {
    const testKey = 'demo:test';
    const value = await redisClient.get(testKey);
    if (!value) {
      return res.status(404).json({
        status: 'error',
        message: 'No data found in Redis',
      });
    }
    res.json({
      status: 'success',
      data: {
        key: testKey,
        value: value,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// Endpoint 5: Test external network access
app.get('/api/external', async (req, res) => {
  try {
    const response = await fetch('https://httpbin.org/get');
    const data = await response.json();
    res.json({
      status: 'success',
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET  /api/health    - Server health check`);
  console.log(`  GET  /api/postgres  - PostgreSQL test data`);
  console.log(`  POST /api/redis     - Write data to Redis`);
  console.log(`  GET  /api/redis     - Read data from Redis`);
  console.log(`  GET  /api/external  - Test external network access`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pgPool.end();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await pgPool.end();
  await redisClient.quit();
  process.exit(0);
});
