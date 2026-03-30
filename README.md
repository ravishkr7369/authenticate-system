# Authentication System

A robust, production-ready Node.js authentication system built with Express.js, MongoDB, and JWT. This system implements comprehensive user authentication with email verification, session management, and secure token-based authorization.

## Features

### 🔐 Core Authentication
- **User Registration**: Create new user accounts with secure password hashing (SHA-256)
- **Email Verification**: OTP-based email verification before account activation
- **User Login**: Secure login with JWT tokens and session management
- **Logout**: Single session logout and logout from all active sessions

### 🎫 Token Management
- **Access Tokens**: Short-lived JWT tokens (15 minutes) for API requests
- **Refresh Tokens**: Long-lived JWT tokens (7 days) for obtaining new access tokens
- **Token Refresh**: Endpoint to refresh expired access tokens without re-login
- **Secure Cookies**: HTTP-only, Secure cookies for refresh token storage

### 📧 Email Services
- **OTP Delivery**: Automated OTP generation and email delivery
- **Google OAuth2 Integration**: Secure email sending via Gmail with OAuth2 authentication
- **HTML Templates**: Formatted email templates for OTP verification

### 📊 Session Management
- **Multi-Device Sessions**: Track multiple active sessions per user
- **Device & IP Tracking**: Store user agent and IP address for each session
- **Session Revocation**: Ability to revoke individual or all sessions
- **Token Hash Storage**: Refresh tokens stored as hashes for security

### 👤 User Management
- **User Profile**: Retrieve current user information
- **Email/Username Uniqueness**: Prevent duplicate registrations
- **Email Verification Status**: Track verification state of user accounts

## Tech Stack

### Backend Framework
- **Express.js** (v5.2.1) - Web application framework
- **Node.js** - JavaScript runtime with ES modules

### Database
- **MongoDB** - NoSQL database
- **Mongoose** (v8.23.0) - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** (v9.0.3) - Token-based authentication
- **Crypto** - Built-in Node.js crypto for password and token hashing
- **Cookie-Parser** (v1.4.7) - Cookie handling middleware

### Email Services
- **Nodemailer** (v8.0.3) - Email sending with Google OAuth2

### Development Tools
- **Nodemon** (v3.1.14) - Auto-restart server on file changes
- **Morgan** (v1.10.1) - HTTP request logging
- **Dotenv** (v17.3.1) - Environment variable management

## Project Structure

```
src/
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── config/
│   ├── config.js          # Environment configuration and validation
│   └── connectDB.js       # MongoDB connection
├── controllers/
│   └── auth.controller.js # Authentication logic
├── models/
│   ├── user.model.js      # User schema and model
│   ├── session.model.js   # Session tracking schema
│   └── otp.model.js       # OTP storage schema
├── routes/
│   └── auth.route.js      # Authentication API routes
├── services/
│   └── email.service.js   # Email sending service
└── utils/
    └── utils.js           # Utility functions (OTP generation, HTML templates)
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}

Response: 201 Created
{
  "message": "OTP sent on your registered email",
  "email": "user@example.com"
}
```

#### Verify Email (OTP)
```
GET /api/auth/verify-user
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "otp": "string"
}

Response: 200 OK
{
  "message": "email verified successfully",
  "user": { user object }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "string"
}

Response: 200 OK
{
  "message": "user Logged in successfully",
  "user": {
    "id": "userId",
    "username": "string",
    "email": "user@example.com"
  },
  "accessToken": "jwt_token"
}
```

#### Get Current User
```
GET /api/auth/me
Headers:
  Authorization: Bearer <accessToken>

Response: 200 OK
{
  user: { user object }
}
```

#### Refresh Access Token
```
POST /api/auth/refresh-token
Cookies:
  refreshToken: stored_refresh_token

Response: 200 OK
{
  "accessToken": "new_jwt_token"
}
```

#### Logout (Current Session)
```
GET /api/auth/logout
Headers:
  Authorization: Bearer <accessToken>

Response: 200 OK
{
  "message": "logged out successfully"
}
```

#### Logout All Sessions
```
GET /api/auth/logout-all
Headers:
  Authorization: Bearer <accessToken>

Response: 200 OK
{
  "message": "logged out from all sessions successfully"
}
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google OAuth2 credentials for email sending

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/ravishkr7369/authenticate-system.git
cd authentication-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Create a `.env` file in the root directory:
```env
PORT=your_port
MONGODB_URI=mongodb://localhost:27017/authentication-system
JWT_SECRET=your_super_secret_jwt_key_here

# Google OAuth2 Configuration
GOOGLE_USER=your_email@gmail.com
GOOGLE_USER_NAME=Your Name
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```



## Security Features

✅ **Password Security**
- SHA-256 hashing for password storage
- Never stored in plain text

✅ **Token Security**
- JWT-based authentication
- Separate access tokens (short-lived) and refresh tokens (long-lived)
- Refresh tokens stored as hashes in database

✅ **HTTP-Only Cookies**
- Refresh tokens stored in secure, HTTP-only cookies
- Protected against XSS attacks
- Secure flag set for HTTPS only transmission

✅ **OTP Verification**
- Unique OTP for each registration
- OTP hashing before storage
- Automatic OTP cleanup after confirmation

✅ **Session Tracking**
- IP address and user agent logging
- Multiple concurrent session support
- Ability to revoke specific sessions


## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK` - Successful request
- `201 Created` - User successfully created
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid credentials or expired token
- `404 Not Found` - User not found or invalid OTP
- `409 Conflict` - User already exists with this email/username
- `500 Internal Server Error` - Server error

## Logging

- **Morgan** middleware logs all HTTP requests
- **Console logging** for error debugging
- **Email verification** logs for tracking delivery

## Development Scripts

```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```



**Built with ❤️ using Node.js, Express.js, and MongoDB**
