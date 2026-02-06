# Diocese Backend API

Backend API for the Diocese Sacramental Management System (Flutter + Node.js/Express + PostgreSQL)

## Overview

This is a RESTful API built with Node.js, Express, and PostgreSQL that serves as the backend for the Flutter mobile application. It handles user authentication, sacrament bookings, mass intentions, and user management for the Diocese of Kalookan.

## Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Social Authentication**: Google OAuth support
- **Role-Based Access Control**: Different roles (parishioner, staff, priest, admin)
- **Sacrament Bookings**: Manage baptism, wedding, and confirmation bookings
- **Mass Intentions**: Submit and manage mass intentions
- **File Uploads**: Support for document uploads (IDs, certificates, etc.)
- **Email Notifications**: Email service for booking confirmations
- **Rate Limiting**: Protection against brute force attacks
- **CORS Support**: Configured for Flutter mobile apps
- **Database**: PostgreSQL with Sequelize ORM
- **RCDOK Structure**: Support for multiple parishes within the Roman Catholic Diocese of Kalookan

## Tech Stack

- **Node.js**: Runtime environment (v18+)
- **Express**: Web framework
- **PostgreSQL**: Database (v15+)
- **Sequelize**: ORM
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Nodemailer**: Email service
- **PDFKit**: PDF generation
- **Multer**: File upload handling
- **Passport**: Authentication middleware (Google OAuth)

## Database Setup

### Using Docker (Recommended)

A Docker Compose file is provided in the `postgres/` directory for easy PostgreSQL setup:

1. Navigate to the postgres directory:
   ```bash
   cd postgres
   ```

2. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

3. The database will be available at `localhost:5433` with the following credentials:
   - Database: `diocese_db_dev`
   - Username: `postgres`
   - Password: `postgres`
   - Port: `5433` (to avoid conflicts with existing PostgreSQL installations)

### Manual Setup

