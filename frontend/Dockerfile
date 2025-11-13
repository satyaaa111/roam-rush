# frontend/Dockerfile
FROM node:20-alpine AS base

# Accept build arg
ARG NEXT_PUBLIC_BACKEND_URL

# Set it as env
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Build with env injected
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "start"]