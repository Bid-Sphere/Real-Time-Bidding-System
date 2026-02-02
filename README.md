# BidSphere - Real-Time Bidding Platform

A modern, microservices-based bidding platform that enables clients to post projects and organizations to bid on them through live auctions. Built with Spring Boot, .NET Core, React, and SignalR for real-time bidding experiences.

## Overview

BidSphere is a comprehensive bidding system where:
- **Clients** post projects with requirements, budgets, and deadlines
- **Organizations** discover projects and submit competitive bids
- **Live Auctions** enable real-time bidding with instant updates
- **Real-time Notifications** keep all parties informed of bid activity

## Architecture

### Microservices Design
```
┌─────────────┐     ┌──────────────────────────────────────┐
│   Frontend  │────▶│         NGINX Gateway                │
│  (React)    │     │         Port 8080                    │
└─────────────┘     └──────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
        ┌───────────▼──────┐   ┌───────▼────────┐
        │  Auth Service    │   │ Project Service│
        │  Port 8081       │   │ Port 8082      │
        │  (Spring Boot)   │   │ (Spring Boot)  │
        └──────────────────┘   └────────────────┘
                    │
        ┌───────────┴──────────┬────────────────┐
        │                      │                │
┌───────▼────────┐   ┌─────────▼──────┐  ┌─────▼──────────┐
│ Bidding Service│   │ Auction Service│  │ Realtime Service│
│ Port 8083      │   │ Port 8085      │  │ Port 8084       │
│ (Spring Boot)  │   │ (Spring Boot)  │  │ (.NET Core)     │
└────────────────┘   └────────────────┘  └─────────────────┘
        │                      │                │
        └──────────┬───────────┴────────────────┘
                   │
        ┌──────────▼──────────┐
        │   PostgreSQL (4x)   │
        │   Redis Cache       │
        └─────────────────────┘
```

## Technology Stack

### Backend Services

#### Java/Spring Boot Services
- **Framework**: Spring Boot 3.5.7 / 4.0.2
- **Java Version**: 17
- **Database**: PostgreSQL 15
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Key Dependencies**:
  - Spring Security
  - Spring Data JDBC
  - Spring Validation
  - Lombok
  - PostgreSQL Driver

#### .NET Core Service
- **Framework**: ASP.NET Core 8.0
- **Real-time**: SignalR with Redis backplane
- **Authentication**: JWT Bearer
- **Key Packages**:
  - Microsoft.AspNetCore.SignalR.StackExchangeRedis
  - Microsoft.AspNetCore.Authentication.JwtBearer

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Real-time**: @microsoft/signalr
- **UI Libraries**:
  - Tailwind CSS 4
  - Headless UI
  - Framer Motion
  - Lucide React (icons)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Testing**: Vitest + Testing Library

### Infrastructure
- **API Gateway**: NGINX
- **Containerization**: Docker + Docker Compose
- **Databases**: PostgreSQL 15 (4 separate instances)
- **Cache/Backplane**: Redis 7

## Project Structure

