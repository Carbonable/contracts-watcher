# syntax=docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.20.2
FROM node:${NODE_VERSION}-slim as base

# Install pnpm
RUN npm i -g pnpm@9.0.6

# Enable corepack and pin the pnpm it runs (unpinned, each build downloads the newest pnpm release)
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

# Set the SHELL environment variable to bash and run pnpm setup
ENV SHELL=/bin/bash
RUN pnpm setup

# Copy the application files to the container
COPY . /app
WORKDIR /app

# Install build tools and python for native dependencies
RUN apt-get update -qq && \
    apt-get install -y python3 pkg-config build-essential bash

# Install dependencies in a separate layer for the production build
FROM base AS prod-deps
ENV NODE_ENV=production
RUN pnpm install --prod

FROM base AS build
# Install all dependencies and build the app
RUN pnpm install
RUN pnpm run build

FROM base
# Set the production environment
ENV NODE_ENV=production
# Copy necessary files from previous stages
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public

# Start the server by default, this can be overwritten at runtime
CMD [ "pnpm", "start" ]
