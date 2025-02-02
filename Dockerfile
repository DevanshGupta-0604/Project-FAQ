# Use the official Node.js image from the Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install all dependencies (production and dev)
RUN npm install --production

# Copy the rest of the application files into the container
COPY . .

# Expose the port the app will run on
EXPOSE 8000

# Set environment variables for Google Cloud Translate API, Redis URI, and MongoDB URI
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
ENV REDIS_URI=your_redis_uri_here
ENV MONGODB_URI=mongodb://mongo:27017/your-db-name
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
