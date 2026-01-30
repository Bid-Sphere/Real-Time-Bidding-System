# Bidding Service - MVP Specification

## Overview
The Bidding Service manages all bid-related operations for both STANDARD and LIVE_AUCTION projects. Organizations submit bids, update them, withdraw them, and clients can accept/reject bids.

**Port:** 8083  
**Database:** `bidding_db` (PostgreSQL on port 5434)  
**Timeline:** 2 days  
**Dependencies:** Auth Service (JWT validation), Project Service (project details)

---

## Core Responsibilities

1. **Bid Submission** - Organizations submit bids on projects
2. **Bid Management** - Update, withdraw bids (before acceptance)
3. **Bid Retrieval** - Get bids by project, by organization, by ID
4. **Bid Actions** - Client accepts/rejects bids
5. **Bid Statistics** - Count, average, rankings per project

---

## Database Schema

### Table: `bids`
```sql
CREATE TABLE bids (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    bidder_id VARCHAR(255) NOT NULL,
    bidder_name VARCHAR(255) NOT NULL,
    bidder_type VARCHAR(50) NOT NULL DEFAULT 'ORGANIZATION',
    proposed_price DECIMAL(12,2) NOT NULL,
    estimated_duration INTEGER NOT NULL,
    proposal TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    is_withdrawn BOOLEAN NOT NULL DEFAULT FALSE,
    withdrawn_at TIMESTAMP,
    INDEX idx_project_id (project_id),
    INDEX idx_bidder_id (bidder_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);
```

### Table: `bid_attachments`
```sql
CREATE TABLE bid_attachments (
    id VARCHAR(255) PRIMARY KEY,
    bid_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE,
    INDEX idx_bid_id (bid_id)
);
```

### Enums
- **BidStatus**: `PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`
- **BidderType**: `ORGANIZATION`, `INDIVIDUAL`

---

## API Endpoints

### 1. Submit Bid
**POST** `/api/bids`

**Auth:** Required (JWT - ORGANIZATION role only)

**Request Body:**
```json
{
  "projectId": "uuid",
  "clientId": "uuid",
  "clientEmail": "client@example.com",
  "clientPhone": "+1234567890",
  "proposedPrice": 5000.00,
  "estimatedDuration": 30,
  "proposal": "Detailed proposal text (min 50 chars)"
}
```

**Note:** `clientEmail` and `clientPhone` are optional fields for contact information.

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Bid submitted successfully",
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "projectTitle": null,
    "bidderId": "uuid",
    "bidderName": "TechCorp Inc",
    "bidderType": "ORGANIZATION",
    "proposedPrice": 5000.00,
    "estimatedDuration": 30,
    "proposal": "...",
    "status": "PENDING",
    "submittedAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00",
    "acceptedAt": null,
    "rejectedAt": null,
    "rejectionReason": null,
    "ranking": null,
    "totalBids": null,
    "clientEmail": null,
    "clientPhone": null
  }
}
```

**Validations:**
- User must be ORGANIZATION or ORGANISATION role (both spellings accepted)
- Project must exist and be OPEN/ACCEPTING_BIDS
- Cannot bid on own project (check clientId != bidderId)
- Cannot submit duplicate bid (one bid per project per organization)
- proposedPrice > 0.01
- estimatedDuration >= 1
- proposal length >= 50 characters
- clientId is required

---

### 2. Get Bids for Project
**GET** `/api/bids/project/{projectId}`

**Auth:** Optional (public for browsing, but shows more details if authenticated)

**Query Params:**
- `status` (optional): PENDING, ACCEPTED, REJECTED
- `sort` (optional): `price_asc`, `price_desc`, `date_asc`, `date_desc` (default: `date_desc`)
- `page` (optional): default 0
- `limit` (optional): default 20, max 100

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "bidderId": "uuid",
        "bidderName": "TechCorp Inc",
        "bidderType": "ORGANIZATION",
        "proposedPrice": 5000.00,
        "estimatedDuration": 30,
        "proposal": "...",
        "status": "PENDING",
        "submittedAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-15T10:30:00",
        "acceptedAt": null,
        "rejectedAt": null,
        "rejectionReason": null,
        "ranking": 2,
        "totalBids": null,
        "clientEmail": null,
        "clientPhone": null
      }
    ],
    "totalElements": 15,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 20
  }
}
```

