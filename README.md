# Real Time Bidding System

A microservices-based bidding system with real-time auction capabilities.

## Project Structure

```
CDAC Project/
├── backend-services/           # Maven multi-module project (Java/Spring Boot)
│   ├── pom.xml                # Parent POM
│   ├── common/                # Shared utilities and DTOs
│   │   ├── pom.xml
│   │   └── src/main/java/com/biddingsystem/common/
│   │       ├── dto/           # Data Transfer Objects
│   │       ├── exception/     # Common exceptions
│   │       ├── security/      # JWT utilities
│   │       └── ...
│   ├── auth-service/          # Authentication service (Port 8081)
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   └── src/
│   ├── project-auction-service/ # Project & Auction management (Port 8082)
│   │   ├── pom.xml
│   │   ├── Dockerfile
│   │   └── src/
│   └── bidding-service/       # Bidding logic (Port 8083)
│       ├── pom.xml
│       ├── Dockerfile
│       └── src/
│
├── realtime-service/          # .NET SignalR service (Port 5000)
│   ├── RealtimeService/
│   │   ├── RealtimeService.csproj
│   │   ├── appsettings.json
│   │   └── ...
│   └── Dockerfile
│
├── frontend/                  # React + TypeScript + Vite (Port 3000)
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── src/
│
├── infrastructure/
│   ├── docker-compose.yml     # Full stack orchestration
│   └── nginx/
│       └── nginx.conf         # API Gateway (Port 8080)
│
├── shared/
│   └── database/              # Database initialization scripts
│       ├── auth_db/
│       ├── project_auction_db/
│       └── bidding_db/
│
├── .gitignore
├── .gitattributes
└── README.md
```

## Technology Stack

### Backend Services (Java)
- **Framework**: Spring Boot 3.2.0
- **Java Version**: 17
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Build Tool**: Maven
- **Key Dependencies**:
  - Spring Data JPA
  - Spring Security
  - JWT (io.jsonwebtoken)
  - Flyway (migrations)
  - Lombok
  - MapStruct

### Real-Time Service (.NET)
- **Framework**: ASP.NET Core 8.0
- **Real-time**: SignalR with Redis backplane
- **Database**: PostgreSQL (via Npgsql)
- **Authentication**: JWT Bearer

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Key Libraries**:
  - React Router DOM
  - TanStack Query (React Query)
  - Zustand (state management)
  - Axios
  - SignalR Client
  - Headless UI
  - Framer Motion
  - React Hook Form + Zod
  - date-fns
  - React Hot Toast

### Infrastructure
- **API Gateway**: NGINX
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Databases**: PostgreSQL (3 instances)
- **Cache**: Redis

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Auth Service | 8081 | User authentication & JWT |
| Project-Auction Service | 8082 | Projects & auctions management |
| Bidding Service | 8083 | Bid processing |
| Real-Time Service | 5000 | SignalR hub for live updates |
| NGINX Gateway | 8080 | API Gateway |
| Frontend | 3000 | React application |
| PostgreSQL (Auth) | 5432 | Auth database |
| PostgreSQL (Projects) | 5433 | Projects database |
| PostgreSQL (Bidding) | 5434 | Bidding database |
| Redis | 6379 | Cache & SignalR backplane |

## Prerequisites

- **Java**: JDK 17 or higher
- **.NET**: SDK 8.0 or higher
- **Node.js**: v20 or higher
- **Maven**: 3.8+ (or use Maven wrapper)
- **Docker** & **Docker Compose** (for containerized setup)
- **PostgreSQL**: 15+ (if running locally)
- **Redis**: 7+ (if running locally)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "CDAC Project"
```

### 2. Environment Setup

#### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

#### Backend Services
Each service has an `application.yml` with default configurations. Update database URLs, Redis host, and JWT secrets as needed.

### 3. Build All Services

#### Java Services
```bash
cd backend-services
mvn clean install
```

#### .NET Service
```bash
cd realtime-service/RealtimeService
dotnet build
```

#### Frontend
```bash
cd frontend
npm install
npm run build
```

### 4. Running with Docker Compose (Recommended)

```bash
cd infrastructure
docker-compose up --build
```

This will start all services, databases, and the frontend.

### 5. Running Services Individually (Development)

#### Start Databases
```bash
cd infrastructure
docker-compose up postgres-auth postgres-project-auction postgres-bidding redis
```

#### Terminal 1: Auth Service
```bash
cd backend-services/auth-service
mvn spring-boot:run
```

#### Terminal 2: Project-Auction Service
```bash
cd backend-services/project-auction-service
mvn spring-boot:run
```

#### Terminal 3: Bidding Service
```bash
cd backend-services/bidding-service
mvn spring-boot:run
```

#### Terminal 4: Real-Time Service
```bash
cd realtime-service/RealtimeService
dotnet run
```

#### Terminal 5: Frontend
```bash
cd frontend
npm run dev
```

## API Gateway Routes

All services are accessible through NGINX at `http://localhost:8080`:

- `http://localhost:8080/api/auth/*` → Auth Service
- `http://localhost:8080/api/projects/*` → Project-Auction Service
- `http://localhost:8080/api/auctions/*` → Project-Auction Service
- `http://localhost:8080/api/bids/*` → Bidding Service
- `http://localhost:8080/hub/*` → Real-Time Service (SignalR)

## Development Guidelines

### For Backend Team (Java)
- Each service has its own package structure under `src/main/java/com/biddingsystem/<service-name>/`
- Create packages as needed: `controller`, `service`, `repository`, `model`, `dto`, `config`, etc.
- Use the `common` module for shared utilities
- Database migrations go in `src/main/resources/db/migration/`

### For .NET Team
- SignalR hubs and related code go in the `RealtimeService` project
- Follow ASP.NET Core conventions for folder structure

### For Frontend Team
- Create folders as needed: `components`, `pages`, `hooks`, `services`, `store`, `types`, etc.
- Use the provided libraries for state management and API calls
- SignalR connection setup for real-time features

## Useful Commands

### Maven
```bash
# Build all services
mvn clean install

# Build without tests
mvn clean install -DskipTests

# Run specific service
cd <service-name> && mvn spring-boot:run

# Run tests
mvn test
```

### .NET
```bash
# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run

# Test
dotnet test
```

### Docker
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop all
docker-compose down

# View logs
docker-compose logs -f <service-name>

# Remove volumes (clean slate)
docker-compose down -v
```

## Cross-Platform Notes

This project is configured to work on both Linux and Windows:
- Line endings are normalized to LF (Unix-style) via `.gitattributes`
- Paths use forward slashes in configuration files
- Docker Compose handles path differences automatically

## Next Steps

1. Implement authentication logic in Auth Service
2. Add CRUD operations in Project-Auction Service
3. Implement bidding logic in Bidding Service
4. Create SignalR hubs in Real-Time Service
5. Build frontend components and pages
6. Set up database migrations
7. Add comprehensive error handling
8. Write unit and integration tests
9. Configure CI/CD pipelines

## Contributing

Please follow the coding standards and conventions for each technology stack. Create feature branches and submit pull requests for review.

## License

[Add your license information here]