Alternatively, you can install PostgreSQL directly on your system and create the database manually.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── constants.js         # App constants
│   ├── controllers/
│   │   ├── authController.js    # Login, register, OAuth
│   │   ├── bookingController.js # Booking CRUD
│   │   ├── intentionController.js # Mass intentions
│   │   ├── parishController.js  # Parish management
│   │   └── userController.js    # User management
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── upload.js            # Multer configuration
│   ├── models/
│   │   ├── index.js             # Model associations
│   │   ├── User.js              # User model
│   │   ├── Booking.js           # Booking model
│   │   ├── MassIntention.js     # Mass intention model
│   │   └── Parish.js            # Parish model
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── bookings.js          # Booking endpoints
│   │   ├── files.js             # File upload endpoints
│   │   ├── intentions.js        # Mass intention endpoints
│   │   ├── parishes.js          # Parish endpoints
│   │   └── users.js             # User endpoints
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── fileService.js       # File upload/download management
│   │   ├── googleAuthService.js # Google OAuth service
│   │   ├── emailService.js      # Email sending
│   │   ├── notificationService.js # Notifications
│   │   └── pdfService.js        # PDF generation
│   ├── utils/
│   │   ├── logger.js            # Logging utility
│   │   ├── validators.js        # Custom validators
│   │   └── helpers.js           # Helper functions
│   └── scripts/
│       ├── migrate.js           # Database migrations
│       └── seed.js              # Seed data
├── uploads/
│   ├── documents/               # User uploaded docs
│   └── temp/                    # Temporary files
├── logs/                        # Application logs
├── tests/                       # Unit and integration tests
├── .env.development             # Development environment
├── .env.example                 # Example env file
├── .env.production              # Production environment
├── .env.uat                     # UAT environment
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── server.js                    # Entry point
└── README.md                    # Documentation
```

## Installation

### Prerequisites

- Node.js v18+ LTS
- PostgreSQL 15+ (or Docker for containerized setup)
- Git

### Setup

1. **Navigate to backend directory:**
   ```bash
   cd diocese-project/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.development
   ```
   
   Edit `.env.development` with your database credentials, JWT secrets, and Google OAuth credentials.

4. **Set up database:**
   - Option A (Using Docker): Follow the Database Setup instructions above
   - Option B (Manual): Create the database manually and update environment variables

5. **Run database migrations:**
   ```bash
   npm run migrate
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/me` - Update user profile (protected)
- `PATCH /api/auth/change-password` - Change password (protected)

### Parishes (Public & Protected)
- `GET /api/parishes` - Get all active parishes
- `GET /api/parishes/:id` - Get specific parish by ID
- `GET /api/parishes/search` - Search parishes by name/location/services
- `GET /api/parishes/by-service/:service` - Get parishes by service offered

### File Uploads (Protected)
- `POST /api/files/upload` - Upload a file
- `GET /api/files` - Get user's files
- `GET /api/files/:filename` - Get specific file info
- `DELETE /api/files/:filename` - Delete a file

### Bookings (Protected)
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Mass Intentions (Protected)
- `GET /api/intentions` - Get user's intentions
- `POST /api/intentions` - Create mass intention
- `GET /api/intentions/:id` - Get specific intention
- `PUT /api/intentions/:id` - Update intention
- `DELETE /api/intentions/:id` - Cancel intention

### Users (Protected)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

## Database Models

### User
- id, email, password, firstName, lastName, phone
- role (parishioner, staff, priest, admin)
- googleId, isActive, lastLoginAt

### Parish
- id, name, address, contactEmail, contactPhone
- schedule (JSONB - mass schedules and availability)
- servicesOffered (ARRAY - sacraments offered: baptism, wedding, confirmation, etc.)
- isActive

### Booking
- id, userId, parishId, bookingType (baptism, wedding, confirmation)
- requestedDate, status (pending, confirmed, completed, cancelled)
- notes, documents (JSONB), additionalInfo (JSONB)

### MassIntention
- id, submittedBy, parishId, massDate
- intentionType (deceased, thanksgiving, petition)
- intentionFor, specialNotes, offeringAmount
- status (pending, confirmed, completed)

## Environment Variables

See `.env.example` for complete list. Key variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DB_*` - Database connection settings
- `JWT_*` - JWT secret and expiration
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `EMAIL_*` - Email service configuration
- `ALLOWED_ORIGINS` - CORS origins for Flutter apps

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Access and refresh tokens
- **Google OAuth**: Social authentication support
- **Rate Limiting**: Auth endpoints (5 attempts/15min), API (100 requests/15min)
- **CORS**: Configured for Flutter mobile apps
- **Helmet**: Security headers
- **Input Validation**: express-validator
- **SQL Injection Protection**: Sequelize ORM

## Development

### Running in Development
```bash
npm run dev
```

### Testing
```bash
npm test
```

### Code Quality
```bash
npx eslint .
npx prettier --write .
```

## API Testing Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "09123456789"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Google OAuth
```bash
curl -X POST http://localhost:3000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "GOOGLE_ID_TOKEN"
  }'
```

### Access Protected Route
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### File Upload
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/your/file.pdf" \
  -F "category=identification"
```

### Get Parishes
```bash
curl -X GET http://localhost:3000/api/parishes
```

## Flutter Integration

### Android Emulator
Use: `http://10.0.2.2:3000`

### iOS Simulator
Use: `http://127.0.0.1:3000`

### Physical Device
Use: `http://YOUR_COMPUTER_IP:3000`

## Google OAuth Setup

To enable Google OAuth:

1. Go to Google Cloud Console (console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google People API for your project
4. Go to "Credentials" in the left menu
5. Click "Create Credentials" and select "OAuth 2.0 Client IDs"
6. Configure the OAuth consent screen if prompted
7. For application type, select "Web application"
8. Add your authorized redirect URIs (typically your backend domain)
9. After creation, add the Client ID and Client Secret to your environment variables

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### CORS Issues
Ensure `ALLOWED_ORIGINS` in your environment file includes your Flutter app origin.

## License

MIT

## Support

For issues and questions, please contact the development team.