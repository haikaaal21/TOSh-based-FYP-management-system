# Use a Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose ports (if needed, adjust based on your application requirements)
EXPOSE 4000 8080

# Install PM2 globally
RUN npm install pm2 -g

# Use PM2 to start your application (assuming 'app.js' is your entry point)
CMD ["pm2-runtime", "app.js"]
