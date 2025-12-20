# Use Node.js official image
FROM node:18-alpine

# Create app directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose port (use your app's port)
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
