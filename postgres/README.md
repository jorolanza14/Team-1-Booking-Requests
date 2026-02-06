# PostgreSQL Database Setup

This directory contains the Docker Compose configuration to run PostgreSQL for the Diocese project.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually bundled with Docker Desktop)

## Quick Start

To start the PostgreSQL database:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the following configuration:
- Database name: `diocese_db_dev`
- Username: `postgres`
- Password: `postgres`
- Port: `5433` (to avoid conflicts with existing PostgreSQL installations)

## Stopping the Database

To stop the database:

```bash
docker-compose down
```

## Connecting to the Database

The database can be accessed at:
- Host: `localhost`
- Port: `5433` (mapped from container port 5432)
- Database: `diocese_db_dev`
- Username: `postgres`
- Password: `postgres`

## Environment Variables

When running the backend application, make sure to configure the following environment variables:

```bash
DB_HOST=localhost
DB_PORT=5433
DB_NAME=diocese_db_dev
DB_USER=postgres
DB_PASSWORD=postgres
```

## Persistent Data

The database data is stored in a Docker volume named `postgres_data`, which persists between container restarts. To completely remove the data, run:

```bash
docker-compose down -v
```

## Troubleshooting

### Port Already in Use
If you get an error about port 5433 being in use, you can modify the docker-compose.yml file to use a different host port.

### Database Connection Issues
- Verify the container is running: `docker ps`
- Check the container logs: `docker logs diocese-postgres`
- Ensure your backend application is configured with the correct database credentials