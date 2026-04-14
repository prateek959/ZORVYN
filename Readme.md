# ZORVYN - Financial Management API

A comprehensive financial management system built with Express.js and MongoDB. This API provides robust financial record management, user authentication, role-based access control, and analytics features.

## 🚀 Live Demo

- **Backend URL**: https://zorvyn-hbbq.onrender.com
- **GitHub Repository**: https://github.com/prateek959/ZORVYN

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)

## ✨ Features

- User authentication with JWT tokens
- Role-based access control (Admin, Analyst, Viewer)
- Financial record management (CRUD operations)
- Advanced filtering and analytics
- User management
- Dashboard analytics
- Password hashing with Argon2
- CORS enabled

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Argon2
- **Other**: CORS, dotenv

## 🏗 System Design

- Authentication handled via JWT middleware
- Role-based access controlled using custom middleware
- Finance records linked with users via ObjectId
- Analytics calculated dynamically from database records

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/prateek959/ZORVYN.git
cd ZORVYN
```

2. Install dependencies
```bash
npm install
```

3. Create your `.env` file with the required environment variables (see below)

4. Start the development server
```bash
npm run dev
```

The server will run on `http://localhost:3002`

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET_KEY=your_secret_key_here
MONGODB_DEV_URI=mongodb://localhost:27017/finance
MONGODB_PROD_URI=mongodb+srv://username:password@cluster.mongodb.net/finance
```

## 🔑 Authentication

All routes except `/auth/register` and `/auth/login` require a valid JWT token in the request header.

**Header format:**
```
Authorization: Bearer <your_jwt_token>
```

## 🔒 Security Notes
- Passwords are hashed using Argon2
- JWT tokens expire in 24 hours
- Protected routes require valid authentication token
- Role-based middleware ensures proper access control

## 👥 Role-Based Access Control

The system supports three user roles:
- **Admin**: Full access to all resources
- **Analyst**: Can manage financial records and view analytics
- **Viewer**:  Can view only their own analytics data

---

## 📡 API Routes

### 1. Authentication Routes

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "viewer",
  "isActive": true
}
```

**Response (201):**
```json
{
  "message": "User Register Successfully"
}
```

**Note:** 
- `name` is required (full name as single field)
- `email` must be unique
- `password` will be hashed with Argon2
- `role` defaults to "viewer" if not provided (options: "viewer", "analyst", "admin")
- `isActive` defaults to true if not provided

---

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWZkMzE2MzBkN2YyYTAwMWE5OWZkMTEiLCJyb2xlIjoiYW5hbHlzdCIsImlhdCI6MTcxMDM0NTYzMywiZXhwIjoxNzEwNDMyMDMzfQ..."
}
```

**Note:**
- Token expires in 24 hours (1d)
- Use token in Authorization header: `Authorization: Bearer <token>`
- Returns error if user not found or password invalid
- Returns error if user account is inactive

---

### 2. User Routes

> ⚠️ **Protected Route** - Requires Admin role

#### Get All Users
```http
GET /users/
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "analyst",
      "isActive": true,
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

**Note:** 
- Only Admin users can access this endpoint
- Returns empty message if no users found

---

#### Update User Role
```http
PUT /users/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response (200):**
```json
{
  "message": "User Role Updated Successfully"
}
```

**Note:**
- Only Admin users can access this endpoint
- Valid roles: "admin", "analyst", "viewer"
- Returns error if invalid role provided

---

#### Update User Status
```http
PATCH /users/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "isActive": false
}
```

**Response (200):**
```json
{
  "message": "User Status Updated Successfully"
}
```

**Note:**
- Only Admin users can access this endpoint
- `isActive` must be a boolean (true/false)
- When user is inactive, they cannot login

---

### 3. Dashboard Routes

> ⚠️ **Protected Route** - Requires Admin/Analyst/Viewer role

#### Get Analytics Dashboard
```http
GET /dashboard/
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalIncome": 50000,
  "totalExpense": 15000,
  "netBalance": 35000,
  "categoryWise": {
    "food": 3000,
    "transport": 2000,
    "entertainment": 10000
  },
  "recentTransactions": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "amount": 5000,
      "type": "income",
      "category": "salary",
      "note": "Monthly salary",
      "date": "2024-03-15T10:30:00.000Z",
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

**Note:** 
- Accessible by Admin, Analyst, and Viewer roles
- Admin: Can view analytics of all users combined
- Analyst: Can view only their own analytics
- Viewer: Can view only their own analytics
- Shows last 5 recent transactions in recentTransactions array
- categoryWise only includes expense categories

