#!/bin/bash

# 🚀 Krushnalaya Website Setup Script
# This script sets up the complete website with Razorpay integration

echo "🔮 Setting up Krushnalaya Website..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB is not running. Please start MongoDB first."
    print_info "Start MongoDB with: sudo systemctl start mongod"
fi

print_info "Setting up backend..."

# Backend setup
cd backend

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_info "Please update .env file with your Razorpay credentials"
    else
        print_error ".env.example not found. Please create .env manually."
    fi
else
    print_status ".env file exists"
fi

# Check Razorpay credentials
if grep -q "rzp_test_SC3qTps7PScZWH" .env; then
    print_status "Razorpay credentials found in .env"
else
    print_warning "Please add your Razorpay credentials to .env file"
fi

cd ..

print_info "Setting up frontend..."

# Frontend setup
cd frontend

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    print_info "Creating frontend .env file..."
    cat > .env << EOL
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_SC3qTps7PScZWH
REACT_APP_NAME=Krushnalaya
REACT_APP_DESCRIPTION=Spiritual Services - Tarot, Reiki & Water Divination
GENERATE_SOURCEMAP=false
EOL
    print_status "Frontend .env file created"
else
    print_status "Frontend .env file exists"
fi

cd ..

print_status "Setup completed!"

echo ""
echo "🎉 Krushnalaya Website is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your Razorpay credentials"
echo "2. Start MongoDB: sudo systemctl start mongod"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm start"
echo "5. Test integration: open razorpay-test.html in browser"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Test:     file://$(pwd)/razorpay-test.html"
echo ""
echo "💳 Test Cards:"
echo "   Success: 4111 1111 1111 1111"
echo "   Failure: 4000 0000 0000 0002"
echo "   CVV: Any 3 digits, Expiry: Any future date"
echo ""
print_status "Happy coding! 🚀"