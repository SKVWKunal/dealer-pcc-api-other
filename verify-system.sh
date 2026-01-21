#!/bin/bash
echo "🔍 One Aftersales Platform - System Verification"
echo "================================================"
echo ""
echo "📦 Checking Docker Containers..."
docker ps | grep oneaftersales && echo "✅ Containers running" || echo "❌ Containers not running"
echo ""
echo "🚀 Backend API Health:"
curl -s http://localhost:3000/health | jq '.' || echo "❌ Backend not responding"
echo ""
echo "🔐 Testing Authentication..."
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mt@dealer1.com","password":"Dealer@123","userType":"dealer"}' | jq '.success'
echo ""
echo "✅ System Check Complete!"
