# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

#Install Angular Cli
RUN npm install -g @angular/cli

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 4200
 
# Run the application.
CMD npm start

