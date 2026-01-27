# Real-Time Service - MVP Specification

## Overview
The Real-Time Service provides WebSocket-based real-time updates using SignalR for auction bids, notifications, and live project updates. It acts as a notification hub that other services can trigger.

**Port:** 5000  
**Technology:** ASP.NET Core 8.0 + SignalR  
**Database:** None (stateless, uses Redis for backplane)  
**Timeline:** 2 days  
**Dependencies:** Redis (for SignalR backplane), Auth Service (JWT validation)

---

## Core Responsibilities

1. **Auction Updates** - Broadcast new bids, auction start/end events
2. **Bid Notifications** - Notify clients when bids are submitted/accepted/rejected
3. **Project Updates** - Notify when projects are published/updated
4. **Connection Management** - Handle WebSocket connections with authentication
5. **Presence** - Track online users (optional for MVP)

---

## SignalR Hubs

### 1. AuctionHub
**Route:** `/hubs/auction`

**Purpose:** Real-time auction updates

**Methods:**

#### Server → Client

**`ReceiveAuctionBid`**
```csharp
// Broadcast when new bid is placed
{
  "auctionId": "uuid",
  "projectId": "uuid",
  "bidderName": "TechCorp Inc",
  "bidAmount": 5300.00,
  "bidTime": "2024-01-20T14:30:00Z",
  "isWinning": true,
  "nextMinimumBid": 5400.00,
  "totalBids": 13
}
```

**`AuctionStarted`**
```csharp
// Broadcast when auction becomes active
{
  "auctionId": "uuid",
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T18:00:00Z"
}
```

**`AuctionEnded`**
```csharp
// Broadcast when auction closes
{
  "auctionId": "uuid",
  "projectId": "uuid",
  "winnerBidderName": "TechCorp Inc",
  "winningBidAmount": 5300.00,
  "totalBids": 15,
  "endTime": "2024-01-20T18:00:00Z"
}
```

**`AuctionCancelled`**
```csharp
// Broadcast when auction is cancelled
{
  "auctionId": "uuid",
  "projectId": "uuid",
  "reason": "Project requirements changed",
  "cancelledAt": "2024-01-20T15:00:00Z"
}
```

#### Client → Server

**`JoinAuction`**
```csharp
// Client joins auction room to receive updates
await connection.InvokeAsync("JoinAuction", auctionId);
```

**`LeaveAuction`**
```csharp
// Client leaves auction room
await connection.InvokeAsync("LeaveAuction", auctionId);
```

---

### 2. NotificationHub
**Route:** `/hubs/notifications`

**Purpose:** General notifications for bids and projects

**Methods:**

#### Server → Client

**`BidSubmitted`**
```csharp
// Notify project owner when bid is submitted
{
  "bidId": "uuid",
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "bidderName": "TechCorp Inc",
  "bidAmount": 5000.00,
  "submittedAt": "2024-01-20T14:30:00Z"
}
```

**`BidAccepted`**
```csharp
// Notify bidder when their bid is accepted
{
  "bidId": "uuid",
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "acceptedAt": "2024-01-20T16:00:00Z"
}
```

**`BidRejected`**
```csharp
// Notify bidder when their bid is rejected
{
  "bidId": "uuid",
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "reason": "Budget constraints",
  "rejectedAt": "2024-01-20T16:00:00Z"
}
```

**`ProjectPublished`**
```csharp
// Notify organizations when new project is published
{
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "category": "IT",
  "budget": 5000.00,
  "biddingType": "STANDARD",
  "publishedAt": "2024-01-20T10:00:00Z"
}
```

#### Client → Server

**`JoinUserNotifications`**
```csharp
// Client joins their personal notification room
await connection.InvokeAsync("JoinUserNotifications", userId);
```

**`MarkAsRead`**
```csharp
// Mark notification as read (optional for MVP)
await connection.InvokeAsync("MarkAsRead", notificationId);
```

---

## REST API Endpoints (for triggering notifications)

### 1. Trigger Auction Bid Notification
**POST** `/api/notify/auction-bid`

**Auth:** Internal only (called by Auction Service)

