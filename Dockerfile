# Use Node.js base image
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Copy environment variables
COPY .env ./.env

# Build TypeScript
RUN npm run build

# Start server with Nodemon
CMD ["npm", "run", "dev"]
