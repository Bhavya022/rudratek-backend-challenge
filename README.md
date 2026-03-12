# Rudratek Project Management API

A secure, multi-tenant RESTful API built with Node.js, Express, and MongoDB.

## Features

- **Strict JWT Authentication**: Secure user registration and login.
- **Multi-Tenancy**: Data is isolated by `tenantId`. Users only see projects belonging to their company/tenant.
- **Resource Ownership**: Users can only modify or delete projects they created.
- **Input Validation**: Robust validation using `express-validator` to prevent malformed data.
- **Security**: Implements `helmet` for security headers, `cors` for cross-origin resource sharing, and `bcryptjs` for password hashing.
- **Modular Architecture**: Clean separation of concerns with Controllers, Services, Routes, and Models.

## Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

## Running the App

### Development Mode
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

## API Documentation (Postman Style)

### 1. Authentication

#### **Register User**
`POST /api/v1/auth/register`
*   **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "tenantId": "company-a"
    }
    ```
*   **Response**: `201 Created` with JWT token.

#### **Login User**
`POST /api/v1/auth/login`
*   **Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response**: `200 OK` with JWT token.

#### **Get Me**
`GET /api/v1/auth/me`
*   **Header**: `Authorization: Bearer <token>`
*   **Response**: `200 OK` with user profile.

---

### 2. Projects (Private)

#### **Get All Projects**
`GET /api/v1/projects`
*   **Header**: `Authorization: Bearer <token>`
*   **Description**: Returns all projects belonging to the user's `tenantId`.
*   **Response**: `200 OK` list of projects.

#### **Create Project**
`POST /api/v1/projects`
*   **Header**: `Authorization: Bearer <token>`
*   **Body**:
    ```json
    {
      "title": "New Project",
      "description": "Project details summary"
    }
    ```
*   **Response**: `201 Created`.

#### **Get Single Project**
`GET /api/v1/projects/:id`
*   **Header**: `Authorization: Bearer <token>`
*   **Response**: `200 OK` (404 if project belongs to another tenant).

#### **Update Project**
`PUT /api/v1/projects/:id`
*   **Header**: `Authorization: Bearer <token>`
*   **Body**:
    ```json
    {
      "title": "Updated Title",
      "status": "in-progress"
    }
    ```
*   **Response**: `200 OK` (Only allowed if user is the owner).

#### **Delete Project**
`DELETE /api/v1/projects/:id`
*   **Header**: `Authorization: Bearer <token>`
*   **Response**: `200 OK` (Only allowed if user is the owner).

## Project Structure

```
├── src/
│   ├── config/      # Database connection
│   ├── controllers/ # Request handlers
│   ├── middleware/  # Auth, Error & Validation middlewares
│   ├── models/      # Mongoose schemas (User, Project)
│   ├── routes/      # Express routes
│   ├── services/    # Business logic (Tenant isolation)
│   ├── tests/       # Integration tests
│   ├── app.js       # App setup
│   └── server.js    # Entry point
├── .env             # Environment variables
├── package.json     # Scripts & Deps
└── README.md        # Documentation
```