**Request Body:**
```json
{
  "auctionId": "uuid",
  "projectId": "uuid",
  "bidderName": "TechCorp Inc",
  "bidAmount": 5300.00,
  "bidTime": "2024-01-20T14:30:00Z",
  "isWinning": true,
  "nextMinimumBid": 5400.00,
  "totalBids": 13
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Auction bid notification sent",
  "data": {
    "recipientCount": 25
  }
}
```

**Logic:**
- Broadcast to all clients in auction room (auctionId)
- Use `Clients.Group(auctionId).SendAsync("ReceiveAuctionBid", data)`

---

### 2. Trigger Auction End Notification
**POST** `/api/notify/auction-end`

**Auth:** Internal only (called by Auction Service)

**Request Body:**
```json
{
  "auctionId": "uuid",
  "projectId": "uuid",
  "winnerBidderName": "TechCorp Inc",
  "winningBidAmount": 5300.00,
  "totalBids": 15,
  "endTime": "2024-01-20T18:00:00Z"
}
```

**Response:** `200 OK`

**Logic:**
- Broadcast to all clients in auction room
- Use `Clients.Group(auctionId).SendAsync("AuctionEnded", data)`

---

### 3. Trigger Bid Submitted Notification
**POST** `/api/notify/bid-submitted`

**Auth:** Internal only (called by Bidding Service)

**Request Body:**
```json
{
  "bidId": "uuid",
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "projectOwnerId": "uuid",
  "bidderName": "TechCorp Inc",
  "bidAmount": 5000.00,
  "submittedAt": "2024-01-20T14:30:00Z"
}
```

**Response:** `200 OK`

**Logic:**
- Send to specific user (project owner)
- Use `Clients.User(projectOwnerId).SendAsync("BidSubmitted", data)`

---

### 4. Trigger Bid Accepted Notification
**POST** `/api/notify/bid-accepted`

**Auth:** Internal only (called by Bidding Service)

**Request Body:**
```json
{
  "bidId": "uuid",
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "bidderId": "uuid",
  "acceptedAt": "2024-01-20T16:00:00Z"
}
```

**Response:** `200 OK`

**Logic:**
- Send to specific user (bidder)
- Use `Clients.User(bidderId).SendAsync("BidAccepted", data)`

---

### 5. Trigger Bid Rejected Notification
**POST** `/api/notify/bid-rejected`

**Auth:** Internal only (called by Bidding Service)

**Request Body:**
```json
{
  "bidId": "uuid",
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "bidderId": "uuid",
  "reason": "Budget constraints",
  "rejectedAt": "2024-01-20T16:00:00Z"
}
```

**Response:** `200 OK`

**Logic:**
- Send to specific user (bidder)
- Use `Clients.User(bidderId).SendAsync("BidRejected", data)`

---

### 6. Trigger Project Published Notification
**POST** `/api/notify/project-published`

**Auth:** Internal only (called by Project Service)

**Request Body:**
```json
{
  "projectId": "uuid",
  "projectTitle": "E-commerce Website",
  "category": "IT",
  "budget": 5000.00,
  "biddingType": "STANDARD",
  "publishedAt": "2024-01-20T10:00:00Z"
}
```

**Response:** `200 OK`

**Logic:**
- Broadcast to all connected organizations
- Use `Clients.All.SendAsync("ProjectPublished", data)` or filter by role

---

### 7. Health Check
**GET** `/api/health`

**Auth:** None

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Real-Time Service is running",
  "data": {
    "connectedClients": 45,
    "redisConnected": true
  }
}
```

---

## Authentication

### JWT Token Validation

SignalR connections must include JWT token for authentication.

**Client Connection (JavaScript):**
```javascript
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/hubs/auction", {
    accessTokenFactory: () => localStorage.getItem('jwt_token')
  })
  .build();