**Business Logic:**
- If user is project owner (CLIENT or INDIVIDUAL role), show all bids
- If user is not owner, only show ACCEPTED bids (hide PENDING/REJECTED)
- Calculate ranking based on price (1 = lowest)
- Accepts both CLIENT and INDIVIDUAL role spellings

---

### 3. Get My Bids (Organization)
**GET** `/api/bids/my-bids`

**Auth:** Required (JWT - ORGANIZATION role)

**Query Params:**
- `status` (optional): PENDING, ACCEPTED, REJECTED, WITHDRAWN
- `page` (optional): default 0
- `limit` (optional): default 20

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "projectTitle": "E-commerce Website",
        "proposedPrice": 5000.00,
        "estimatedDuration": 30,
        "status": "PENDING",
        "submittedAt": "2024-01-15T10:30:00Z",
        "ranking": 2,
        "totalBids": 8
      }
    ],
    "totalElements": 12,
    "totalPages": 1,
    "currentPage": 0
  }
}
```

---

### 4. Get Single Bid
**GET** `/api/bids/{bidId}`

**Auth:** Required (JWT)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "projectTitle": "E-commerce Website",
    "bidderId": "uuid",
    "bidderName": "TechCorp Inc",
    "bidderType": "ORGANIZATION",
    "proposedPrice": 5000.00,
    "estimatedDuration": 30,
    "proposal": "...",
    "status": "PENDING",
    "submittedAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "attachments": []
  }
}
```

**Authorization:**
- If user is project owner: can view any bid
- If user is bidder: can only view own bid
- Others: 403 Forbidden

---

### 5. Update Bid
**PUT** `/api/bids/{bidId}`

**Auth:** Required (JWT - ORGANIZATION role, must be bid owner)

**Request Body:**
```json
{
  "proposedPrice": 4500.00,
  "estimatedDuration": 28,
  "proposal": "Updated proposal text"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bid updated successfully",
  "data": { /* full bid object */ }
}
```

**Validations:**
- Can only update own bids
- Can only update if status is PENDING
- Same validations as submit bid

---

### 6. Withdraw Bid
**DELETE** `/api/bids/{bidId}`

**Auth:** Required (JWT - ORGANIZATION role, must be bid owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bid withdrawn successfully",
  "data": null
}
```

**Business Logic:**
- Can only withdraw own bids
- Can only withdraw if status is PENDING
- Sets `is_withdrawn = true`, `status = WITHDRAWN`, `withdrawn_at = now()`

---

### 7. Accept Bid (Client)
**POST** `/api/bids/{bidId}/accept`

**Auth:** Required (JWT - CLIENT or INDIVIDUAL role, must be project owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bid accepted successfully",
  "data": {
    "id": "uuid",
    "status": "ACCEPTED",
    "acceptedAt": "2024-01-15T14:30:00"
  }
}
```

**Business Logic:**
- Verify user is project owner
- Verify bid status is PENDING
- Set bid status to ACCEPTED
- Set acceptedAt timestamp
- **Call Project Service** to update project status to IN_PROGRESS (use WebClient)

---

### 8. Reject Bid (Client)
**POST** `/api/bids/{bidId}/reject`

**Auth:** Required (JWT - CLIENT or INDIVIDUAL role, must be project owner)

**Request Body (optional):**
```json
{
  "reason": "Budget constraints"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bid rejected successfully",
  "data": null
}
```

**Business Logic:**
- Verify user is project owner
- Verify bid status is PENDING
- Set bid status to REJECTED
- Set rejectedAt timestamp and rejection_reason

---

### 9. Get Bid Statistics for Project
**GET** `/api/bids/project/{projectId}/stats`

**Auth:** Optional

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalBids": 15,
    "pendingBids": 12,
    "acceptedBids": 1,
    "rejectedBids": 2,
    "averageBidAmount": 4750.50,
    "lowestBid": 3500.00,
    "highestBid": 6200.00
  }
}
```

---

### 10. Health Check
**GET** `/api/bids/health`

**Auth:** None

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Bidding Service is running",
  "data": "OK"
}
```

**Note:** Returns a simple success response with ApiResponse wrapper.

---

## Error Responses

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

---

## JWT Integration

Extract from JWT token (set by JwtAuthenticationFilter):
- `userId` - from request.getAttribute("userId")
- `userEmail` - from request.getAttribute("userEmail")  
- `userRole` - from request.getAttribute("userRole")

**Accepted Role Values:**
- ORGANIZATION or ORGANISATION (for bidders)
- CLIENT or INDIVIDUAL (for project owners)

