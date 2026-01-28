# Bidding Service

Bidding Service manages all bid-related operations for the BidSphere platform. Organizations can submit, update, and withdraw bids on projects. Clients can accept or reject bids.

## Features

- ✅ Submit bids on projects
- ✅ Update and withdraw bids (PENDING status only)
- ✅ Accept/reject bids (CLIENT role)
- ✅ List bids with filtering and sorting
- ✅ Bid statistics and rankings
- ✅ JWT authentication with role-based access control
- ✅ Inter-service communication with Project Service

## Technology Stack

- **Java 17**
- **Spring Boot 4.0.0**
- **PostgreSQL** (Database)
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (ORM)
- **WebClient** (Inter-service communication)
- **Lombok** (Boilerplate reduction)

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 15+
- Project Service running (for inter-service calls)

## Configuration

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE bidding_db;
```

2. Run init scripts from `shared/database/bidding_db/`:
   - `01-init-schema.sql` - Creates tables and indexes
   - `02-seed-data.sql` - Optional seed data

### Environment Variables

```bash
# Server
SERVER_PORT=8083

# Database
DB_HOST=localhost
DB_PORT=5434
DB_NAME=bidding_db
DB_USERNAME=postgres
DB_PASSWORD=postgres123

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
JWT_ISSUER=bidding-system-auth

# CORS
CORS_ALLOWED_ORIGINS=*

# Project Service
PROJECT_SERVICE_URL=http://localhost:8082
```

## Running the Service

### Local Development

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

### Docker

```bash
# Build image
docker build -t bidding-service .

# Run container
docker run -p 8083:8083 \
  -e DB_HOST=postgres-bidding \
  -e PROJECT_SERVICE_URL=http://project-service:8082 \
  bidding-service
```

## API Endpoints

### Base URL
```
http://localhost:8083/api/bids
```

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ORGANIZATION | Submit a new bid |
| GET | `/project/{projectId}` | Optional | Get bids for a project |
| GET | `/my-bids` | ORGANIZATION | Get my bids |
| GET | `/{bidId}` | Required | Get single bid |
| PUT | `/{bidId}` | ORGANIZATION | Update bid |
| DELETE | `/{bidId}` | ORGANIZATION | Withdraw bid |
| POST | `/{bidId}/accept` | CLIENT | Accept bid |
| POST | `/{bidId}/reject` | CLIENT | Reject bid |
| GET | `/project/{projectId}/stats` | Public | Get bid statistics |
| GET | `/health` | Public | Health check |

### Example Requests

#### Submit Bid
```bash
curl -X POST http://localhost:8083/api/bids \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "uuid",
    "proposedPrice": 5000.00,
    "estimatedDuration": 30,
    "proposal": "Detailed proposal text (minimum 50 characters required)..."
  }'
```

#### Get Bids for Project
```bash
curl -X GET "http://localhost:8083/api/bids/project/{projectId}?status=PENDING&sort=price_asc&page=0&limit=20"
```

#### Accept Bid
```bash
curl -X POST http://localhost:8083/api/bids/{bidId}/accept \
  -H "Authorization: Bearer <jwt_token>"
```

## Business Rules

### Submit Bid
- ✅ User must have ORGANIZATION role
- ✅ Project must exist and be OPEN
- ✅ Cannot bid on own project
- ✅ Cannot submit duplicate bid (one per project per organization)
- ✅ proposedPrice > 0
- ✅ estimatedDuration > 0
- ✅ proposal length >= 50 characters

### Update Bid
- ✅ Can only update own bids
- ✅ Can only update if status is PENDING

### Withdraw Bid
- ✅ Can only withdraw own bids
- ✅ Can only withdraw if status is PENDING

### Accept/Reject Bid
- ✅ User must have CLIENT role
- ✅ Must be project owner
- ✅ Can only accept/reject bids with PENDING status

### View Bids
- ✅ Project owner (CLIENT) can see all bids
- ✅ Non-owners can only see ACCEPTED bids
- ✅ Bidders can see their own bids

## Architecture Decisions

### Inter-Service Communication

Currently using **WebClient** for synchronous HTTP calls to Project Service:
- ✅ Simple and straightforward
- ✅ Works well for MVP/small-medium scale
- ✅ Easy to understand and debug

**When to consider Kafka/Event-Driven:**
- Multiple consumers need the same event
- High throughput (>1000 events/sec)
- Need event sourcing/audit trail
- Async processing requirements

### No Service-to-Service Auth for Project Updates

When accepting a bid, the bidding service does NOT update the project status. Instead:
1. Bidding service updates bid status to ACCEPTED
2. Frontend makes separate call to Project Service to update project status
3. Client's JWT is used (proper authorization)

**Benefits:**
- ✅ No complex service-to-service authentication
- ✅ Clean separation of concerns
- ✅ Frontend orchestrates the workflow

## Database Schema

### bids table
```sql
- id (VARCHAR PRIMARY KEY)
- project_id (VARCHAR, indexed)
- bidder_id (VARCHAR, indexed)
- bidder_name (VARCHAR)
- bidder_type (VARCHAR) - ORGANIZATION, INDIVIDUAL
- proposed_price (DECIMAL)
- estimated_duration (INTEGER)
- proposal (TEXT)
- status (VARCHAR) - PENDING, ACCEPTED, REJECTED, WITHDRAWN
- submitted_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- accepted_at (TIMESTAMP)
- rejected_at (TIMESTAMP)
- rejection_reason (TEXT)
- is_withdrawn (BOOLEAN)
- withdrawn_at (TIMESTAMP)
```

### bid_attachments table (Future)
```sql
- id (VARCHAR PRIMARY KEY)
- bid_id (VARCHAR, FK to bids)
- file_name (VARCHAR)
- file_url (VARCHAR)
- file_size (BIGINT)
- file_type (VARCHAR)
- uploaded_at (TIMESTAMP)
```

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

**Common Status Codes:**
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing/invalid JWT
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate bid
- `500 Internal Server Error` - Server errors

## Testing

### Health Check
```bash
curl http://localhost:8083/api/bids/health
```

Expected response:
```json
{
  "success": true,
  "message": "Bidding Service is running",
  "data": "OK"
}
```

## Future Enhancements

- [ ] File attachments for bids
- [ ] Counter-bid functionality
- [ ] Bid notifications (via real-time service)
- [ ] Bid history/audit trail
- [ ] Advanced analytics
- [ ] Bid templates
- [ ] Event-driven architecture with Kafka
- [ ] Circuit breakers for resilience

## Contributing

1. Follow existing code structure
2. Use Lombok for boilerplate reduction
3. Add proper logging
4. Handle exceptions appropriately
5. Follow REST API conventions

## License

Proprietary - BidSphere Platform
