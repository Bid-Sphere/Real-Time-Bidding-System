# Bidding Service - Quick Start Guide

## Prerequisites
- Java 17
- Maven 3.6+
- PostgreSQL 15+
- Project Service running on port 8082

## Step 1: Database Setup

```bash
# Create database
createdb bidding_db

# Or using psql
psql -U postgres
CREATE DATABASE bidding_db;
\q

# Run init scripts
psql -U postgres -d bidding_db -f ../../shared/database/bidding_db/01-init-schema.sql
psql -U postgres -d bidding_db -f ../../shared/database/bidding_db/02-seed-data.sql
```

## Step 2: Build the Service

```bash
# Navigate to bidding-service directory
cd backend-services/bidding-service

# Clean and build
mvn clean install

# Skip tests if needed
mvn clean install -DskipTests
```

## Step 3: Run the Service

```bash
# Run with Maven
mvn spring-boot:run

# Or run the JAR directly
java -jar target/bidding-service-1.0.0.jar
```

## Step 4: Verify It's Running

```bash
# Health check
curl http://localhost:8083/api/bids/health

# Expected response:
# {
#   "success": true,
#   "message": "Bidding Service is running",
#   "data": "OK"
# }
```

## Step 5: Test Basic Functionality

### Get Bids for a Project (Public)
```bash
curl http://localhost:8083/api/bids/project/PROJECT_ID
```

### Get Bid Statistics (Public)
```bash
curl http://localhost:8083/api/bids/project/PROJECT_ID/stats
```

### Submit a Bid (Requires JWT)
```bash
curl -X POST http://localhost:8083/api/bids \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PROJECT_ID",
    "proposedPrice": 5000.00,
    "estimatedDuration": 30,
    "proposal": "This is a detailed proposal with more than fifty characters to meet the minimum requirement."
  }'
```

## Environment Variables (Optional)

Create a `.env` file or set environment variables:

```bash
# Database
export DB_HOST=localhost
export DB_PORT=5434
export DB_NAME=bidding_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres123

# JWT
export JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# Project Service
export PROJECT_SERVICE_URL=http://localhost:8082

# Run with environment variables
mvn spring-boot:run
```

## Docker Setup (Alternative)

```bash
# Build Docker image
docker build -t bidding-service .

# Run with Docker
docker run -p 8083:8083 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5434 \
  -e PROJECT_SERVICE_URL=http://host.docker.internal:8082 \
  bidding-service
```

## Common Issues

### Issue: Database connection failed
**Solution**: Check PostgreSQL is running on port 5434
```bash
psql -U postgres -h localhost -p 5434 -d bidding_db
```

### Issue: Project Service not reachable
**Solution**: Ensure project-service is running on port 8082
```bash
curl http://localhost:8082/api/projects/health
```

### Issue: JWT validation failed
**Solution**: Ensure JWT_SECRET matches auth-service
```bash
# Check application.properties
cat src/main/resources/application.properties | grep jwt.secret
```

## Next Steps

1. ✅ Service is running on port 8083
2. ✅ Test with Postman or curl
3. ✅ Integrate with frontend
4. ✅ Deploy to production

## Useful Commands

```bash
# Check logs
tail -f logs/bidding-service.log

# Check running processes
ps aux | grep bidding-service

# Stop the service
pkill -f bidding-service

# Rebuild and restart
mvn clean install && mvn spring-boot:run
```

## API Documentation

Full API documentation available in:
- `README.md` - Complete API reference
- `docs/bidding-service-spec.md` - Detailed specification
- `docs/bidding-service-openapi.yaml` - OpenAPI specification

## Support

For issues or questions:
1. Check logs in console output
2. Review `README.md` for detailed documentation
3. Check `IMPLEMENTATION_SUMMARY.md` for architecture details