```

**Server-side (C#):**
```csharp
// In Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "bidsphere-auth",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]))
        };

        // For SignalR
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });
```

**Extract User ID from JWT:**
```csharp
// In Hub
public class AuctionHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("userId")?.Value;
        var userRole = Context.User?.FindFirst("role")?.Value;
        
        // Add to user-specific group
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        
        await base.OnConnectedAsync();
    }
}
```

---

## Redis Configuration

### Purpose
Redis backplane allows SignalR to scale across multiple instances.

### Setup (appsettings.json)
```json
{
  "Redis": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "BidSphere:"
  }
}
```

### Configuration (Program.cs)
```csharp
builder.Services.AddSignalR()
    .AddStackExchangeRedis(builder.Configuration["Redis:ConnectionString"], options =>
    {
        options.Configuration.ChannelPrefix = "BidSphere";
    });
```

---

## CORS Configuration

Allow frontend to connect:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for SignalR
    });
});

app.UseCors("AllowFrontend");
```

---

## Configuration (appsettings.json)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.AspNetCore.SignalR": "Debug"
    }
  },
  "AllowedHosts": "*",
  "Jwt": {
    "Secret": "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
    "Issuer": "bidsphere-auth",
    "Expiration": 86400000
  },
  "Redis": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "BidSphere:"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  }
}
```

---

## Docker Setup

Add to `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: bidsphere-redis
  ports:
    - "6379:6379"
  networks:
    - bidsphere-network

realtime-service:
  build: 
    context: ./realtime-service
    dockerfile: Dockerfile
  container_name: bidsphere-realtime-api
  ports:
    - "5000:5000"
  environment:
    ASPNETCORE_ENVIRONMENT: Production
    ASPNETCORE_URLS: http://+:5000
    Jwt__Secret: ${JWT_SECRET}
    Jwt__Issuer: bidsphere-auth
    Redis__ConnectionString: redis:6379
    Cors__AllowedOrigins__0: http://localhost:3000
    Cors__AllowedOrigins__1: http://localhost:5173
  depends_on:
    - redis
  networks:
    - bidsphere-network
```

---

## MVP Constraints

### IN SCOPE:
✅ SignalR hubs for auctions and notifications  
✅ JWT authentication for connections  
✅ Redis backplane for scaling  
✅ REST endpoints to trigger notifications  
✅ Auction bid broadcasting  
✅ Bid status notifications  
✅ Project published notifications  
✅ Connection management  

### OUT OF SCOPE (Future):
❌ Persistent notification storage  
❌ Notification history/inbox  
❌ Email/SMS notifications  
❌ Push notifications (mobile)  
❌ User presence (online/offline status)  
❌ Typing indicators  
❌ Read receipts  
❌ Notification preferences  

---

## Testing Checklist

- [ ] Connect to AuctionHub with JWT token
- [ ] Join auction room
- [ ] Receive auction bid updates
- [ ] Receive auction end notification
- [ ] Connect to NotificationHub
- [ ] Receive bid submitted notification (as project owner)
- [ ] Receive bid accepted notification (as bidder)
- [ ] Receive bid rejected notification (as bidder)
- [ ] Receive project published notification
- [ ] Trigger notifications via REST API
- [ ] Verify Redis backplane working
- [ ] Test with multiple clients
- [ ] Test authentication (reject invalid tokens)

---

## Project Structure

```
RealtimeService/
├── Hubs/
│   ├── AuctionHub.cs
│   └── NotificationHub.cs
├── Controllers/
│   └── NotifyController.cs
├── Models/
│   ├── AuctionBidNotification.cs
│   ├── AuctionEndNotification.cs
│   ├── BidNotification.cs
│   └── ProjectNotification.cs
├── Services/
│   ├── INotificationService.cs
│   └── NotificationService.cs
├── Middleware/
│   └── JwtMiddleware.cs
├── Program.cs
├── appsettings.json
└── appsettings.Development.json
```

---

## Frontend Integration

### Install SignalR Client
```bash
npm install @microsoft/signalr
```

### Connect to AuctionHub
```typescript
import * as signalR from '@microsoft/signalr';

const token = localStorage.getItem('jwt_token');

const auctionConnection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5000/hubs/auction', {
    accessTokenFactory: () => token
  })
  .withAutomaticReconnect()
  .build();

// Start connection
await auctionConnection.start();

// Join auction room
await auctionConnection.invoke('JoinAuction', auctionId);

