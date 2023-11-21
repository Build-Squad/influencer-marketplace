# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /ui

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Install Next.js globally
RUN npm install -g next

# Copy the local code to the container
COPY . .

# Expose the port that Next.js will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
