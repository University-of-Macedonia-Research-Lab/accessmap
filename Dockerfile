FROM node:22-alpine AS base

WORKDIR /app

# better-sqlite3 needs build tools to compile its native binding
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
