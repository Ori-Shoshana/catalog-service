# Use the official Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your code
COPY . .

# Build the TypeScript code (creates /dist folder)
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]