---

### 4. Financial Records Routes

> ⚠️ **Protected Routes** - Requires Admin/Analyst role (except where noted)

#### Create Financial Record
```http
POST /records/
Authorization: Bearer <token>
```

**Required Roles:** Admin or Analyst

**Request Body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "note": "Monthly salary payment"
}
```

**Response (201):**
```json
{
  "message": "Records Created Successfully"
}
```

**Note:**
- `amount` is required (must be a number)
- `type` is required (options: "income", "expense")
- `category` is optional (string field)
- `note` is optional (additional details)
- `date` defaults to current timestamp
- `userId` is automatically extracted from JWT token
- Monthly/weekly trends are not implemented but can be added as enhancement

---

#### Get All Financial Records
```http
GET /records/
Authorization: Bearer <token>
```

**Required Roles:** Admin or Analyst

**Response (200):**
```json
{
  "records": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "amount": 5000,
      "type": "income",
      "category": "salary",
      "note": "Monthly salary payment",
      "date": "2024-03-15T10:30:00.000Z",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

**Note:**
- Records are sorted by date (newest first)
- Admin sees all records
- Analyst only sees their own records
- Returns message if no records found

---

#### Filter Financial Records
```http
GET /records/filter
Authorization: Bearer <token>
```

**Required Roles:** Admin or Analyst

**Query Parameters:**
```
?type=income&search=salary&page=1&limit=5
```

**Response (200):**
```json
{
  "records": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "amount": 5000,
      "type": "income",
      "category": "salary",
      "note": "Monthly salary payment",
      "date": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

**Query Parameters Description:**
- `type` - Filter by "income" or "expense" 
- `search` - Search by category name
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 5)

**Note:**
- Admin sees all records; Analyst only sees their own
- Results are sorted by date (newest first)
- Returns message if no records found

---

#### Update Financial Record
```http
PUT /records/:recordID
Authorization: Bearer <token>
```

**Required Roles:** Admin or Analyst

**Request Body:**
```json
{
  "amount": 5500,
  "type": "income",
  "category": "bonus",
  "note": "Updated salary with bonus"
}
```

**Response (200):**
```json
{
  "message": "Records Updated Successfully"
}
```

**Note:**
- `recordID` is the MongoDB ObjectId of the record
- All fields are optional; only provide fields to update
- Analyst can only update their own records
- Admin can update any record

---

#### Delete Financial Record
```http
DELETE /records/:recordID
Authorization: Bearer <token>
```

**Required Roles:** Admin only

**Response (200):**
```json
{
  "message": "Records Deleted Successfully"
}
```

**Note:**
- Only Admin users can delete records
- `recordID` is the MongoDB ObjectId of the record
- Returns error if record not found

---

## 💡 Usage Examples

### Example 1: Register and Login
```bash
# Register
curl -X POST https://zorvyn-hbbq.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "user@example.com",
    "password": "Password123!"
  }'

# Login
curl -X POST https://zorvyn-hbbq.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

### Example 2: Create and Get Records
```bash
# Create a record
curl -X POST https://zorvyn-hbbq.onrender.com/records/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "note": "Monthly salary"
  }'

# Get all records
curl -X GET https://zorvyn-hbbq.onrender.com/records/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example 3: Filter Records by Type and Category
```bash
curl -X GET "https://zorvyn-hbbq.onrender.com/records/filter?type=expense&search=food&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📌 Assumptions

- Each financial record belongs to a single user
- Admin can view and manage all users and records
- Analyst can only manage their own records
- Viewer can only view their own analytics
- Search functionality is limited to category field

## ⚠️ Limitations

- No refresh token implementation
- No rate limiting applied
- Records are permanently deleted (no soft delete)
- Search is limited to category only


## 🚀 Future Enhancements

- Monthly/weekly analytics trends
- Advanced search (category + notes)
- Pagination metadata (total count, pages)
- Admin-specific analytics per user
- Soft delete functionality



## 📝 Error Handling

All error responses follow this format:

```json
Error Response:
{
  "message": "Error description"
}
```

**Common Error Codes:**
- `400` - Bad Request
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📞 Support & Contact

- **GitHub**: https://github.com/prateek959/ZORVYN
- **Live API**: https://zorvyn-hbbq.onrender.com

---

## 📄 License

ISC

---

**Built with ❤️ by Prateek**
