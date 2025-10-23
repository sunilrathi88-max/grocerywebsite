# Backend API Setup Guide

This guide explains how to create a backend API that works with the authentication system.

## 🎯 Overview

The frontend now makes **real API calls** to these endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/oauth/google` - Google OAuth callback
- `POST /api/auth/oauth/facebook` - Facebook OAuth callback
- `POST /api/auth/send-verification` - Send verification email
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/2fa/setup` - Setup 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `POST /api/auth/2fa/disable` - Disable 2FA

## 📋 API Endpoint Specifications

### 1. Login

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}

Success Response (200):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false,
    "isEmailVerified": true,
    "has2FA": false,
    "profilePicture": "https://...",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "message": "Login successful"
}

2FA Required Response (200):
{
  "success": false,
  "requires2FA": true,
  "message": "2FA verification required"
}

Error Response (401):
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 2. Sign Up

```
POST /api/auth/signup
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}

Success Response (201):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false,
    "isEmailVerified": false,
    "has2FA": false
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "message": "Account created successfully",
  "verificationEmailSent": true
}

Error Response (400):
{
  "success": false,
  "message": "Email already exists"
}
```

### 3. Logout

```
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

Request Body:
{
  "refreshToken": "refresh_token_here"
}

Success Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Refresh Token

```
POST /api/auth/refresh
Content-Type: application/json

Request Body:
{
  "refreshToken": "refresh_token_here"
}

Success Response (200):
{
  "success": true,
  "tokens": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}

Error Response (401):
{
  "success": false,
  "message": "Invalid refresh token"
}
```

### 5. Get Current User

```
GET /api/auth/me
Authorization: Bearer <access_token>

Success Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "isAdmin": false,
  "isEmailVerified": true,
  "has2FA": false,
  "profilePicture": "https://...",
  "createdAt": "2025-01-01T00:00:00Z"
}

Error Response (401):
{
  "message": "Unauthorized"
}
```

### 6. Google OAuth

```
POST /api/auth/oauth/google
Content-Type: application/json

Request Body:
{
  "code": "authorization_code_from_google"
}

Success Response (200):
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "name": "John Doe",
    "isAdmin": false,
    "isEmailVerified": true,
    "has2FA": false,
    "profilePicture": "https://..."
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "isNewUser": false
}
```

### 7. Facebook OAuth

```
POST /api/auth/oauth/facebook
Content-Type: application/json

Request Body:
{
  "code": "authorization_code_from_facebook"
}

Response: Same as Google OAuth
```

### 8. Send Verification Email

```
POST /api/auth/send-verification
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Success Response (200):
{
  "success": true,
  "message": "Verification email sent"
}
```

### 9. Verify Email

```
POST /api/auth/verify-email
Content-Type: application/json

Request Body:
{
  "token": "verification_token_from_email"
}

Success Response (200):
{
  "success": true,
  "message": "Email verified successfully"
}

Error Response (400):
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 10. Setup 2FA

```
POST /api/auth/2fa/setup
Authorization: Bearer <access_token>

Success Response (200):
{
  "success": true,
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,...",
  "backupCodes": [
    "ABCD1234",
    "EFGH5678",
    ...
  ]
}
```

### 11. Verify 2FA Code

```
POST /api/auth/2fa/verify
Content-Type: application/json

Request Body:
{
  "code": "123456",
  "userId": 1
}

Success Response (200):
{
  "success": true,
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "message": "2FA verification successful"
}

Error Response (400):
{
  "success": false,
  "message": "Invalid code"
}
```

### 12. Disable 2FA

```
POST /api/auth/2fa/disable
Authorization: Bearer <access_token>
Content-Type: application/json

Request Body:
{
  "password": "user_password"
}

Success Response (200):
{
  "success": true,
  "message": "2FA disabled successfully"
}
```

## 🔧 Environment Variables Setup

1. **Create `.env` file** (copy from `.env.example`):

```bash
cp .env.example .env
```

2. **Configure API URL**:

```bash
# Development
VITE_API_URL=http://localhost:5000

# Production
VITE_API_URL=https://api.yoursite.com
```

3. **Configure Google OAuth**:

```bash
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/#/oauth-callback
```

4. **Configure Facebook OAuth**:

```bash
VITE_FACEBOOK_APP_ID=your_actual_facebook_app_id
VITE_FACEBOOK_REDIRECT_URI=http://localhost:3000/#/oauth-callback
```

## 🏗️ Example Backend Implementation (Node.js + Express)