```
BidSphere/
├── backend-services/
│   ├── auth-service/              # User authentication & profiles
│   │   ├── src/main/java/com/biddingsystem/authservice/
│   │   │   ├── controller/        # REST endpoints
│   │   │   ├── service/           # Business logic
│   │   │   ├── repository/        # Data access
│   │   │   ├── model/             # Domain entities
│   │   │   ├── dto/               # Data transfer objects
│   │   │   ├── config/            # Security & app config
│   │   │   └── util/              # JWT utilities
│   │   └── pom.xml
│   │
│   ├── project-service/           # Project management
│   │   ├── src/main/java/com/bidsphere/project/
│   │   │   ├── controller/        # Project CRUD endpoints
│   │   │   ├── service/           # Project business logic
│   │   │   ├── repository/        # Project data access
│   │   │   ├── entity/            # Project entities
│   │   │   └── dto/               # Request/response DTOs
│   │   └── pom.xml
│   │
│   ├── bidding-service/           # Bid submission & management
│   │   ├── src/main/java/com/biddingsystem/bidding/
│   │   │   ├── controller/        # Bid endpoints
│   │   │   ├── service/           # Bid processing
│   │   │   ├── repository/        # Bid data access
│   │   │   └── entity/            # Bid entities
│   │   └── pom.xml
│   │
│   ├── auction-service/           # Live auction management
│   │   ├── src/main/java/com/bidsphere/auctionservice/
│   │   │   ├── controller/        # Auction & live bidding
│   │   │   ├── service/           # Auction logic
│   │   │   ├── repository/        # Auction data access
│   │   │   ├── model/             # Auction entities
│   │   │   ├── validator/         # Bid validation
│   │   │   └── constant/          # Status enums
│   │   └── pom.xml
│   │
│   └── realtime-service/          # SignalR real-time service
│       ├── Hubs/                  # SignalR hubs
│       │   ├── AuctionHub.cs      # Live auction updates
│       │   └── NotificationHub.cs # Real-time notifications
│       ├── Controllers/           # REST endpoints
│       ├── Services/              # Business logic
│       ├── DTOs/                  # Data transfer objects
│       ├── Models/                # Notification models
│       └── RealTimeService.csproj
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Login/signup forms
│   │   │   ├── client/            # Client dashboard
│   │   │   ├── projects/          # Project cards & filters
│   │   │   ├── bids/              # Bid submission
│   │   │   ├── analytics/         # Dashboard metrics
│   │   │   ├── chat/              # Messaging
│   │   │   ├── notifications/     # Notification dropdown
│   │   │   └── ui/                # Reusable UI components
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       # Landing page
│   │   │   ├── LoginPage.tsx      # Authentication
│   │   │   ├── ClientDashboard.tsx
│   │   │   └── OrganizationDashboard.tsx
│   │   ├── services/              # API clients
│   │   ├── store/                 # Zustand stores
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── types/                 # TypeScript types
│   │   └── utils/                 # Helper functions
│   ├── package.json
│   └── vite.config.ts
│
├── infrastructure/
│   ├── docker-compose.yml         # Full stack orchestration
│   └── nginx/
│       └── nginx.conf             # API Gateway configuration
│
├── shared/
│   └── database/                  # Database initialization
│       ├── auth_db/               # User & profile schemas
│       ├── project_db/            # Project schemas
│       ├── bidding_db/            # Bid schemas
│       └── auction_db/            # Auction schemas
│
├── .env.example                   # Environment template
└── README.md
```

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| **NGINX Gateway** | 8080 | API Gateway (main entry point) |
| **Frontend** | 3000 | React application |
| **Auth Service** | 8081 | Authentication & user management |
| **Project Service** | 8082 | Project CRUD operations |
| **Bidding Service** | 8083 | Bid submission & management |
| **Realtime Service** | 8084 | SignalR hubs for live updates |
| **Auction Service** | 8085 | Live auction management |
| **PostgreSQL (Auth)** | 5432 | User & profile database |
| **PostgreSQL (Project)** | 5433 | Project database |
| **PostgreSQL (Bidding)** | 5434 | Bid database |
| **PostgreSQL (Auction)** | 5435 | Auction database |
| **Redis** | 6379 | Cache & SignalR backplane |

## Database Schema

### Auth Database
- **users**: User accounts (email, password, role)
- **client**: Client profiles (company info, industry)
- **organization**: Organization profiles (company details, tax info)

### Project Database
- **projects**: Project listings with requirements
- **project_skills**: Required skills for projects
- **project_attachments**: Project files
- **project_views**: View tracking
- **project_bookmarks**: Saved projects

### Bidding Database
- **bids**: Bid submissions with proposals

### Auction Database
- **auctions**: Live auction sessions
- **auction_bids**: Real-time bids during auctions

## Prerequisites

- **Java**: JDK 17 or higher
- **.NET**: SDK 8.0 or higher
- **Node.js**: v20 or higher (see `.nvmrc`)
- **Docker** & **Docker Compose** (recommended)
- **Maven**: 3.8+ (or use included Maven wrapper)

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:Bid-Sphere/Real-Time-Bidding-System.git
cd Real-Time-Bidding-System
```

### 2. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
- **JWT_SECRET**: Secret key for JWT tokens (keep secure!)
- **SMTP_***: Email server configuration for notifications
- **CORS_ALLOWED_ORIGINS**: Frontend URL(s) for CORS

Frontend environment:
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:8080
```

### 3. Running with Docker Compose (Recommended)

Start the entire stack with one command:

```bash
docker-compose up --build
```

This will:
- Start 4 PostgreSQL databases with initialized schemas
- Start Redis for caching and SignalR backplane
- Build and start all 5 backend services
- Build and start the frontend
- Configure NGINX as API gateway

