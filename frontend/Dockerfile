# Build stage
FROM node:22.11.0-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Set environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy only the package.json and yarn.lock files first
COPY package.json ./

# Install the dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=builder /app/build /usr/share/nginx/html

# Copy the nginx configuration file to the container
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]