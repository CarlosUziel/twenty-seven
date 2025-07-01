# Dockerfile for the Next.js frontend
FROM node:20-slim
WORKDIR /app

# Copy package files and install dependencies
COPY ../../frontend/package.json ../../frontend/package-lock.json ./
RUN npm install

# Copy the entire frontend directory
COPY ../../frontend .

# Set build-time argument for the backend URL
ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

# Build the application
RUN npm run build

# Set production environment
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]
