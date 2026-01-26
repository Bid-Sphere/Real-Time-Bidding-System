# 🧪 Testing Guide - Project Microservice

Complete guide for testing all features of the Project Microservice.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Test Data](#test-data)
- [API Tests](#api-tests)
- [Test Scenarios](#test-scenarios)
- [Database Verification](#database-verification)

---

## ✅ Prerequisites

- Application running on `http://localhost:8082`
- MySQL database `project_auction_db` created
- Postman or cURL installed
- Database client (MySQL Workbench) for verification

---

## 🚀 Setup

### Postman Environment

Create a new environment with these variables:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:8082` |
| `client_id` | `client_001` |
| `client_name` | `John Smith` |
| `client_role` | `CLIENT` |

---

## 📊 Test Data

### Project 1: IT - E-commerce

```json
{
  "title": "E-commerce Platform Development",
  "description": "Full-stack e-commerce platform with React, Node.js, MySQL, Stripe integration, admin dashboard, and AWS deployment.",
  "category": "IT",
  "budget": 25000,
  "deadline": "2026-06-30T23:59:59",
  "location": "Remote",
  "requiredSkills": ["React", "Node.js", "MySQL", "Stripe", "AWS"],
  "strictDeadline": true,
  "biddingType": "STANDARD",
  "visibility": "BOTH",
  "isDraft": false
}
```

### Project 2: Construction - Office Building

```json
{
  "title": "Commercial Office Building Renovation",
  "description": "Complete renovation of 5000 sq ft office space including electrical, HVAC, plumbing, flooring, and painting.",
  "category": "CONSTRUCTION",
  "budget": 150000,
  "deadline": "2026-03-31T23:59:59",
  "location": "New York, NY",
  "requiredSkills": ["General Contracting", "Electrical", "HVAC", "Plumbing"],
  "strictDeadline": true,
  "biddingType": "STANDARD",
  "visibility": "ORGANIZATIONS",
  "isDraft": false
}
```

### Project 3: Supply - Office Furniture

```json
{
  "title": "Office Furniture Supply for 50-Person Workspace",
  "description": "Complete office furniture package including desks, chairs, tables, filing cabinets, and reception furniture.",
  "category": "SUPPLY",
  "budget": 75000,
  "deadline": "2026-02-28T23:59:59",
  "location": "San Francisco, CA",
  "requiredSkills": ["Office Furniture", "Commercial Supply", "Installation"],
  "strictDeadline": false,
  "biddingType": "STANDARD",
  "visibility": "BOTH",
  "isDraft": false
}
```

### Project 4: IT - Mobile App (DRAFT)

```json
{
  "title": "iOS Fitness Tracking App",
  "description": "iOS app with HealthKit integration, workout tracking, social features, and premium subscriptions.",
  "category": "IT",
  "budget": 40000,
  "deadline": "2026-08-31T23:59:59",
  "location": "Remote",
  "requiredSkills": ["Swift", "iOS", "HealthKit", "Firebase"],
  "strictDeadline": false,
  "biddingType": "STANDARD",
  "visibility": "FREELANCERS",
  "isDraft": true
}
```

---

## 🔬 API Tests

### Test 1: Health Check ✅

```bash
GET http://localhost:8082/api/projects/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Project Service is running",
  "data": "OK"
}
```

**Status:** 200 OK

---

### Test 2: Create Project ✅

```bash
POST http://localhost:8082/api/projects

Headers:
Content-Type: application/json
X-User-Id: client_001
X-User-Name: John Smith
X-User-Role: CLIENT

Body: [Use Project 1 data above]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "generated-uuid-here",
    "title": "E-commerce Platform Development",
    "status": "OPEN",
    "budget": 25000,
    ...
  }
}
```

**Status:** 201 Created

⚠️ **Save the returned `id` for subsequent tests!**

---

### Test 3: Get Project by ID ✅

```bash
GET http://localhost:8082/api/projects/{project_id}

Headers:
X-User-Id: client_001
```

**Expected:** Full project details

**Status:** 200 OK

---

### Test 4: List All Projects ✅

```bash
GET http://localhost:8082/api/projects?page=0&limit=20
```

**Expected:** Paginated list of all published projects (drafts excluded)

**Status:** 200 OK

---

### Test 5: Filter by Category ✅

```bash
GET http://localhost:8082/api/projects?category=IT&page=0&limit=10
```

**Expected:** Only IT projects

**Status:** 200 OK

---

### Test 6: Filter by Budget Range ✅

```bash
GET http://localhost:8082/api/projects?minBudget=50000&maxBudget=200000
```

**Expected:** Projects with budget between 50K and 200K

**Status:** 200 OK

---

### Test 7: Search by Keyword ✅

```bash
GET http://localhost:8082/api/projects?search=office
```

**Expected:** Projects containing "office" in title or description

**Status:** 200 OK

---

### Test 8: Sort by Budget ✅

```bash
GET http://localhost:8082/api/projects?sort=budget_high
```

**Expected:** Projects sorted by budget (highest first)

**Status:** 200 OK

---

### Test 9: Update Project ✅

```bash
PUT http://localhost:8082/api/projects/{project_id}

Headers:
Content-Type: application/json
X-User-Id: client_001
X-User-Role: CLIENT

Body:
{
  "title": "E-commerce Platform Development (UPDATED)",
  "budget": 30000,
  ...
}
```

**Expected:** Updated project with new values

**Status:** 200 OK

---

### Test 10: Publish Draft ✅

```bash
POST http://localhost:8082/api/projects/{draft_project_id}/publish

Headers:
X-User-Id: client_001
X-User-Role: CLIENT
```

**Expected:** Status changes from DRAFT to OPEN

**Status:** 200 OK

---

### Test 11: Update Status ✅

```bash
PATCH http://localhost:8082/api/projects/{project_id}/status

Headers:
Content-Type: application/json
X-User-Id: client_001
X-User-Role: CLIENT

Body:
{
  "status": "ACCEPTING_BIDS",
  "reason": "Ready for bids"
}
```

**Expected:** Status updated to ACCEPTING_BIDS

**Status:** 200 OK

---

### Test 12: Get My Projects ✅

```bash
GET http://localhost:8082/api/projects/my-projects?page=0&limit=20

Headers:
X-User-Id: client_001
X-User-Role: CLIENT
```

**Expected:** All projects created by client_001

**Status:** 200 OK

---

### Test 13: Get Dashboard Stats ✅

```bash
GET http://localhost:8082/api/projects/client/stats

Headers:
X-User-Id: client_001
X-User-Role: CLIENT
```

**Expected:**
```json
{
  "totalProjects": 2,
  "activeProjects": 1,
  "draftProjects": 0,
  "completedProjects": 0
}
```

**Status:** 200 OK

---

### Test 14: Track View ✅

```bash
POST http://localhost:8082/api/projects/{project_id}/view

Headers:
X-User-Id: viewer_123
X-User-Type: ORGANIZATION
X-Session-Id: session_abc
```

**Expected:** View tracked successfully

**Status:** 200 OK

---

### Test 15: Get Analytics ✅

```bash
GET http://localhost:8082/api/projects/{project_id}/analytics

Headers:
X-User-Id: client_001
X-User-Role: CLIENT
```

**Expected:**
```json
{
  "projectId": "...",
  "totalViews": 5,
  "uniqueViews": 3,
  "bookmarkCount": 0
}
```

**Status:** 200 OK

---

### Test 16: Delete Project ✅

```bash
DELETE http://localhost:8082/api/projects/{project_id}

Headers:
X-User-Id: client_001
X-User-Role: CLIENT
```

**Expected:** Project soft-deleted (only works for DRAFT or OPEN status)

**Status:** 200 OK

---

## 🎯 Test Scenarios

### Scenario 1: Complete Project Lifecycle

```
1. Create draft project
2. Update draft details
3. Publish draft (DRAFT → OPEN)
4. Update status (OPEN → ACCEPTING_BIDS)
5. Update status (ACCEPTING_BIDS → IN_DISCUSSION)
6. Update status (IN_DISCUSSION → CLOSED)
7. Update status (CLOSED → IN_PROGRESS)
8. Update status (IN_PROGRESS → COMPLETED)
9. Get analytics
```

**Expected:** Project moves through all statuses successfully

---

### Scenario 2: Search and Filter

```
1. Create 5 projects with different:
   - Categories (IT, CONSTRUCTION, SUPPLY)
   - Budgets (10K, 50K, 100K, 150K, 450K)
   - Locations

2. Test filters:
   - By category
   - By budget range
   - By location
   - By keyword search
   - Combined filters

3. Test sorting:
   - By budget (high/low)
   - By deadline (urgent)
   - By created date (newest/oldest)
```

**Expected:** Correct filtering and sorting results

---

### Scenario 3: Authorization Tests

```
1. Create project as client_001
2. Try to update as client_002 (different user)
   Expected: 403 Forbidden

3. Try to delete as client_002
   Expected: 403 Forbidden

4. Try to access /my-projects with FREELANCER role
   Expected: 403 Forbidden
```

**Expected:** Proper authorization enforcement

---

### Scenario 4: Validation Tests

```
1. Create project with title < 10 characters
   Expected: 400 Bad Request

2. Create project with budget < 100
   Expected: 400 Bad Request

3. Create project with past deadline
   Expected: 400 Bad Request

4. Update status with invalid transition (OPEN → COMPLETED)
   Expected: 400 Bad Request
```

**Expected:** Validation errors with clear messages

---

## 🗄️ Database Verification

After running tests, verify in MySQL:

### Check All Projects

```sql
SELECT id, title, category, budget, status, is_draft, is_deleted, created_at
FROM projects
ORDER BY created_at DESC;
```

### Count by Category

```sql
SELECT category, COUNT(*) as count
FROM projects
WHERE is_deleted = false
GROUP BY category;
```

### Count by Status

```sql
SELECT status, COUNT(*) as count
FROM projects
WHERE is_deleted = false
GROUP BY status;
```

### View Tracking

```sql
SELECT p.title, COUNT(pv.id) as view_count
FROM projects p
LEFT JOIN project_views pv ON p.id = pv.project_id
GROUP BY p.id, p.title
ORDER BY view_count DESC;
```

### Projects with Skills

```sql
SELECT p.title, ps.skill
FROM projects p
JOIN project_skills ps ON p.id = ps.project_id
WHERE p.id = 'your-project-id';
```

---

## ✅ Test Checklist

- [ ] Health check works
- [ ] Can create project (published)
- [ ] Can create project (draft)
- [ ] Can get project by ID
- [ ] Can list all projects
- [ ] Category filter works
- [ ] Budget filter works
- [ ] Search works
- [ ] Sorting works
- [ ] Can update project
- [ ] Can publish draft
- [ ] Can update status through lifecycle
- [ ] Status transition validation works
- [ ] Get my projects works
- [ ] Dashboard stats accurate
- [ ] View tracking works
- [ ] Analytics data correct
- [ ] Can delete project (when allowed)
- [ ] Cannot delete project with wrong owner
- [ ] Cannot update project with wrong owner
- [ ] Validation errors work correctly

---

## 📊 Expected Test Results

After completing all tests:

| Metric | Expected Value |
|--------|----------------|
| Total Projects Created | 4-5 |
| Published Projects | 3-4 |
| Draft Projects | 0-1 |
| Categories Used | 3 (IT, CONSTRUCTION, SUPPLY) |
| Total Budget | ~$690,000 |
| Status Transitions | 8 successful |
| Views Tracked | 5+ |
| Validation Errors | 4+ caught |

---

## 🐛 Troubleshooting Tests

### Issue: 401 Unauthorized
**Solution:** Add required headers (X-User-Id, X-User-Role)

### Issue: 403 Forbidden
**Solution:** Check user is project owner for update/delete operations

### Issue: 400 Bad Request
**Solution:** Check request body format and validation rules

### Issue: 404 Not Found
**Solution:** Verify project ID exists and is not deleted

### Issue: Views not counting
**Solution:** Use different userId or sessionId for each view

---
