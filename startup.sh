#!/bin/bash

# One Aftersales Platform - Auto Startup Script
# This script ensures all components start correctly every time

set -e  # Exit on error

echo "🚀 One Aftersales Platform - Starting All Services"
echo "===================================================="
echo ""

# Function to check if port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Function to wait for service
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=0
    
    echo "⏳ Waiting for $name to be ready..."
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo "✅ $name is ready!"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    echo "❌ $name failed to start"
    return 1
}

# 1. Start Docker containers
echo "📦 Starting Docker containers (PostgreSQL + Redis)..."
if docker ps | grep -q "oneaftersales-postgres"; then
    echo "✅ PostgreSQL already running"
else
    docker-compose up -d postgres redis
    sleep 5
    echo "✅ Docker containers started"
fi

# 2. Initialize database if needed
echo ""
echo "📊 Checking database..."
TABLE_COUNT=$(docker exec oneaftersales-postgres psql -U oneaftersales -d oneaftersales -t -c "\dt" 2>/dev/null | grep -c "public |" || echo "0")

if [ "$TABLE_COUNT" -lt "10" ]; then
    echo "⏳ Initializing database schema..."
    docker exec -i oneaftersales-postgres psql -U oneaftersales -d oneaftersales < backend/database/schema.sql > /dev/null 2>&1
    echo "⏳ Loading seed data..."
    docker exec -i oneaftersales-postgres psql -U oneaftersales -d oneaftersales < backend/database/seed.sql > /dev/null 2>&1
    
    # Fix passwords
    docker exec oneaftersales-postgres psql -U oneaftersales -d oneaftersales -c "
    UPDATE users SET password_hash = '\$2a\$12\$o.W.XdXDiDD6XS5pK25v1eGO0MMUsGGzeiBNzjY4Vk/JbG6utaLzC' 
    WHERE email IN ('superadmin@oneaftersales.com', 'admin@volkswagen.com');
    UPDATE users SET password_hash = '\$2a\$12\$M0b/Ly65rvb.a4v5cHheduZTdCLlkhRYnTAHHyXFbm9oZC5nVca56' 
    WHERE email IN ('mt@dealer1.com', 'sm@dealer1.com');
    " > /dev/null 2>&1
    
    echo "✅ Database initialized"
else
    echo "✅ Database already initialized ($TABLE_COUNT tables)"
fi

# 3. Start Backend API
echo ""
echo "🔧 Starting Backend API..."
if check_port 3000; then
    echo "⚠️  Port 3000 already in use, killing old process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

cd backend
nohup npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
cd ..

wait_for_service "http://localhost:3000/health" "Backend API"

# 4. Start Frontend
echo ""
echo "🎨 Starting Frontend..."
if check_port 8080; then
    echo "✅ Frontend already running on port 8080"
else
    echo "⏳ Starting frontend development server..."
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
    
    wait_for_service "http://localhost:8080" "Frontend"
fi

# 5. Verify everything
echo ""
echo "🔍 Running system verification..."
sleep 2

# Test authentication
AUTH_TEST=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mt@dealer1.com","password":"Dealer@123","userType":"dealer"}' | grep -o '"success":true' || echo "")

if [ -n "$AUTH_TEST" ]; then
    echo "✅ Authentication working"
else
    echo "❌ Authentication test failed"
    echo "   Check logs: tail -f backend.log"
    exit 1
fi

echo ""
echo "🎉 ALL SYSTEMS OPERATIONAL!"
echo "===================================================="
echo ""
echo "📱 Access Your Application:"
echo "   Frontend:  http://localhost:8080"
echo "   Backend:   http://localhost:3000"
echo "   Health:    http://localhost:3000/health"
echo ""
echo "👤 Login Credentials:"
echo ""
echo "   Dealer Users (userType: 'dealer'):"
echo "   • mt@dealer1.com / Dealer@123 (Master Technician)"
echo "   • sm@dealer1.com / Dealer@123 (Service Manager)"
echo ""
echo "   Manufacturer Users (userType: 'manufacturer'):"
echo "   • admin@volkswagen.com / Admin@123 (Manufacturer Admin)"
echo "   • superadmin@oneaftersales.com / Admin@123 (Super Admin)"
echo ""
echo "📝 Useful Commands:"
echo "   Check health:     ./verify-system.sh"
echo "   View backend logs: tail -f backend.log"
echo "   View frontend logs: tail -f frontend.log"
echo "   Stop backend:     lsof -ti:3000 | xargs kill"
echo "   Stop frontend:    lsof -ti:8080 | xargs kill"
echo ""
echo "🚀 Open http://localhost:8080 in your browser to get started!"
echo ""
