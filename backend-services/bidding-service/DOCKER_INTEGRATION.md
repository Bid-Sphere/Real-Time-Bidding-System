# Bidding Service - Docker Integration

## ✅ Docker Setup Complete

The bidding service is now fully integrated with Docker and the project's docker-compose setup.

## What Was Added

### 1. Docker Compose Configuration

**Added to `docker-compose.yml`:**

#### Bidding Database
```yaml
postgres-bidding:
  image: postgres:15-alpine
  container_name: bidsphere-postgres-bidding
  ports: "5434:5432"
  volumes:
    - postgres_bidding_data:/var/lib/postgresql/data
    - ./shared/database/bidding_db:/docker-entrypoint-initdb.d
  healthcheck: pg_isready check
```

#### Bidding Service
```yaml
bidding-service:
  build: ./backend-services/bidding-service
  container_name: bidsphere-bidding-api
  ports: "8083:8083"
  environment:
    - DB_HOST=postgres-bidding
    - PROJECT_SERVICE_URL=http://project-service:8082
    - JWT_SECRET (shared with other services)
  depends_on:
    - postgres-bidding
    - project-service
  healthcheck: curl health endpoint
```

### 2. Docker Scripts Updated

**Updated `docker-scripts.sh`:**

✅ Added bidding-service to build commands
✅ Added postgres-bidding to database checks
✅ Added bidding service health checks
✅ Updated help documentation
✅ Added bidding service to logs commands

### 3. Database Init Scripts

**Created in `shared/database/bidding_db/`:**
- `01-init-schema.sql` - Complete schema
- `02-seed-data.sql` - Optional seed data

## How to Use

### Start Everything

```bash
# Start all services including bidding
./docker-scripts.sh start
```

### Build Bidding Service Only

```bash
# Build and start just bidding service
./docker-scripts.sh build bidding-service
```

### View Bidding Service Logs

```bash
# Follow bidding service logs
./docker-scripts.sh logs bidding-service
```

### Check Health

```bash
# Check all services including bidding
./docker-scripts.sh health
```

### Refresh After Code Changes

```bash
# Rebuild with latest code
./docker-scripts.sh refresh
```

## Service URLs (Docker)

When running in Docker:

- **Bidding API**: http://localhost:8083/api/bids/health
- **Bidding Database**: localhost:5434
- **Internal URL** (for other services): http://bidding-service:8083

## Environment Variables

The following environment variables are configured in docker-compose.yml:

```yaml
DB_HOST: postgres-bidding
DB_PORT: 5432
DB_NAME: bidding_db
DB_USERNAME: postgres
DB_PASSWORD: postgres123
JWT_SECRET: (shared secret)
PROJECT_SERVICE_URL: http://project-service:8082
CORS_ALLOWED_ORIGINS: *
SERVER_PORT: 8083
```

## Service Dependencies

```
postgres-bidding (Database)
  └── bidding-service
      └── depends on: project-service
```

The bidding service:
1. Waits for postgres-bidding to be healthy
2. Waits for project-service to be healthy
3. Then starts and becomes available

## Health Checks

### Database Health
```bash
docker-compose exec postgres-bidding pg_isready -U postgres -d bidding_db
```

### Service Health
```bash
curl http://localhost:8083/api/bids/health
```

### Via Script
```bash
./docker-scripts.sh health
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
./docker-scripts.sh logs bidding-service

# Check database
./docker-scripts.sh logs postgres-bidding

# Rebuild
./docker-scripts.sh build bidding-service
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps postgres-bidding

# Check database health
docker-compose exec postgres-bidding pg_isready -U postgres -d bidding_db

# Restart database
docker-compose restart postgres-bidding
```

### Can't Connect to Project Service

```bash
# Check project service is running
docker-compose ps project-service

# Check network connectivity
docker-compose exec bidding-service ping project-service

# Check project service health
curl http://localhost:8082/api/projects/health
```

## Development Workflow

### 1. Make Code Changes

Edit files in `backend-services/bidding-service/`

### 2. Rebuild Service

```bash
./docker-scripts.sh build bidding-service
```

### 3. Test Changes

```bash
# Check health
curl http://localhost:8083/api/bids/health

# Test endpoint
curl http://localhost:8083/api/bids/project/PROJECT_ID
```

### 4. View Logs

```bash
./docker-scripts.sh logs bidding-service
```

## Database Management

### Access Database

```bash
# Connect to database
docker-compose exec postgres-bidding psql -U postgres -d bidding_db

# Run queries
SELECT * FROM bids;
```

### Backup Database

```bash
docker-compose exec postgres-bidding pg_dump -U postgres bidding_db > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres-bidding psql -U postgres bidding_db < backup.sql
```

### Reset Database

```bash
# WARNING: Deletes all data
./docker-scripts.sh reset-db
```

## Network Configuration

### Internal Communication

Services communicate using Docker network:
- Bidding → Project: `http://project-service:8082`
- Project → Bidding: `http://bidding-service:8083`

### External Access

From host machine:
- Bidding API: `http://localhost:8083`
- Bidding DB: `localhost:5434`

## Volume Management

### Database Volume

```bash
# List volumes
docker volume ls | grep bidding

# Inspect volume
docker volume inspect bidsphere_postgres_bidding_data

# Remove volume (WARNING: deletes data)
docker volume rm bidsphere_postgres_bidding_data
```

## Production Considerations

### 1. Environment Variables

Set in production:
```bash
JWT_SECRET=<strong-production-secret>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DB_PASSWORD=<strong-password>
```

### 2. Resource Limits

Add to docker-compose.yml:
```yaml
bidding-service:
  deploy:
    resources:
      limits:
        cpus: '1.0'
        memory: 1G
```

### 3. Health Checks

Monitor continuously:
```bash
watch -n 5 'curl -f http://localhost:8083/api/bids/health'
```

### 4. Logging

Configure log rotation:
```yaml
bidding-service:
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
```

## Integration Testing

### Test Full Stack

```bash
# Start all services
./docker-scripts.sh start

# Wait for services to be healthy
sleep 30

# Test auth service
curl http://localhost:8081/api/auth/health

# Test project service
curl http://localhost:8082/api/projects/health

# Test bidding service
curl http://localhost:8083/api/bids/health

# Test bidding → project integration
# (requires valid JWT and project ID)
```

## Summary

✅ **Bidding service fully integrated with Docker**
✅ **Database automatically initialized**
✅ **Health checks configured**
✅ **Service dependencies managed**
✅ **Docker scripts updated**
✅ **Ready for development and production**

## Quick Commands Reference

```bash
# Start
./docker-scripts.sh start

# Stop
./docker-scripts.sh stop

# Build bidding service
./docker-scripts.sh build bidding-service

# View logs
./docker-scripts.sh logs bidding-service

# Check health
./docker-scripts.sh health

# Refresh all
./docker-scripts.sh refresh

# Reset database
./docker-scripts.sh reset-db
```

## Next Steps

1. ✅ Docker integration complete
2. ✅ Run `./docker-scripts.sh start`
3. ✅ Test with `./docker-scripts.sh health`
4. ✅ Access at http://localhost:8083/api/bids/health
5. ✅ Integrate with frontend
