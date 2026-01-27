# Auction Service - MVP Specification

## Overview
The Auction Service manages LIVE_AUCTION type projects, handling auction lifecycle, real-time bid tracking, auction timers, and automatic auction closure. It works alongside the Bidding Service but adds auction-specific logic.

**Port:** 8084  
**Database:** Uses `bidding_db` (shared with Bidding Service)  
**Timeline:** 2 days  
**Dependencies:** Bidding Service (bid data), Project Service (project details), Real-Time Service (notifications)

---

## Core Responsibilities

1. **Auction Lifecycle** - Start, monitor, and close auctions
2. **Live Bid Tracking** - Track bids during active auctions
3. **Auction Timer** - Countdown management and auto-close
4. **Winner Determination** - Identify highest bidder when auction ends
5. **Auction Rules** - Enforce minimum bid increments, reserve prices

---

## Database Schema

### Table: `auctions`
```sql
CREATE TABLE auctions (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL UNIQUE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    current_highest_bid DECIMAL(12,2),
    current_highest_bidder_id VARCHAR(255),
    current_highest_bidder_name VARCHAR(255),
    minimum_bid_increment DECIMAL(12,2) NOT NULL DEFAULT 100.00,
    reserve_price DECIMAL(12,2),
    total_bids INTEGER NOT NULL DEFAULT 0,
    winner_bid_id VARCHAR(255),
    closed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_project_id (project_id),
    INDEX idx_status (status),
    INDEX idx_end_time (end_time)
);
```

### Table: `auction_bids`
```sql
CREATE TABLE auction_bids (
    id VARCHAR(255) PRIMARY KEY,
    auction_id VARCHAR(255) NOT NULL,
    bid_id VARCHAR(255) NOT NULL,
    bidder_id VARCHAR(255) NOT NULL,
    bidder_name VARCHAR(255) NOT NULL,
    bid_amount DECIMAL(12,2) NOT NULL,
    bid_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_winning BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
    INDEX idx_auction_id (auction_id),
    INDEX idx_bid_time (bid_time),
    INDEX idx_is_winning (is_winning)
);
```

### Enums
- **AuctionStatus**: `SCHEDULED`, `ACTIVE`, `ENDED`, `CANCELLED`

---

## API Endpoints

### 1. Create Auction (Auto-triggered)
**POST** `/api/auctions`

**Auth:** Internal only (called by Project Service when LIVE_AUCTION project is published)

**Request Body:**
```json
{
  "projectId": "uuid",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T18:00:00Z",
  "minimumBidIncrement": 100.00,
  "reservePrice": 3000.00
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Auction created successfully",
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "startTime": "2024-01-20T10:00:00Z",
    "endTime": "2024-01-20T18:00:00Z",
    "status": "SCHEDULED",
    "minimumBidIncrement": 100.00,
    "reservePrice": 3000.00,
    "totalBids": 0
  }
}
```

**Business Logic:**
- Validate project exists and is LIVE_AUCTION type
- Validate endTime > startTime
- Validate endTime is in future
- Set status to SCHEDULED if startTime is future, ACTIVE if startTime is now/past

---

### 2. Get Auction Details
**GET** `/api/auctions/project/{projectId}`

**Auth:** Optional (public)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "projectTitle": "E-commerce Website",
    "startTime": "2024-01-20T10:00:00Z",
    "endTime": "2024-01-20T18:00:00Z",
    "status": "ACTIVE",
    "currentHighestBid": 5200.00,
    "currentHighestBidderName": "TechCorp Inc",
    "minimumBidIncrement": 100.00,
    "reservePrice": 3000.00,
    "totalBids": 12,
    "timeRemaining": 3600,
    "nextMinimumBid": 5300.00
  }
}
```

**Calculated Fields:**
- `timeRemaining`: seconds until endTime (0 if ended)
- `nextMinimumBid`: currentHighestBid + minimumBidIncrement (or reservePrice if no bids)

---

### 3. Get Auction by ID
**GET** `/api/auctions/{auctionId}`

**Auth:** Optional

**Response:** Same as Get Auction Details

---

### 4. Submit Auction Bid
**POST** `/api/auctions/{auctionId}/bid`

**Auth:** Required (JWT - ORGANIZATION role)

**Request Body:**
```json
{
  "bidAmount": 5300.00,
  "proposal": "Quick proposal for auction bid"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Auction bid submitted successfully",
  "data": {
    "id": "uuid",
    "auctionId": "uuid",
    "bidAmount": 5300.00,
    "bidderName": "TechCorp Inc",
    "bidTime": "2024-01-20T14:30:00Z",
    "isWinning": true,
    "nextMinimumBid": 5400.00
  }
}
```

**Validations:**
- Auction must be ACTIVE
- Current time must be between startTime and endTime
- bidAmount >= nextMinimumBid
- Cannot bid on own project
- bidAmount must be in increments of minimumBidIncrement

**Business Logic:**
1. Create bid in Bidding Service (call POST /api/bids)
2. Create auction_bid record
3. Update auction current_highest_bid and bidder info
4. Set previous winning bid to is_winning = false
5. Set new bid to is_winning = true
6. Increment total_bids
7. **Notify Real-Time Service** to broadcast bid update

---

### 5. Get Auction Bid History
**GET** `/api/auctions/{auctionId}/bids`

**Auth:** Optional

**Query Params:**
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
        "bidderName": "TechCorp Inc",
        "bidAmount": 5300.00,
        "bidTime": "2024-01-20T14:30:00Z",
        "isWinning": true
      },
      {
        "id": "uuid",
        "bidderName": "DevStudio LLC",
        "bidAmount": 5200.00,
        "bidTime": "2024-01-20T14:25:00Z",
        "isWinning": false
      }
    ],
    "totalElements": 12,
    "totalPages": 1,
    "currentPage": 0
  }
}
```

