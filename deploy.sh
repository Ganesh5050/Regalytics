#!/bin/bash

# Regalytics UI Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="regalytics-ui"
DOCKER_REGISTRY="your-registry.com"
VERSION=${1:-"latest"}
ENVIRONMENT=${2:-"production"}

echo -e "${BLUE}🚀 Starting deployment of ${PROJECT_NAME} v${VERSION} to ${ENVIRONMENT}${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Build the application
build_application() {
    echo -e "${BLUE}🔨 Building application...${NC}"
    
    # Install dependencies
    npm ci
    
    # Run tests
    echo -e "${BLUE}🧪 Running tests...${NC}"
    npm run test -- --coverage --watchAll=false
    
    # Build for production
    echo -e "${BLUE}🏗️  Building for production...${NC}"
    npm run build
    
    print_status "Application built successfully"
}

# Build Docker image
build_docker_image() {
    echo -e "${BLUE}🐳 Building Docker image...${NC}"
    
    # Build the image
    docker build -t ${PROJECT_NAME}:${VERSION} .
    docker tag ${PROJECT_NAME}:${VERSION} ${PROJECT_NAME}:latest
    
    print_status "Docker image built successfully"
}

# Push to registry (if registry is configured)
push_to_registry() {
    if [ "$DOCKER_REGISTRY" != "your-registry.com" ]; then
        echo -e "${BLUE}📤 Pushing to registry...${NC}"
        
        docker tag ${PROJECT_NAME}:${VERSION} ${DOCKER_REGISTRY}/${PROJECT_NAME}:${VERSION}
        docker tag ${PROJECT_NAME}:${VERSION} ${DOCKER_REGISTRY}/${PROJECT_NAME}:latest
        
        docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}:${VERSION}
        docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}:latest
        
        print_status "Image pushed to registry"
    else
        print_warning "Skipping registry push (not configured)"
    fi
}

# Deploy with Docker Compose
deploy_with_compose() {
    echo -e "${BLUE}🚀 Deploying with Docker Compose...${NC}"
    
    # Stop existing containers
    docker-compose down
    
    # Pull latest images (if using registry)
    if [ "$DOCKER_REGISTRY" != "your-registry.com" ]; then
        docker-compose pull
    fi
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be healthy
    echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
    sleep 30
    
    # Check service health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_status "Frontend is healthy"
    else
        print_error "Frontend health check failed"
        exit 1
    fi
    
    print_status "Deployment completed successfully"
}

# Run post-deployment checks
post_deployment_checks() {
    echo -e "${BLUE}🔍 Running post-deployment checks...${NC}"
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_status "All services are running"
    else
        print_error "Some services are not running"
        docker-compose ps
        exit 1
    fi
    
    # Check application accessibility
    if curl -f http://localhost > /dev/null 2>&1; then
        print_status "Application is accessible"
    else
        print_error "Application is not accessible"
        exit 1
    fi
    
    # Check API health (if backend is running)
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        print_status "Backend API is healthy"
    else
        print_warning "Backend API health check failed (may not be implemented)"
    fi
    
    print_status "Post-deployment checks completed"
}

# Cleanup old images
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up old images...${NC}"
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old versions (keep last 3)
    docker images ${PROJECT_NAME} --format "table {{.Tag}}\t{{.ID}}" | tail -n +4 | awk '{print $2}' | xargs -r docker rmi
    
    print_status "Cleanup completed"
}

# Main deployment flow
main() {
    check_prerequisites
    build_application
    build_docker_image
    push_to_registry
    deploy_with_compose
    post_deployment_checks
    cleanup
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}📊 Application is available at: http://localhost${NC}"
    echo -e "${BLUE}📈 Monitoring: http://localhost:3000 (Grafana)${NC}"
    echo -e "${BLUE}🔍 Metrics: http://localhost:9090 (Prometheus)${NC}"
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"
