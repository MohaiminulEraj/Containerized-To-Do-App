FROM node:22.11.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and yarn.lock files first
COPY package.json ./

# Install the dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Serve the app
CMD ["yarn", "start"]

