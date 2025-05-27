# Stage 1: Install dependencies
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; fi

# Stage 2: Build the app
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Production image
FROM node:22-alpine AS runner

WORKDIR /app

# Add a non-root user (optional, safer)
RUN addgroup -g 1001 nextjs \
  && adduser -D -u 1001 -G nextjs nextjs

# Copy built app from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public


# Fix permissions
RUN mkdir -p /app/.next/cache/images \
  && chown -R nextjs:nextjs /app \
  && chmod -R 777 /app/.next

# Run as non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