// Listen for bid updates
auctionConnection.on('ReceiveAuctionBid', (data) => {
  console.log('New bid:', data);
  updateAuctionUI(data);
});

// Listen for auction end
auctionConnection.on('AuctionEnded', (data) => {
  console.log('Auction ended:', data);
  showAuctionEndModal(data);
});

// Leave auction room
await auctionConnection.invoke('LeaveAuction', auctionId);

// Stop connection
await auctionConnection.stop();
```

### Connect to NotificationHub
```typescript
const notificationConnection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5000/hubs/notifications', {
    accessTokenFactory: () => token
  })
  .withAutomaticReconnect()
  .build();

await notificationConnection.start();

// Join user notifications
const userId = getUserIdFromToken(token);
await notificationConnection.invoke('JoinUserNotifications', userId);

// Listen for bid submitted (project owner)
notificationConnection.on('BidSubmitted', (data) => {
  showNotification(`New bid on ${data.projectTitle}: $${data.bidAmount}`);
});

// Listen for bid accepted (bidder)
notificationConnection.on('BidAccepted', (data) => {
  showNotification(`Your bid on ${data.projectTitle} was accepted!`);
});

// Listen for bid rejected (bidder)
notificationConnection.on('BidRejected', (data) => {
  showNotification(`Your bid on ${data.projectTitle} was rejected: ${data.reason}`);
});

// Listen for new projects
notificationConnection.on('ProjectPublished', (data) => {
  showNotification(`New ${data.category} project: ${data.projectTitle}`);
});
```

### Error Handling
```typescript
auctionConnection.onclose((error) => {
  console.error('Connection closed:', error);
  // Attempt to reconnect
  setTimeout(() => auctionConnection.start(), 5000);
});

auctionConnection.onreconnecting((error) => {
  console.warn('Reconnecting:', error);
});

auctionConnection.onreconnected((connectionId) => {
  console.log('Reconnected:', connectionId);
  // Rejoin rooms
  auctionConnection.invoke('JoinAuction', auctionId);
});
```

---

## Implementation Notes

### Hub Base Class
```csharp
public class BaseHub : Hub
{
    protected string GetUserId()
    {
        return Context.User?.FindFirst("userId")?.Value;
    }

    protected string GetUserRole()
    {
        return Context.User?.FindFirst("role")?.Value;
    }

    protected bool IsAuthenticated()
    {
        return Context.User?.Identity?.IsAuthenticated ?? false;
    }
}
```

### Notification Service
```csharp
public interface INotificationService
{
    Task SendAuctionBidNotification(AuctionBidNotification notification);
    Task SendAuctionEndNotification(AuctionEndNotification notification);
    Task SendBidSubmittedNotification(BidNotification notification);
    Task SendBidAcceptedNotification(BidNotification notification);
    Task SendBidRejectedNotification(BidNotification notification);
    Task SendProjectPublishedNotification(ProjectNotification notification);
}
```

### Connection Tracking (Optional)
```csharp
// Track active connections
private static readonly ConcurrentDictionary<string, string> _connections = new();

public override async Task OnConnectedAsync()
{
    var userId = GetUserId();
    _connections.TryAdd(Context.ConnectionId, userId);
    await base.OnConnectedAsync();
}

public override async Task OnDisconnectedAsync(Exception exception)
{
    _connections.TryRemove(Context.ConnectionId, out _);
    await base.OnDisconnectedAsync(exception);
}
```

---

## Performance Considerations

1. **Use Groups** - For auction rooms, use SignalR groups instead of broadcasting to all
2. **Redis Backplane** - Essential for horizontal scaling
3. **Connection Limits** - Monitor concurrent connections
4. **Message Size** - Keep notification payloads small
5. **Reconnection** - Use automatic reconnection on client side

---

## Security Considerations

1. **JWT Validation** - Always validate JWT tokens
2. **Authorization** - Check user permissions before sending notifications
3. **Rate Limiting** - Prevent spam (optional for MVP)
4. **CORS** - Restrict to known origins
5. **Input Validation** - Validate all notification payloads
