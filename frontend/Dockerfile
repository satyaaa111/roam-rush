# frontend/Dockerfile

# ---- Build Stage ----
FROM node:20-alpine AS base

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

WORKDIR /app

# ✅ Explicitly copy both files (this is the fix!)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build


# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy build output and dependencies
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/package-lock.json ./package-lock.json

# Install dependencies (same as build stage)
RUN npm ci

EXPOSE 3000

CMD ["npm", "start"]