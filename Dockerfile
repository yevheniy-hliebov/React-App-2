FROM node:20.11.0 AS builder

# Create app/client directory
WORKDIR /app/client


COPY ./apps/client/package.json .

# Install app dependencies
RUN npm install

# Copy files from client
COPY ./apps/client .

# Build vite react
RUN npm run build

FROM node:20.11.0

COPY --from=builder /app/client/node_modules ./client/node_modules
COPY --from=builder /app/client/package*.json ./client/
COPY --from=builder /app/client/dist ./client/dist

# Create app directory
WORKDIR /app

COPY ./apps/api/package.json ./
COPY ./apps/api/prisma ./prisma/

# Install app dependencies
RUN npm install

# Copy files from api
COPY ./apps/api .

# Build nest api
RUN npm run build

EXPOSE 3000
# new migrate and start app script
CMD [  "npm", "run", "prod:migrate:seed" ]