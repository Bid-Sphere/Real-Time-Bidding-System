# 🚀 BidSphere - Project Microservice

A Spring Boot microservice for managing projects in the BidSphere bidding platform. This service handles the complete lifecycle of projects from creation to completion, including project management, search & discovery, analytics, and client dashboards.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality
- ✅ **Project CRUD Operations** - Create, Read, Update, Delete projects
- ✅ **Project Lifecycle Management** - Draft → Open → Accepting Bids → In Discussion → Closed → In Progress → Completed
- ✅ **Search & Discovery** - Advanced filtering by category, budget, location, skills, and keywords
- ✅ **Client Dashboard** - Real-time statistics and project management
- ✅ **Analytics & Tracking** - View tracking, project analytics, and engagement metrics
- ✅ **File Management** - Upload and manage project attachments (PDF, Images, CAD files)
- ✅ **Multi-visibility Support** - Projects visible to Organizations, Freelancers, or Both
- ✅ **Draft System** - Create and edit projects before publishing

### Business Logic
- ✅ Status transition validation
- ✅ Ownership verification
- ✅ Role-based access control
- ✅ Soft delete functionality
- ✅ View counting (unique and total)
- ✅ Project validation and business rules

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17+ | Programming Language |
| **Spring Boot** | 3.2.0 | Application Framework |
| **Spring Data JPA** | 3.2.0 | Database Access |
| **Spring Security** | 6.2.0 | Security Framework |
| **MySQL** | 8.0+ | Database |
| **Maven** | 3.6+ | Build Tool |
| **Hibernate** | 6.4 | ORM Framework |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- ☑️ **Java Development Kit (JDK) 17 or higher**
  - Download: https://www.oracle.com/java/technologies/downloads/
  - Verify: `java -version`

- ☑️ **Maven 3.6 or higher**
  - Download: https://maven.apache.org/download.cgi
  - Verify: `mvn -version`

- ☑️ **MySQL 8.0 or higher**
  - Download: https://dev.mysql.com/downloads/mysql/
  - Verify: `mysql --version`

- ☑️ **Git** (for cloning repository)
  - Download: https://git-scm.com/downloads
  - Verify: `git --version`

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/project-service.git
cd project-service
```

### Step 2: Set Up MySQL Database

Open MySQL Workbench or command line and run:

```sql
-- Create database
CREATE DATABASE project_auction_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create user (optional but recommended)
CREATE USER 'bidsphere_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON project_auction_db.* TO 'bidsphere_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
USE project_auction_db;
SHOW TABLES;
```

### Step 3: Configure Application

1. **Copy the example configuration:**
   ```bash
   cp src/main/resources/application-example.properties src/main/resources/application-local.properties
   ```

2. **Edit `application-local.properties`** with your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/project_auction_db
   spring.datasource.username=bidsphere_user
   spring.datasource.password=your_secure_password
   ```

3. **Or use environment variables** (recommended for production):
   ```bash
   export DB_HOST=localhost
   export DB_PORT=3306
   export DB_NAME=project_auction_db
   export DB_USERNAME=bidsphere_user
   export DB_PASSWORD=your_secure_password
   ```

### Step 4: Build the Project

```bash
# Clean and build
mvn clean install

# Skip tests if needed
mvn clean install -DskipTests
```

---

## ⚙️ Configuration

### Application Properties

Key configuration options in `application.properties`:

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Application port | 8082 |
| `spring.datasource.url` | MySQL connection URL | jdbc:mysql://localhost:3306/project_auction_db |
| `spring.jpa.hibernate.ddl-auto` | Database schema handling | update |
| `spring.servlet.multipart.max-file-size` | Max upload file size | 10MB |

### Database Schema

Tables are created automatically on first run:
- `projects` - Main project data
- `project_attachments` - File attachments
- `project_views` - View tracking
- `project_bookmarks` - User bookmarks
- `project_skills` - Required skills

---

## ▶️ Running the Application

### Option 1: Using Maven

```bash
mvn spring-boot:run
```

