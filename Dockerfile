### STAGE 1: Build ###
FROM node:24-alpine3.22 as build

ARG CM_NPM_TOKEN
ARG BITBUCKET_BUILD_NUMBER
ARG BITBUCKET_COMMIT
ARG SANITY_STUDIO_PROJECT_ID
ARG SANITY_STUDIO_DATASET
ARG SANITY_STUDIO_API_VERSION

# Set environment variables
ENV FLOWMATE_ENABLED=false
ENV ENVIRONMENT=${ENVIRONMENT}
ENV SANITY_STUDIO_PROJECT_ID=${SANITY_STUDIO_PROJECT_ID}
ENV SANITY_STUDIO_DATASET=${SANITY_STUDIO_DATASET}
ENV SANITY_STUDIO_API_VERSION=${SANITY_STUDIO_API_VERSION}

WORKDIR /app

# Copy the entire workspace
COPY . /app

# Install pnpm globally
RUN npm install -g pnpm

# Create npmrc for private packages
RUN echo "//registry.npmjs.org/:_authToken=${CM_NPM_TOKEN}" > /app/.npmrc

# Install dependencies and build the web app
RUN apk update && \
    apk upgrade && \
    apk add --no-cache git openssh && \
    pnpm install --frozen-lockfile && \
    pnpm --filter checkmate-sanity-nuxt build

### STAGE 2: App setup ###
FROM node:24-alpine3.22

ARG BITBUCKET_BUILD_NUMBER
ARG BITBUCKET_COMMIT

ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}

# Set work dir
WORKDIR /app

# Copy the built web app and necessary files
COPY --from=build /app/apps/web/.output /app/.output
COPY --from=build /app/apps/web/package.json /app/package.json
COPY --from=build /app/apps/web/nuxt.config.ts /app/nuxt.config.ts
COPY --from=build /app/apps/web/tailwind.config.js /app/tailwind.config.js
COPY --from=build /app/apps/web/tsconfig.json /app/tsconfig.json

# Copy studio schema files that the web app might reference
COPY --from=build /app/apps/studio/schemaTypes /app/schemaTypes
COPY --from=build /app/apps/studio/sanity.config.ts /app/sanity.config.ts
COPY --from=build /app/apps/studio/sanity.cli.ts /app/sanity.cli.ts

# Copy workspace configuration
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-lock.yaml

# Copy environment file if it exists
# COPY ./.env* /app/ 2>/dev/null || true

# Install only production dependencies for the web app
RUN npm install -g pnpm && \
    pnpm install --prod --filter checkmate-sanity-nuxt --frozen-lockfile

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001 -G nodejs

# Set environment variables for Nuxt
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    BITBUCKET_BUILD_NUMBER="${BITBUCKET_BUILD_NUMBER}" \
    BITBUCKET_COMMIT="${BITBUCKET_COMMIT}" \
    NODE_OPTIONS=--max_old_space_size=478

# Change ownership of the app directory to the nuxt user
RUN chown -R nuxt:nodejs /app

EXPOSE 3000

# Switch to non-root user
USER nuxt

# Start the Nuxt application
CMD ["node", ".output/server/index.mjs"]