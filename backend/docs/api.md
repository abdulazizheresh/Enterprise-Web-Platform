# API Documentation

## Authentication

### Register User

- **POST** `/api/auth/register`
- **Body**: `{ username, email, name, password }`
- **Response**: `{ message, token, user }`

### Login User

- **POST** `/api/auth/login`
- **Body**: `{ username, password, mfaToken? }`
- **Response**: `{ message, token, user }` or `{ requiresMFA: true }`

### Setup MFA

- **POST** `/api/auth/mfa/setup`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ secret, qrCode }`

### Verify MFA

- **POST** `/api/auth/mfa/verify`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ token }`
- **Response**: `{ message }`

## User Management

### Get Profile

- **GET** `/api/user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user }`

### Update Profile

- **PUT** `/api/user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ name?, email? }`
- **Response**: `{ message, user }`

## Dashboard

### Get Stats

- **GET** `/api/dashboard/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ stats }`

## Notifications

### Get Notifications

- **GET** `/api/notifications`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ notifications }`

### Mark as Read

- **PUT** `/api/notifications/:id/read`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message, id }`

## Health Check

### System Health

- **GET** `/api/health`
- **Response**: `{ status, timestamp, uptime, environment }`