**JWT Secret:** Must match auth-service (from env: `JWT_SECRET`)

---

## Inter-Service Communication

### Call Project Service
**Purpose:** Verify project exists, get project details, update project status

**Endpoint:** `http://project-service:8082/api/projects/{projectId}`

**Use Spring WebClient:**
```java
@Bean
public WebClient projectServiceClient() {
    return WebClient.builder()
        .baseUrl("http://localhost:8082") // or from env
        .build();
}
```

**When to call:**
1. Before submitting bid - verify project exists and is open
2. After accepting bid - update project status to IN_PROGRESS

---

## Configuration (application.yml)

```yaml
spring:
  application:
    name: bidding-service
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5434}/${DB_NAME:bidding_db}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres123}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

server:
  port: 8083

jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
  expiration: 86400000

services:
  project:
    url: ${PROJECT_SERVICE_URL:http://localhost:8082}
```

---

## Docker Setup

Add to `docker-compose.yml`:

```yaml
postgres-bidding:
  image: postgres:15-alpine
  container_name: bidsphere-postgres-bidding
  environment:
    POSTGRES_DB: bidding_db
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres123
  ports:
    - "5434:5432"
  volumes:
    - postgres_bidding_data:/var/lib/postgresql/data
    - ./shared/database/bidding_db:/docker-entrypoint-initdb.d
  networks:
    - bidsphere-network

bidding-service:
  build: 
    context: ./backend-services/bidding-service
    dockerfile: Dockerfile
  container_name: bidsphere-bidding-api
  ports:
    - "8083:8083"
  environment:
    DB_HOST: postgres-bidding
    DB_PORT: 5432
    DB_NAME: bidding_db
    DB_USERNAME: postgres
    DB_PASSWORD: postgres123
    JWT_SECRET: ${JWT_SECRET}
    PROJECT_SERVICE_URL: http://project-service:8082
  depends_on:
    - postgres-bidding
  networks:
    - bidsphere-network
```

---

## MVP Constraints

### IN SCOPE:
✅ Submit, update, withdraw bids  
✅ Accept/reject bids  
✅ List bids with filtering and sorting  
✅ Bid statistics  
✅ JWT authentication  
✅ Basic validation  
✅ Inter-service call to project service  

### OUT OF SCOPE (Future):
❌ File attachments for bids  
❌ Counter-bid functionality  
❌ Bid notifications (handled by real-time service)  
❌ Bid history/audit trail  
❌ Advanced analytics  
❌ Bid templates  
❌ Automated bid ranking algorithms  

---

## Testing Checklist

- [ ] Submit bid as organization
- [ ] Cannot submit duplicate bid
- [ ] Cannot bid on own project
- [ ] Update bid (only PENDING)
- [ ] Withdraw bid (only PENDING)
- [ ] Get bids for project (with ranking)
- [ ] Get my bids as organization
- [ ] Accept bid as client (updates project status)
- [ ] Reject bid as client
- [ ] Get bid statistics
- [ ] Authorization checks (403 for unauthorized actions)
- [ ] Validation errors (400 for invalid data)

---

## Package Structure

```
com.biddingsystem.bidding/
├── controller/
│   └── BidController.java
├── service/
│   ├── BidService.java
│   └── BidServiceImpl.java
├── repository/
│   └── BidRepository.java
├── entity/
│   ├── Bid.java
│   └── BidAttachment.java
├── dto/
│   ├── request/
│   │   ├── SubmitBidRequest.java
│   │   ├── UpdateBidRequest.java
│   │   └── RejectBidRequest.java
│   └── response/
│       ├── BidResponse.java
│       ├── BidStatsResponse.java
│       └── ApiResponse.java
├── enums/
│   ├── BidStatus.java
│   └── BidderType.java
├── config/
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationFilter.java
│   └── WebClientConfig.java
└── exception/
    ├── BidNotFoundException.java
    ├── DuplicateBidException.java
    └── UnauthorizedBidActionException.java
```

---

## Frontend Integration Notes

**Base URL:** `http://localhost:8083/api/bids`

**Headers Required:**
```javascript
{
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

**Example: Submit Bid**
```javascript
const response = await fetch('http://localhost:8083/api/bids', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    projectId: 'uuid',
    proposedPrice: 5000,
    estimatedDuration: 30,
    proposal: 'My detailed proposal...'
  })
});
const result = await response.json();
```

All responses follow the same structure: `{ success, message, data }`