### Dependencies

```bash
npm install express jsonwebtoken bcrypt speakeasy qrcode nodemailer
```

### Basic Server Structure

```javascript
// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());

// JWT Secret (store in environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

// Generate JWT tokens
function generateTokens(userId, email) {
  const accessToken = jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: '1h' });

  const refreshToken = jwt.sign({ sub: userId, email, type: 'refresh' }, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
    tokenType: 'Bearer',
  };
}

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Find user in database (pseudo-code)
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Check if 2FA is enabled
  if (user.has2FA) {
    return res.json({
      success: false,
      requires2FA: true,
      message: '2FA verification required',
    });
  }

  // Generate tokens
  const tokens = generateTokens(user.id, user.email);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      has2FA: user.has2FA,
      profilePicture: user.profilePicture,
    },
    tokens,
    message: 'Login successful',
  });
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists',
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = await createUser({
    name,
    email,
    passwordHash,
    isEmailVerified: false,
    has2FA: false,
    isAdmin: false,
  });

  // Generate verification token
  const verificationToken = jwt.sign({ email, type: 'email-verification' }, JWT_SECRET, {
    expiresIn: '24h',
  });

  // Send verification email (pseudo-code)
  await sendVerificationEmail(email, verificationToken);

  // Generate tokens
  const tokens = generateTokens(user.id, user.email);

  res.status(201).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: false,
      isEmailVerified: false,
      has2FA: false,
    },
    tokens,
    message: 'Account created successfully',
    verificationEmailSent: true,
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = await findUserById(req.user.sub);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    isEmailVerified: user.isEmailVerified,
    has2FA: user.has2FA,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
  });
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'No refresh token provided',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const tokens = generateTokens(decoded.sub, decoded.email);

    res.json({
      success: true,
      tokens,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
});

// Setup 2FA
app.post('/api/auth/2fa/setup', authenticateToken, async (req, res) => {
  const userId = req.user.sub;

  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `TattvaCo (${req.user.email})`,
    issuer: 'TattvaCo',
  });

  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  // Generate backup codes
  const backupCodes = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    backupCodes.push(code);
  }

  // Store secret and backup codes (hashed) in database
  await update2FASettings(userId, {
    totpSecret: secret.base32,
    backupCodes: backupCodes.map((code) => bcrypt.hashSync(code, 10)),
  });

  res.json({
    success: true,
    secret: secret.base32,
    qrCodeUrl,
    backupCodes,
  });
});

// Verify 2FA
app.post('/api/auth/2fa/verify', async (req, res) => {
  const { code, userId } = req.body;

  const user = await findUserById(userId);
  if (!user || !user.totpSecret) {
    return res.status(400).json({
      success: false,
      message: '2FA not set up',
    });
  }

  // Verify TOTP code
  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: code,
    window: 2,
  });

  if (!verified) {
    // Check backup codes
    const validBackup = await checkBackupCode(userId, code);
    if (!validBackup) {
      return res.status(400).json({
        success: false,
        message: 'Invalid code',
      });
    }
  }

  // Enable 2FA if this is setup verification
  await enableUser2FA(userId);

  // Generate tokens
  const tokens = generateTokens(user.id, user.email);

  res.json({
    success: true,
    tokens,
    message: '2FA verification successful',
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

## 🔐 Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **JWT Secrets**: Use strong random strings, stored in environment variables
3. **Token Expiration**: Access tokens: 1 hour, Refresh tokens: 7 days
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Limit login attempts (e.g., 5 per minute)
6. **CORS**: Configure proper CORS headers
7. **Input Validation**: Validate all input data
8. **SQL Injection**: Use parameterized queries

## 🧪 Testing

Test the backend with curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger
- [Google OAuth Setup](https://console.cloud.google.com/)
- [Facebook OAuth Setup](https://developers.facebook.com/)
- [Speakeasy (2FA)](https://www.npmjs.com/package/speakeasy)
- [Nodemailer (Email)](https://nodemailer.com/)

## 🚀 Deployment Checklist

- [ ] Update VITE_API_URL to production URL
- [ ] Configure OAuth redirect URIs for production
- [ ] Set strong JWT secrets in production
- [ ] Enable HTTPS
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Configure CORS for production domain
- [ ] Set up database with proper indexes
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Test all endpoints in production

## 💡 Mock Mode (No Backend)

The system will automatically use mock data if:

- `VITE_API_URL` is not set, or
- OAuth credentials are not configured

Perfect for testing and demos!
