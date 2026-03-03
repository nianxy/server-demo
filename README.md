# Demo Server

A minimal Node.js + Express server for testing PostgreSQL and Redis connectivity.

## Features

- 🚀 Simple HTTP server with Express
- 📊 PostgreSQL integration with auto migrations
- 💾 Redis read/write operations
- 🧪 Built-in HTML test page
- 🐳 Docker support

## Quick Start

### 1. Clone and Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
vim .env

# Install dependencies
npm install
```

### 2. Run Locally

```bash
# Start server (auto-runs database migrations)
./start.sh
```

### 3. Run with Docker

```bash
# Build image
./build.sh

# Run container
docker run -d --name demo-server \
  -p 3000:3000 \
  --env-file .env \
  nianxy/demo-server:latest
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | HTML test page |
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/postgres` | Read demo data from PostgreSQL |
| `POST` | `/api/redis` | Write data to Redis |
| `GET` | `/api/redis` | Read data from Redis |
| `GET` | `/api/external` | Test external network access (httpbin.org) |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server
PORT=3000

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=postgres
PG_USER=postgres
PG_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## Project Structure

```
server-demo/
├── src/
│   └── server.js          # Main server code
├── html/
│   └── index.html         # API test page
├── migrations/
│   └── 20260303151400-create-demo-table.js  # Database migration
├── .env.example           # Environment template
├── .gitignore
├── database.json          # db-migrate config
├── Dockerfile
├── package.json
├── start.sh               # Local startup script
└── build.sh               # Docker build script
```

## Scripts

```bash
# Start server with migrations
./start.sh

# Run migrations only
npm run migrate

# Reset database (drops and recreates tables)
npm run migrate:reset

# Build Docker image
./build.sh
```

## Testing

1. Start the server: `./start.sh`
2. Open browser: `http://localhost:3000`
3. Click buttons to test each endpoint

Or use curl:

```bash
# Health check
curl http://localhost:3000/api/health

# PostgreSQL test
curl http://localhost:3000/api/postgres

# Redis write
curl -X POST http://localhost:3000/api/redis

# Redis read
curl http://localhost:3000/api/redis

# External network test
curl http://localhost:3000/api/external
```

## Database Schema

The migration creates a `demo` table:

```sql
CREATE TABLE demo (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## License

MIT
