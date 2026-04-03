# AI-Enhanced Smart Fuel Dispensing & Monitoring System

## Overview
A comprehensive MERN stack application integrating Raspberry Pi 5 hardware for fuel dispensing, real-time monitoring, and Google Gemini AI for intelligent summaries.

### Key Features
- **3-Tier Role System**: Admin (system management), Employee (station monitoring), User (personal consumption)
- **RFID Authentication**: Physical card-based fuel access with balance validation
- **Real-Time Monitoring**: WebSocket updates for live dashboard data
- **Hardware Integration**: Raspberry Pi 5 dispensers with REST API communication
- **AI-Powered Insights**: Google Gemini API for on-demand summaries & statistics
- **Modern UI**: Dark/Light theme, responsive design with Tailwind CSS

## Project Structure

```
CSE499/
├── server/                 # Express.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB schemas
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   ├── sockets/       # WebSocket handlers
│   │   └── app.js         # Express app setup
│   ├── .env.example       # Environment template
│   └── package.json
│
├── client/                 # React.js frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # Global styles
│   │   └── App.jsx        # Main app component
│   ├── .env.example       # Environment template
│   ├── tailwind.config.js
│   └── package.json
│
└── DEVELOPMENT_PLAN.md    # Comprehensive development plan

```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key
- Raspberry Pi 5 (for hardware testing)

## Getting Started

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URL
npm start
```

### 3. MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Add to server/.env as DB_URI

### 4. Google Gemini Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to server/.env as GEMINI_API_KEY

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Machine Endpoints
- `POST /api/machines/register` - Register Raspberry Pi
- `POST /api/machines/:id/heartbeat` - Machine heartbeat
- `GET /api/machines/:id/config` - Get machine config

### RFID & Transaction
- `POST /api/rfid/verify/:cardId` - Verify RFID card
- `POST /api/transactions/initiate` - Start transaction
- `PUT /api/transactions/:id/complete` - Complete transaction

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/employee` - Employee dashboard data
- `GET /api/dashboard/user` - User dashboard data

### GenAI
- `POST /api/genai/query` - Send custom query
- `POST /api/genai/preset` - Use preset query
- `GET /api/genai/history` - Query history

## Development Phases

### Phase 1: Foundation & MVP ✅ IN PROGRESS
- Express & MongoDB setup
- User authentication (JWT)
- Basic database models
- React project structure
- Auth pages (Sign Up, Login)

### Phase 2: Hardware Integration
- Machine registration API
- RFID card management
- Transaction workflow

### Phase 3: Transaction Processing
- Balance validation & deduction
- Pump control logic
- Error handling

### Phase 4: Real-Time Updates
- WebSocket integration
- Live dashboard updates

### Phase 5: GenAI Integration
- Google Gemini API setup
- Chat interface
- Preset queries

### Phase 6-7: Polish, Testing & Deployment
- Security audit
- Unit/integration tests
- Docker setup
- CI/CD pipeline

## Configuration

### Backend (.env)

```env
NODE_ENV=development
PORT=5000

# Database
DB_URI=mongodb+srv://user:password@cluster.mongodb.net/fuel_dispensing
MONGO_DB_NAME=fuel_dispensing

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRY=15m

# CORS
CORS_ORIGIN=http://localhost:3000

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Socket.io
SOCKET_IO_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
REACT_APP_ORGANIZATION_NAME=Your Organization
```

## Running Tests

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## Security

### ⚠️ IMPORTANT SECURITY NOTES

**NEVER commit credentials to version control:**
- Keep `.env` files in `.gitignore` (already configured)
- Use environment variables for all sensitive data
- Never hardcode API keys, passwords, or connection strings
- Always use `.env.example` as a template with placeholder values

**Environment Variables Required:**
```bash
ADMIN_EMAIL=your-secure-admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
JWT_REFRESH_SECRET=your-secure-refresh-secret-minimum-32-chars
DB_URI=your-mongodb-connection-string
GEMINI_API_KEY=your-google-gemini-api-key
```

**Security Checklist:**
- ✅ All credentials use environment variables
- ✅ HTTPOnly cookies for refresh tokens
- ✅ JWT with short expiry (15 minutes)
- ✅ Rate limiting on auth endpoints
- ✅ bcryptjs password hashing
- ✅ CORS whitelisting
- ✅ Helmet.js security headers

## Deployment

### Docker

```bash
docker-compose up -d
```

### Railway/Heroku

```bash
# Backend
railway up

# Frontend (Vercel)
vercel deploy
```

## Technology Stack

### Backend
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Socket.io (Real-time)
- Google Generative AI
- Joi (Validation)

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Recharts (Charting)
- Socket.io-client
- Axios

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- MongoDB Atlas
- Vercel/Railway

## Security

- JWT with refresh tokens
- bcrypt password hashing
- CORS whitelisting
- Rate limiting on auth endpoints
- HTTPS in production
- Input validation (Joi)
- Environment variable protection

## Contributing

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit changes (`git commit -am 'Add feature'`)
3. Push to branch (`git push origin feature/your-feature`)
4. Create Pull Request

## License

Private - Organization Use Only

## Contact

For questions or support, contact the development team.

---

**Last Updated**: April 4, 2026  
**Status**: Phase 1 - Foundation Setup