### Option 2: Using JAR

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/project-service-1.0.0.jar
```

### Option 3: Using IDE

1. Import project as Maven project
2. Run `ProjectServiceApplication.java` as Java Application

### Verify Application Started

You should see:

```
╔════════════════════════════════════════════════════════╗
║   🚀 Project Microservice Started Successfully!     ║
║   📍 Port: 8082                                      ║
║   📊 Database: project_auction_db (MySQL)           ║
║   🔗 API Docs: http://localhost:8082/api/projects  ║
╚════════════════════════════════════════════════════════╝
```

### Health Check

```bash
curl http://localhost:8082/api/projects/health
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8082/api/projects
```

### Authentication Headers

All protected endpoints require these headers:

```
X-User-Id: {user_id}
X-User-Name: {user_name}
X-User-Role: {CLIENT|ORGANIZATION|FREELANCER}
```

### Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Health check | ❌ |
| `POST` | `/` | Create project | ✅ CLIENT |
| `GET` | `/{id}` | Get project by ID | ❌ |
| `GET` | `/` | List all projects | ❌ |
| `PUT` | `/{id}` | Update project | ✅ CLIENT (Owner) |
| `DELETE` | `/{id}` | Delete project | ✅ CLIENT (Owner) |
| `PATCH` | `/{id}/status` | Update status | ✅ CLIENT (Owner) |
| `POST` | `/{id}/publish` | Publish draft | ✅ CLIENT (Owner) |
| `GET` | `/my-projects` | Get client's projects | ✅ CLIENT |
| `GET` | `/client/stats` | Dashboard statistics | ✅ CLIENT |
| `POST` | `/{id}/view` | Track project view | ❌ |
| `GET` | `/{id}/analytics` | Get project analytics | ✅ CLIENT (Owner) |

### Example Requests

#### 1. Create Project

```bash
POST http://localhost:8082/api/projects
Content-Type: application/json
X-User-Id: client_001
X-User-Name: John Smith
X-User-Role: CLIENT

{
  "title": "E-commerce Platform Development",
  "description": "Full-stack e-commerce platform with React and Node.js...",
  "category": "IT",
  "budget": 25000,
  "deadline": "2026-06-30T23:59:59",
  "location": "Remote",
  "requiredSkills": ["React", "Node.js", "MySQL"],
  "strictDeadline": true,
  "biddingType": "STANDARD",
  "visibility": "BOTH",
  "isDraft": false
}
```

#### 2. Get All Projects (with filters)

```bash
GET http://localhost:8082/api/projects?category=IT&minBudget=10000&maxBudget=50000&page=0&limit=20
```

Query Parameters:
- `category` - Filter by category (IT, CONSTRUCTION, SUPPLY)
- `status` - Filter by status (OPEN, ACCEPTING_BIDS, etc.)
- `minBudget` - Minimum budget
- `maxBudget` - Maximum budget
- `location` - Filter by location
- `search` - Search in title/description
- `sort` - Sort by (newest, oldest, budget_high, budget_low, deadline_urgent)
- `page` - Page number (default: 0)
- `limit` - Items per page (default: 20)

#### 3. Update Project Status

```bash
PATCH http://localhost:8082/api/projects/{id}/status
Content-Type: application/json
X-User-Id: client_001
X-User-Role: CLIENT

{
  "status": "ACCEPTING_BIDS",
  "reason": "Project is now ready for bids"
}
```

Valid status transitions:
- `DRAFT` → `OPEN`
- `OPEN` → `ACCEPTING_BIDS`, `CLOSED`
- `ACCEPTING_BIDS` → `IN_DISCUSSION`, `CLOSED`
- `IN_DISCUSSION` → `ACCEPTING_BIDS`, `CLOSED`
- `CLOSED` → `IN_PROGRESS`
- `IN_PROGRESS` → `COMPLETED`

---

## 🧪 Testing

### Using Postman

1. **Import Postman Collection** (if provided) or create requests manually

2. **Set Environment Variables:**
   ```
   base_url = http://localhost:8082
   client_id = client_001
   client_name = John Smith
   client_role = CLIENT
   ```

3. **Test Scenarios:**

#### Scenario 1: Complete Project Lifecycle
```
1. Create Draft Project
2. Update Draft
3. Publish Draft (DRAFT → OPEN)
4. Update Status (OPEN → ACCEPTING_BIDS)
5. Update Status (ACCEPTING_BIDS → IN_DISCUSSION)
6. Update Status (IN_DISCUSSION → CLOSED)
7. Update Status (CLOSED → IN_PROGRESS)
8. Update Status (IN_PROGRESS → COMPLETED)
```

#### Scenario 2: Search & Filter
```
1. Create 5 different projects (different categories and budgets)
2. Test category filter: ?category=IT
3. Test budget filter: ?minBudget=20000&maxBudget=50000
4. Test search: ?search=website
5. Test sorting: ?sort=budget_high
```

#### Scenario 3: Client Dashboard
```
1. Create 3 projects as client_001
2. Get my-projects: GET /my-projects
3. Get stats: GET /client/stats
4. Verify counts match
```

### Sample Test Data

See [TESTING.md](TESTING.md) for complete test data and scenarios.

### Using cURL

#### Health Check
```bash
curl http://localhost:8082/api/projects/health
```

#### Create Project
```bash
curl -X POST http://localhost:8082/api/projects \
  -H "Content-Type: application/json" \
  -H "X-User-Id: client_001" \
  -H "X-User-Name: John Smith" \
  -H "X-User-Role: CLIENT" \
  -d '{
    "title": "Test Project",
    "description": "This is a test project for the microservice...",
    "category": "IT",
    "budget": 10000,
    "deadline": "2026-12-31T23:59:59",
    "location": "Remote",
    "requiredSkills": ["Java", "Spring Boot"],
    "strictDeadline": false,
    "biddingType": "STANDARD",
    "visibility": "BOTH",
    "isDraft": false
  }'
