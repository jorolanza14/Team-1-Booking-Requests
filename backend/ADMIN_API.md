# Admin API Documentation

## Base URL
```
/api/admin
```

## Authentication
All admin endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
- `diocese_admin` - Full access to all parishes and users
- `parish_admin` - Access to their assigned parish only
- `parish_staff` - Limited access to parish bookings and configurations

---

## Dashboard

### Get Dashboard Statistics
```
GET /api/admin/dashboard
```

**Query Parameters:**
- `parishId` (optional) - Filter by specific parish (diocese_admin only)

**Response:**
```json
{
  "summary": {
    "totalParishes": 5,
    "totalUsers": 150,
    "totalBookings": 320,
    "pendingBookings": 45,
    "confirmedBookings": 275
  },
  "recentBookings": [...],
  "bookingsByStatus": {
    "pending": 45,
    "confirmed": 275,
    "completed": 180,
    "cancelled": 20
  },
  "bookingsByType": {
    "baptism": 120,
    "wedding": 45,
    "confirmation": 80,
    "eucharist": 50,
    "reconciliation": 25
  }
}
```

---

## User Management

### Get All Users
```
GET /api/admin/users
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page
- `role` (optional) - Filter by role
- `parishId` (optional) - Filter by parish
- `search` (optional) - Search by name or email
- `isActive` (optional) - Filter by active status

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "09123456789",
      "role": "parishioner",
      "assignedParishId": 1,
      "isActive": true,
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Get User by ID
```
GET /api/admin/users/:id
```

### Create User
```
POST /api/admin/users
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "09123456789",
  "role": "parish_staff",
  "assignedParishId": 1
}
```

### Update User
```
PUT /api/admin/users/:id
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "parish_admin",
  "assignedParishId": 2,
  "isActive": true
}
```

### Delete User (Soft Delete)
```
DELETE /api/admin/users/:id
```

---

## Parish Management

### Get All Parishes
```
GET /api/admin/parishes
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `isActive` (optional)
- `search` (optional) - Search by parish name

### Get Parish by ID
```
GET /api/admin/parishes/:id
```

### Create Parish
```
POST /api/admin/parishes
```

**Request Body:**
```json
{
  "name": "St. Mary Parish",
  "address": "123 Main St, City",
  "contactEmail": "stmary@diocese.kalookan.org",
  "contactPhone": "(02) 8123-4567",
  "description": "A welcoming parish community",
  "servicesOffered": ["baptism", "wedding", "confirmation", "eucharist"]
}
```

### Update Parish
```
PUT /api/admin/parishes/:id
```

### Delete Parish (Soft Delete)
```
DELETE /api/admin/parishes/:id
```

---

## System Configuration Management

### Get Parish Configurations
```
GET /api/admin/parishes/:parishId/configurations
```

**Query Parameters:**
- `configType` (optional) - Filter by sacrament type

**Response:**
```json
[
  {
    "id": 1,
    "parishId": 1,
    "configType": "baptism",
    "dailyLimit": 10,
    "weeklyLimit": 50,
    "monthlyLimit": 200,
    "timeSlots": ["08:00", "09:00", "10:00", "14:00"],
    "blackoutDates": [],
    "massSchedules": [...],
    "bookingCutoffDays": 7,
    "maxAdvanceBookingDays": 180,
    "cutoffTime": "23:59",
    "autoApprove": false,
    "requiredDocuments": ["birth_certificate"],
    "maxGodparents": 3,
    "instructions": "Please bring...",
    "isActive": true
  }
]
```

### Create/Update Configuration
```
PUT /api/admin/parishes/:parishId/configurations/:configType
```

**Request Body:**
```json
{
  "dailyLimit": 15,
  "weeklyLimit": 60,
  "timeSlots": ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"],
  "blackoutDates": [
    "2024-12-25",
    "2024-01-01",
    {"start": "2024-04-01", "end": "2024-04-07"}
  ],
  "bookingCutoffDays": 14,
  "maxAdvanceBookingDays": 365,
  "autoApprove": false,
  "requiredDocuments": ["birth_certificate", "baptismal_certificate"],
  "maxGodparents": 4,
  "instructions": "Updated instructions..."
}
```

### Delete Configuration (Soft Delete)
```
DELETE /api/admin/configurations/:id
```

---

## Booking Management

### Get All Bookings
```
GET /api/admin/bookings
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional) - pending, confirmed, completed, cancelled
- `parishId` (optional)
- `bookingType` (optional) - baptism, wedding, confirmation, etc.
- `userId` (optional)
- `startDate` (optional) - Filter by date range
- `endDate` (optional)

**Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "userId": 5,
      "parishId": 1,
      "bookingType": "baptism",
      "requestedDate": "2024-03-15T09:00:00Z",
      "status": "pending",
      "notes": "...",
      "documents": [...],
      "additionalInfo": {...},
      "user": {...},
      "parish": {...}
    }
  ],
  "pagination": {
    "total": 320,
    "page": 1,
    "limit": 20,
    "totalPages": 16
  }
}
```

### Get Booking by ID
```
GET /api/admin/bookings/:id
```

### Update Booking Status
```
PUT /api/admin/bookings/:id/status
```

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Booking confirmed for March 15, 2024",
  "newRequestedDate": "2024-03-15T10:00:00Z"
}
```

### Delete Booking
```
DELETE /api/admin/bookings/:id
```

---

## Mass Intention Management

### Get All Mass Intentions
```
GET /api/admin/mass-intentions
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (optional)
- `parishId` (optional)
- `intentionType` (optional)
- `startDate` (optional)
- `endDate` (optional)

### Update Mass Intention Status
```
PUT /api/admin/mass-intentions/:id/status
```

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Mass intention confirmed for December 10, 2024"
}
```

---

## Configuration Types

The following configuration types are supported:

| Type | Description |
|------|-------------|
| `baptism` | Baptism sacrament settings |
| `wedding` | Wedding sacrament settings |
| `confirmation` | Confirmation sacrament settings |
| `eucharist` | First Communion settings |
| `reconciliation` | Confession settings |
| `anointing_sick` | Anointing of the Sick settings |
| `mass_intention` | Mass Intention settings |
| `funeral_mass` | Funeral Mass settings |

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```
