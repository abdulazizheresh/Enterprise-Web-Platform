Backend API for Enterprise Web Platform with Node.js, Express, and MySQL.

## Features

- JWT Authentication with MFA support
- Rate limiting and security middleware
- Real-time notifications with Socket.IO
- MySQL database with Sequelize ORM
- Comprehensive logging with Winston
- OWASP security practices

## Installation

```bash
npm install
```

## Setup

1. Create MySQL database
2. Copy `.env.example` to `.env`
3. Update database credentials in `.env`
4. Start the server:

```bash
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `GET /api/dashboard/stats` - Dashboard statistics

## Environment Variables

See `.env` file for all required environment variables.

## Testing

```bash
npm test
```