```

#### Get All Projects
```bash
curl http://localhost:8082/api/projects?page=0&limit=10
```

---

## 🗄️ Database Schema

### Tables Overview

#### `projects`
Main project information table.

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(255) | Primary key (UUID) |
| `title` | VARCHAR(200) | Project title |
| `description` | TEXT | Detailed description |
| `category` | ENUM | IT, CONSTRUCTION, SUPPLY |
| `client_id` | VARCHAR(100) | Project owner |
| `budget` | DECIMAL(12,2) | Project budget |
| `deadline` | DATETIME | Project deadline |
| `status` | ENUM | Current status |
| `is_draft` | BOOLEAN | Draft flag |
| `is_deleted` | BOOLEAN | Soft delete flag |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

#### `project_attachments`
File attachments for projects.

#### `project_views`
Tracks project views for analytics.

#### `project_bookmarks`
User bookmarks (Phase 4 feature).

#### `project_skills`
Required skills for projects.

### Entity Relationships

```
projects (1) ----< (N) project_attachments
projects (1) ----< (N) project_views
projects (1) ----< (N) project_bookmarks
projects (1) ----< (N) project_skills
```

---

## 📁 Project Structure

```
project-service/
├── src/
│   ├── main/
│   │   ├── java/com/bidsphere/project/
│   │   │   ├── ProjectServiceApplication.java
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   └── ProjectController.java
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   ├── entity/
│   │   │   │   ├── Project.java
│   │   │   │   ├── ProjectAttachment.java
│   │   │   │   ├── ProjectView.java
│   │   │   │   └── ProjectBookmark.java
│   │   │   ├── enums/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   │       ├── ProjectService.java
│   │   │       └── impl/
│   │   │           └── ProjectServiceImpl.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-example.properties
│   └── test/
│       └── java/com/bidsphere/project/
├── target/
├── .gitignore
├── pom.xml
├── README.md
└── TESTING.md
```

---

## 🔒 Security

### Best Practices Implemented

- ✅ **Role-based Access Control** - Only project owners can modify their projects
- ✅ **Input Validation** - All inputs validated using Bean Validation
- ✅ **SQL Injection Prevention** - Using JPA with parameterized queries
- ✅ **Soft Delete** - Projects are never truly deleted
- ✅ **Password Handling** - No passwords stored in code (use environment variables)

### Security Headers Required

Protected endpoints require authentication headers:
```
X-User-Id: {user_id}
X-User-Role: {role}
```

---

## 🚧 Roadmap

### Phase 1 (Current) ✅
- Core CRUD operations
- Search and filtering
- Project lifecycle management
- Client dashboard
- View tracking

### Phase 2 (Planned)
- Integration with Bidding Service
- Bid count tracking
- Average bid calculations
- Notify bidders on project updates

### Phase 3 (Future)
- Integration with Auction Service
- Live auction coordination
- Real-time bidding

### Phase 4 (Future)
- Trending projects algorithm
- Personalized recommendations
- Bookmark functionality

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java naming conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update README if adding new features
- Ensure all tests pass

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cannot connect to MySQL
```
Solution: Check MySQL is running and credentials are correct
Verify: mysql -u root -p
```

**Issue**: Port 8082 already in use
```
Solution: Change port in application.properties
server.port=8083
```

**Issue**: Tables not created
```
Solution: Check spring.jpa.hibernate.ddl-auto=update
Or manually create tables using schema.sql
```

---


## 👥 Authors


---



---

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/project-service?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/project-service?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/project-service)

---


