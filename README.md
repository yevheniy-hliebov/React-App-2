# Monorepo with Dockerized production
This is a monorepo setup for a full-stack development environment using Docker. It consists of an API built with NestJS and Prisma ORM, and a client application built with Vite, React.js, TypeScript, and TailwindCSS. PostgreSQL is used as the database, and the entire setup is containerized with Docker.

## Installation

```bash
$ npm install
```

## Setting up Environment Variables
Create a `.env` file in `./apps/api/` directory based on the provided `.env.example`. Make sure to remove the `.example` extension and update the values as necessary before running the application. 

File: `./apps/api/.env`:

```dotenv
POSTGRES_USER=prisma
POSTGRES_PASSWORD=topsecret
POSTGRES_DB=cats

DB_CONTAINER=postgresprisma
DB_CONTAINER_PORT=5432
DB_HOST=localhost
DB_PORT=3080

# When running Nest in Docker container
#DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_CONTAINER}:${DB_CONTAINER_PORT}/${POSTGRES_DB}?schema=public

# When running Nest locally
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=public
```
Make sure the environment variables in the .env file match your Docker setup or local development environment.

## Start the db container in docker before running the application
Before running the application, make sure to start the PostgreSQL database container in Docker and perform migrations and seeding.
```bash
# Start the PostgreSQL container
$ npm run db

# Run migrations to create tables
$ npm run migrate

# Seed data to the database if tables are empty
$ npm run seed

# Or run migrations and seeding in one command
$ npm run migrate:seed
```


## Running the application
```bash
# Run the application in development watch mode
$ npm run dev

# Build the application
$ npm run build

# Start the application in production mode
$ npm run start
```
**Development links:**
- React client: [https://localhost:5173](https://localhost:5173)  
- Nest api: [https://localhost:3000/api](https://localhost:3000/api) 

**Production links:** 
- React client: [https://localhost:3000](https://localhost:3000)  
- Nest api: [https://localhost:3000/api](https://localhost:3000/api)  


## Running a Dockerized Application

```bash
# Create containers and run the application
$ npm run docker

# Shutdown Docker containers
$ npm run docker:down

# Remove Docker containers and volumes
$ npm run docker:rm
```

**Dockerized Production links:** 
- React client: [https://localhost:3000](https://localhost:3000)  
- Nest api: [https://localhost:3000/api](https://localhost:3000/api)

## Additional Scripts:
- `docker:down`: Stops Docker containers.
- `docker:rm`: Stops Docker containers and removes associated volumes.
- `db:down`: Stops the PostgreSQL container.
- `db:down-v`: Stops the PostgreSQL container and removes associated volumes.