**Note:** Hide bidder IDs for privacy, only show names

---

### 6. Get Active Auctions
**GET** `/api/auctions/active`

**Auth:** Optional

**Query Params:**
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
        "projectCategory": "IT",
        "endTime": "2024-01-20T18:00:00Z",
        "currentHighestBid": 5300.00,
        "totalBids": 12,
        "timeRemaining": 3600
      }
    ],
    "totalElements": 5,
    "totalPages": 1
  }
}
```

---

### 7. Close Auction (Manual/Auto)
**POST** `/api/auctions/{auctionId}/close`

**Auth:** Internal (scheduled job) or CLIENT (project owner)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Auction closed successfully",
  "data": {
    "id": "uuid",
    "status": "ENDED",
    "winnerBidId": "uuid",
    "winnerBidderId": "uuid",
    "winnerBidderName": "TechCorp Inc",
    "winningBidAmount": 5300.00,
    "closedAt": "2024-01-20T18:00:00Z"
  }
}
```

**Business Logic:**
1. Set auction status to ENDED
2. Set closedAt timestamp
3. Identify winner (highest bid)
4. Set winner_bid_id
5. **Call Bidding Service** to accept winning bid (POST /api/bids/{bidId}/accept)
6. **Call Project Service** to update project status to IN_PROGRESS
7. **Notify Real-Time Service** to broadcast auction end

---

### 8. Cancel Auction
**POST** `/api/auctions/{auctionId}/cancel`

**Auth:** Required (JWT - CLIENT role, must be project owner)

**Request Body:**
```json
{
  "reason": "Project requirements changed"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Auction cancelled successfully",
  "data": null
}
```

**Business Logic:**
- Can only cancel if status is SCHEDULED or ACTIVE
- Set status to CANCELLED
- **Call Project Service** to update project status to CLOSED
- **Notify Real-Time Service** to broadcast cancellation

---

### 9. Get My Auction Bids (Organization)
**GET** `/api/auctions/my-bids`

**Auth:** Required (JWT - ORGANIZATION role)

**Query Params:**
- `status` (optional): ACTIVE, ENDED
- `page` (optional): default 0
- `limit` (optional): default 20

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "auctionId": "uuid",
        "projectId": "uuid",
        "projectTitle": "E-commerce Website",
        "myHighestBid": 5300.00,
        "currentHighestBid": 5300.00,
        "isWinning": true,
        "auctionStatus": "ACTIVE",
        "endTime": "2024-01-20T18:00:00Z",
        "timeRemaining": 3600
      }
    ],
    "totalElements": 3,
    "totalPages": 1
  }
}
```

---

### 10. Get Auction Statistics
**GET** `/api/auctions/{auctionId}/stats`

**Auth:** Optional

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalBids": 12,
    "uniqueBidders": 8,
    "currentHighestBid": 5300.00,
    "averageBidAmount": 4850.00,
    "bidIncreaseRate": 100.00,
    "timeRemaining": 3600
  }
}
```

---

### 11. Health Check
**GET** `/api/auctions/health`

**Auth:** None

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Auction Service is running",
  "data": "OK"
}
```

---

## Scheduled Jobs

### Auto-Start Auctions
**Frequency:** Every 1 minute

**Logic:**
- Find auctions with status = SCHEDULED and startTime <= now()
- Update status to ACTIVE
- Notify Real-Time Service

### Auto-Close Auctions
**Frequency:** Every 1 minute

**Logic:**
- Find auctions with status = ACTIVE and endTime <= now()
- Call close auction endpoint for each
- Determine winner and accept bid

**Implementation:**
```java
@Scheduled(fixedRate = 60000) // 1 minute
public void autoCloseExpiredAuctions() {
    List<Auction> expiredAuctions = auctionRepository
        .findByStatusAndEndTimeBefore(AuctionStatus.ACTIVE, LocalDateTime.now());
    
    for (Auction auction : expiredAuctions) {
        closeAuction(auction.getId());
    }
}
```

---

## Inter-Service Communication

### 1. Call Bidding Service
**Purpose:** Create bid, accept winning bid

**Endpoints:**
- `POST http://bidding-service:8083/api/bids` - Create bid
- `POST http://bidding-service:8083/api/bids/{bidId}/accept` - Accept winning bid

