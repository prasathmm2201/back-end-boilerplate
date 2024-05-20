# Use a base image from Docker Hub
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose a port (if your application listens on a specific port)
# EXPOSE 3000

# Define a default command to run when the container starts
CMD ["npm", "start"]
