# Development Quick Start Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
cd CSE499

# Backend
cd server
npm install
cp .env.example .env

# Frontend (in new terminal)
cd client
npm install
cp .env.example .env.local
```

### 2. Environment Configuration

**Backend (server/.env)**
```env
NODE_ENV=development
PORT=5000
DB_URI=mongodb+srv://user:password@cluster.mongodb.net/fuel_dispensing
JWT_SECRET=your_dev_secret_key_here
JWT_REFRESH_SECRET=your_dev_refresh_secret_here
CORS_ORIGIN=http://localhost:3000
```

**Frontend (client/.env.local)**
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
```

### 3. Run with Docker Compose (Recommended)

```bash
# From project root
docker-compose up
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### 4. Run Locally (Alternative)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
# Health check: http://localhost:5000/health
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# App starts on http://localhost:3000
```

## Testing Login

### Admin Account
Admin user is created by running the seed script (see below).

Set credentials via environment variables:
```bash
export ADMIN_EMAIL=your-admin@example.com
export ADMIN_PASSWORD=YourSecurePassword123!
npm run seed:admin
```

### Test User Accounts
1. Create regular user: Use Sign Up page with role "Regular User"
2. Create employee: Use Sign Up page with role "Employee"
3. Admin can approve pending employees in admin dashboard

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Frontend
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## Key Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Health
- `GET /health` - API health check

## Useful Links

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Docs: Coming soon (Swagger)
- Database: MongoDB Atlas dashboard

## Troubleshooting

### MongoDB Connection Error
- Check `DB_URI` in `.env`
- Ensure MongoDB Atlas cluster is active
- Check IP whitelist in MongoDB Atlas

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
- Verify `CORS_ORIGIN` matches frontend URL
- Check browser console for specific origin

## Next Steps

1. Implement user management endpoints
2. Add machine registration API
3. Build transaction processing flow
4. Integrate WebSocket updates
5. Implement GenAI integration
6. Create comprehensive test suite

---

**Last Updated:** April 4, 2026