### 2. Call Project Service
**Purpose:** Get project details, update project status

**Endpoints:**
- `GET http://project-service:8082/api/projects/{projectId}` - Get project
- `PATCH http://project-service:8082/api/projects/{projectId}/status` - Update status

### 3. Call Real-Time Service
**Purpose:** Broadcast auction events

**Endpoints:**
- `POST http://realtime-service:5000/api/notify/auction-bid` - New bid notification
- `POST http://realtime-service:5000/api/notify/auction-end` - Auction ended notification

**Use Spring WebClient for all calls**

---

## Configuration (application.yml)

```yaml
spring:
  application:
    name: auction-service
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5434}/${DB_NAME:bidding_db}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres123}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

server:
  port: 8084

jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
  expiration: 86400000

services:
  bidding:
    url: ${BIDDING_SERVICE_URL:http://localhost:8083}
  project:
    url: ${PROJECT_SERVICE_URL:http://localhost:8082}
  realtime:
    url: ${REALTIME_SERVICE_URL:http://localhost:5000}

auction:
  auto-close:
    enabled: true
    interval: 60000 # 1 minute
```

---

## Docker Setup

Add to `docker-compose.yml`:

```yaml
auction-service:
  build: 
    context: ./backend-services/project-auction-service
    dockerfile: Dockerfile
  container_name: bidsphere-auction-api
  ports:
    - "8084:8084"
  environment:
    DB_HOST: postgres-bidding
    DB_PORT: 5432
    DB_NAME: bidding_db
    DB_USERNAME: postgres
    DB_PASSWORD: postgres123
    JWT_SECRET: ${JWT_SECRET}
    BIDDING_SERVICE_URL: http://bidding-service:8083
    PROJECT_SERVICE_URL: http://project-service:8082
    REALTIME_SERVICE_URL: http://realtime-service:5000
  depends_on:
    - postgres-bidding
    - bidding-service
  networks:
    - bidsphere-network
```

---

## MVP Constraints

### IN SCOPE:
✅ Create and manage auctions  
✅ Submit auction bids with validation  
✅ Track highest bid and winner  
✅ Auto-close auctions on timer  
✅ Auction bid history  
✅ Active auctions listing  
✅ Basic auction statistics  
✅ Integration with bidding/project/realtime services  

### OUT OF SCOPE (Future):
❌ Bid retraction  
❌ Auction extensions (soft close)  
❌ Dutch auctions (descending price)  
❌ Sealed bid auctions  
❌ Proxy bidding (auto-bid up to max)  
❌ Auction analytics dashboard  
❌ Bid notifications via email/SMS  

---

## Testing Checklist

- [ ] Create auction for LIVE_AUCTION project
- [ ] Submit auction bid (validates minimum increment)
- [ ] Cannot bid below minimum
- [ ] Cannot bid on own project
- [ ] Get auction details with time remaining
- [ ] Get auction bid history
- [ ] Get active auctions
- [ ] Auto-close auction on timer
- [ ] Winner determination (highest bid)
- [ ] Accept winning bid (calls bidding service)
- [ ] Cancel auction (only before end)
- [ ] Get my auction bids as organization
- [ ] Authorization checks

---

## Package Structure

```
com.biddingsystem.auction/
├── controller/
│   └── AuctionController.java
├── service/
│   ├── AuctionService.java
│   └── AuctionServiceImpl.java
├── repository/
│   ├── AuctionRepository.java
│   └── AuctionBidRepository.java
├── entity/
│   ├── Auction.java
│   └── AuctionBid.java
├── dto/
│   ├── request/
│   │   ├── CreateAuctionRequest.java
│   │   ├── SubmitAuctionBidRequest.java
│   │   └── CancelAuctionRequest.java
│   └── response/
│       ├── AuctionResponse.java
│       ├── AuctionBidResponse.java
│       └── AuctionStatsResponse.java
├── enums/
│   └── AuctionStatus.java
├── config/
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationFilter.java
│   ├── WebClientConfig.java
│   └── SchedulerConfig.java
├── scheduler/
│   └── AuctionScheduler.java
└── exception/
    ├── AuctionNotFoundException.java
    ├── AuctionNotActiveException.java
    └── InvalidBidAmountException.java
```

---

## Frontend Integration Notes

**Base URL:** `http://localhost:8084/api/auctions`

**Example: Submit Auction Bid**
```javascript
const response = await fetch(`http://localhost:8084/api/auctions/${auctionId}/bid`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    bidAmount: 5300,
    proposal: 'Quick auction bid proposal'
  })
});
const result = await response.json();
```

**Example: Get Auction Details (with polling)**
```javascript
// Poll every 5 seconds for auction updates
setInterval(async () => {
  const response = await fetch(`http://localhost:8084/api/auctions/project/${projectId}`);
  const result = await response.json();
  updateAuctionUI(result.data);
}, 5000);
```

**Note:** For real-time updates, use SignalR connection from Real-Time Service instead of polling.
