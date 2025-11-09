#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Bookstore Docker Deployment Script  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker installed${NC}"
echo -e "${GREEN}✓ Docker Compose installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.docker...${NC}"
    cp .env.docker .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before deploying to production${NC}"
    echo ""
fi

# Ask user what to do
echo "Select an option:"
echo "1) Build and start all services"
echo "2) Start services (already built)"
echo "3) Stop all services"
echo "4) View logs"
echo "5) Rebuild from scratch (clean build)"
echo "6) Seed database with books"
echo "7) Cleanup unused Docker resources"
echo "8) Exit"
echo ""
read -p "Enter your choice (1-8): " choice

case $choice in
    1)
        echo -e "${BLUE}🔨 Building and starting all services...${NC}"
        docker compose build
        docker compose up -d
        echo ""
        echo -e "${GREEN}✓ Services started successfully!${NC}"
        echo ""
        echo "📊 Container Status:"
        docker compose ps
        echo ""
        echo -e "${BLUE}🌐 Access the application at:${NC}"
        echo "   Frontend: http://localhost"
        echo "   Backend API: http://localhost:5000/api"
        echo ""
        echo -e "${YELLOW}💡 View logs: docker compose logs -f${NC}"
        ;;
    2)
        echo -e "${BLUE}🚀 Starting services...${NC}"
        docker compose up -d
        echo ""
        echo -e "${GREEN}✓ Services started!${NC}"
        docker compose ps
        ;;
    3)
        echo -e "${BLUE}🛑 Stopping all services...${NC}"
        docker compose down
        echo -e "${GREEN}✓ Services stopped${NC}"
        ;;
    4)
        echo -e "${BLUE}📋 Showing logs (Ctrl+C to exit)...${NC}"
        docker compose logs -f
        ;;
    5)
        echo -e "${YELLOW}⚠️  This will rebuild all images from scratch. Continue? (y/n)${NC}"
        read -p "" confirm
        if [ "$confirm" = "y" ]; then
            echo -e "${BLUE}🔨 Rebuilding from scratch...${NC}"
            docker compose down
            docker compose build --no-cache
            docker compose up -d
            echo -e "${GREEN}✓ Rebuild complete!${NC}"
            docker compose ps
        else
            echo "Cancelled."
        fi
        ;;
    6)
        echo -e "${BLUE}📚 Seeding database with books...${NC}"
        docker compose exec backend npm run seed:books
        echo -e "${GREEN}✓ Database seeded!${NC}"
        ;;
    7)
        echo -e "${YELLOW}⚠️  This will remove unused images, containers, and networks. Continue? (y/n)${NC}"
        read -p "" confirm
        if [ "$confirm" = "y" ]; then
            echo -e "${BLUE}🧹 Cleaning up Docker resources...${NC}"
            docker system prune -a
            echo -e "${GREEN}✓ Cleanup complete!${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    8)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac
