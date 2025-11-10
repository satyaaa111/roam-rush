# --- STAGE 1: The "Builder" ---
# This stage installs dependencies and builds the Next.js app
FROM node:20 as builder

# Set the working directory
WORKDIR /app


ARG API_BASE_URL

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Run the production build
RUN API_BASE_URL=${API_BASE_URL} npm run build


# --- STAGE 2: The "Runner" ---
# This stage builds the final, small production image
FROM node:20-alpine

WORKDIR /app

# We don't want to run as the 'root' user (better security)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy package.json *as the root user* first
COPY --chown=nextjs:nodejs package*.json ./

# --- THIS IS THE FIX ---
# We must change ownership of the /app directory itself
# so the 'nextjs' user can create the 'node_modules' folder.
RUN chown -R nextjs:nodejs /app
# -----------------------

# NOW we switch to the non-root user
USER nextjs

# This will now work, because 'nextjs' user owns /app
RUN npm install --omit=dev

# Copy the built app from the "builder" stage
# We can't use --chown here because we are no longer root,
# but it's fine because we already own the /app directory.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# The command to start the app
CMD ["npm", "start"]