Access the application:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Swagger/API Docs**: Check individual service ports

### 4. Running Services Individually (Development)

#### Start Infrastructure
```bash
docker-compose up postgres-auth postgres-project postgres-bidding postgres-auction redis
```

#### Terminal 1: Auth Service
```bash
cd backend-services/auth-service
./mvnw spring-boot:run
# or: mvn spring-boot:run
```

#### Terminal 2: Project Service
```bash
cd backend-services/project-service
./mvnw spring-boot:run
```

#### Terminal 3: Bidding Service
```bash
cd backend-services/bidding-service
./mvnw spring-boot:run
```

#### Terminal 4: Auction Service
```bash
cd backend-services/auction-service
./mvnw spring-boot:run
```

#### Terminal 5: Realtime Service
```bash
cd backend-services/realtime-service
dotnet run
```

#### Terminal 6: Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Routes (via NGINX Gateway)

All services are accessible through `http://localhost:8080`:

| Route | Service | Description |
|-------|---------|-------------|
| `/api/auth/*` | Auth Service | Login, signup, JWT tokens |
| `/api/users/*` | Auth Service | User profiles, email verification |
| `/api/projects/*` | Project Service | Project CRUD, search, bookmarks |
| `/api/bids/*` | Bidding Service | Bid submission, bid management |
| `/api/auctions/*` | Auction Service | Auction creation, live bidding |
| `/api/notifications/*` | Realtime Service | Notification REST API |
| `/hubs/auction` | Realtime Service | SignalR auction hub (WebSocket) |
| `/hubs/notifications` | Realtime Service | SignalR notification hub (WebSocket) |

## Key Features

### For Clients
- Post projects with detailed requirements
- Set budgets, deadlines, and required skills
- Create live auctions for projects
- View and manage incoming bids
- Real-time notifications for new bids
- Accept/reject bids
- Track project analytics

### For Organizations
- Browse available projects
- Filter by category, budget, skills
- Submit competitive bids with proposals
- Participate in live auctions
- Real-time bid updates
- Track bid history and status
- Team management

### Real-time Features
- Live auction bidding with instant updates
- Real-time notifications for all bid activity
- WebSocket connections via SignalR
- Redis backplane for scalability
- Automatic reconnection handling

## Development

### Building Services

#### Java Services
```bash
# Build all Java services
cd backend-services/auth-service && ./mvnw clean install
cd backend-services/project-service && ./mvnw clean install
cd backend-services/bidding-service && ./mvnw clean install
cd backend-services/auction-service && ./mvnw clean install

# Skip tests for faster builds
./mvnw clean install -DskipTests
```

#### .NET Service
```bash
cd backend-services/realtime-service
dotnet restore
dotnet build
```

#### Frontend
```bash
cd frontend
npm install
npm run build
```

### Running Tests

#### Frontend Tests
```bash
cd frontend
npm test                    # Run once
npm run test:watch          # Watch mode
npm run test:ui             # UI mode
```

#### Java Tests
```bash
cd backend-services/<service-name>
./mvnw test
```

#### .NET Tests
```bash
cd backend-services/realtime-service/Tests
dotnet test
```

### Code Quality

#### Frontend Linting
```bash
cd frontend
npm run lint
```

## Docker Commands

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service

# Restart a service
docker-compose restart auth-service
```

## Environment Variables

### Backend Services
- `JWT_SECRET`: Base64-encoded secret for JWT signing
- `JWT_ISSUER`: JWT issuer identifier (default: bidsphere-auth)
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins
- `SMTP_*`: Email configuration for notifications
- `DB_*`: Database connection details

### Frontend
- `VITE_API_URL`: Backend API gateway URL
- `VITE_APP_NAME`: Application name

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL containers are healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres-auth`
- Verify port availability: `netstat -an | findstr "5432"`

### JWT Token Issues
- Ensure `JWT_SECRET` is the same across all services
- Check token expiration settings
- Verify CORS configuration

### SignalR Connection Issues
- Check Redis is running: `docker-compose ps redis`
- Verify WebSocket support in NGINX config
- Check browser console for connection errors

### Build Failures
- Clear Maven cache: `./mvnw clean`
- Clear npm cache: `npm cache clean --force`
- Remove Docker volumes: `docker-compose down -v`