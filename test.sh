#!/bin/bash

# Project Test Suite
# One Aftersales - Dealer Service Management Platform

set -e

echo "🧪 Testing One Aftersales Project..."
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Check Node and npm
echo "📦 Checking Node.js and npm..."
node --version
npm --version
echo -e "${GREEN}✓ Node.js and npm installed${NC}\n"

# Test 2: Check dependencies
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}\n"
else
    echo -e "${YELLOW}⚠ Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}\n"
fi

# Test 3: Run linting
echo "🔍 Running ESLint..."
npm run lint
echo -e "${GREEN}✓ Linting passed (warnings acceptable)${NC}\n"

# Test 4: Check TypeScript compilation
echo "📝 Checking TypeScript..."
npx tsc --noEmit
echo -e "${GREEN}✓ TypeScript compilation successful${NC}\n"

# Test 5: Build production
echo "🏗️  Building production..."
npm run build
echo -e "${GREEN}✓ Production build successful${NC}\n"

# Test 6: Check build output
echo "📊 Checking build output..."
if [ -d "dist" ]; then
    echo "Build artifacts:"
    ls -lh dist/
    echo -e "${GREEN}✓ Build artifacts created${NC}\n"
else
    echo -e "${RED}✗ Build directory not found${NC}\n"
    exit 1
fi

# Test 7: Check source files
echo "📁 Checking source structure..."
required_files=(
    "src/main.tsx"
    "src/App.tsx"
    "src/index.css"
    "src/pages/HomePage.tsx"
    "src/components/theme-provider.tsx"
    "src/lib/utils.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file missing"
        exit 1
    fi
done
echo ""

# Summary
echo "===================================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo "===================================="
echo ""
echo "Next steps:"
echo "  • Start dev server: npm run dev"
echo "  • Preview build: npm run preview"
echo "  • Deploy: See DEPLOYMENT.md"
echo ""
