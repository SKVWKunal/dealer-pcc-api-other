#!/bin/bash

# One Aftersales Platform - Full Stack Startup Script

echo "🚀 Starting One Aftersales Platform..."
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if ! pg_isready -q; then
  echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting PostgreSQL...${NC}"
  sudo service postgresql start
  sleep 2
fi

# Check if Redis is running
echo "📦 Checking Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Redis is not running. Starting Redis...${NC}"
  sudo service redis-server start
  sleep 2
fi

# Check if database exists
echo "🗄️  Checking database..."
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw oneaftersales; then
  echo -e "${YELLOW}📝 Creating database...${NC}"
  psql -U postgres -c "CREATE DATABASE oneaftersales;"
  
  echo -e "${YELLOW}📝 Running schema...${NC}"
  psql -U postgres -d oneaftersales -f backend/database/schema.sql
  
  echo -e "${YELLOW}📝 Seeding data...${NC}"
  psql -U postgres -d oneaftersales -f backend/database/seed.sql
  
  echo -e "${GREEN}✅ Database initialized!${NC}"
else
  echo -e "${GREEN}✅ Database exists${NC}"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

# Create logs directory for backend
mkdir -p backend/logs

# Start backend
echo ""
echo "🔧 Starting Backend API..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is ready!${NC}"
    break
  fi
  sleep 1
done

# Start frontend
echo ""
echo "🎨 Starting Frontend..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
for i in {1..30}; do
  if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is ready!${NC}"
    break
  fi
  sleep 1
done

echo ""
echo "====================================="
echo -e "${GREEN}✅ One Aftersales Platform is running!${NC}"
echo "====================================="
echo ""
echo "📍 Frontend:  http://localhost:8080"
echo "📍 Backend:   http://localhost:3000"
echo "📍 API Docs:  http://localhost:3000/api/v1"
echo "📍 Health:    http://localhost:3000/health"
echo ""
echo "🔐 Test Credentials:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Super Admin:"
echo "  Email:    superadmin@oneaftersales.com"
echo "  Password: Admin@123"
echo ""
echo "Manufacturer Admin:"
echo "  Email:    admin@volkswagen.com"
echo "  Password: Admin@123"
echo ""
echo "Master Technician (Dealer):"
echo "  Email:    mt@dealer1.com"
echo "  Password: Dealer@123"
echo ""
echo "Service Manager (Dealer):"
echo "  Email:    sm@dealer1.com"
echo "  Password: Dealer@123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop: Press Ctrl+C"
echo ""

# Trap Ctrl+C to cleanup
trap cleanup INT

cleanup() {
  echo ""
  echo "🛑 Stopping services..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo "👋 Goodbye!"
  exit 0
}

# Keep script running
wait
