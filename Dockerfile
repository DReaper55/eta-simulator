# Step 1: Use the official Node.js image as a base
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app's code
COPY . .

# Step 6: Build the project
RUN npm run build

# Step 7: Use a lightweight server to serve the build
# If you're using a server like serve
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Step 8: Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]
