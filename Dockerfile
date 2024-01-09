# syntax=docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.0.0
FROM node:${NODE_VERSION}-slim as base

RUN npm i -g pnpm@8.14.0

RUN corepack enable
COPY . /app
WORKDIR /app

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python pkg-config build-essential 

RUN pnpm add -g pnpm
# Throw-away build stage to reduce size of final image
FROM base AS prod-deps
ENV NODE_ENV=production
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public

# Start the server by default, this can be overwritten at runtime
CMD [ "pnpm", "start" ]
