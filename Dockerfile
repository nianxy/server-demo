FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for migrations)
RUN npm install

# Copy application code
COPY src/ ./src/
COPY html/ ./html/
COPY migrations/ ./migrations/
COPY database.json ./

# Expose port
EXPOSE 3000

# Run migrations and start the server
CMD npm run migrate && npm start
