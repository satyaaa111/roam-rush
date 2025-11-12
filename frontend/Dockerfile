# --- STAGE 1: The "Builder" ---
FROM node:20 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- THIS IS THE FIX ---
# We are REMOVING the "ARG" and the "API_BASE_URL=" prefix.
# We are just running a standard, clean build.
# The "npm run build" in your CI file will still work
# because it uses the "env:" block, which is correct.
RUN npm run build
# -----------------------

# --- STAGE 2: The "Runner" ---
FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --chown=nextjs:nodejs package*.json ./
RUN chown -R nextjs:nodejs /app
USER nextjs
RUN npm install --omit=dev

# Copy the *clean, built* code from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]