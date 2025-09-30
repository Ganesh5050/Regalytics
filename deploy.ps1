# Regalytics UI Deployment Script for Windows
# This script handles the complete deployment process

param(
    [string]$Version = "latest",
    [string]$Environment = "production"
)

# Configuration
$PROJECT_NAME = "regalytics-ui"
$DOCKER_REGISTRY = "your-registry.com"

Write-Host "🚀 Starting deployment of $PROJECT_NAME v$Version to $Environment" -ForegroundColor Blue

# Function to print status
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check prerequisites
function Test-Prerequisites {
    Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue
    
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed"
        exit 1
    }
    
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose is not installed"
        exit 1
    }
    
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Error "npm is not installed"
        exit 1
    }
    
    Write-Status "Prerequisites check passed"
}

# Build the application
function Build-Application {
    Write-Host "🔨 Building application..." -ForegroundColor Blue
    
    # Install dependencies
    npm ci
    
    # Run tests
    Write-Host "🧪 Running tests..." -ForegroundColor Blue
    npm run test -- --coverage --watchAll=false
    
    # Build for production
    Write-Host "🏗️  Building for production..." -ForegroundColor Blue
    npm run build
    
    Write-Status "Application built successfully"
}

# Build Docker image
function Build-DockerImage {
    Write-Host "🐳 Building Docker image..." -ForegroundColor Blue
    
    # Build the image
    docker build -t "${PROJECT_NAME}:${Version}" .
    docker tag "${PROJECT_NAME}:${Version}" "${PROJECT_NAME}:latest"
    
    Write-Status "Docker image built successfully"
}

# Push to registry (if registry is configured)
function Push-ToRegistry {
    if ($DOCKER_REGISTRY -ne "your-registry.com") {
        Write-Host "📤 Pushing to registry..." -ForegroundColor Blue
        
        docker tag "${PROJECT_NAME}:${Version}" "${DOCKER_REGISTRY}/${PROJECT_NAME}:${Version}"
        docker tag "${PROJECT_NAME}:${Version}" "${DOCKER_REGISTRY}/${PROJECT_NAME}:latest"
        
        docker push "${DOCKER_REGISTRY}/${PROJECT_NAME}:${Version}"
        docker push "${DOCKER_REGISTRY}/${PROJECT_NAME}:latest"
        
        Write-Status "Image pushed to registry"
    } else {
        Write-Warning "Skipping registry push (not configured)"
    }
}

# Deploy with Docker Compose
function Deploy-WithCompose {
    Write-Host "🚀 Deploying with Docker Compose..." -ForegroundColor Blue
    
    # Stop existing containers
    docker-compose down
    
    # Pull latest images (if using registry)
    if ($DOCKER_REGISTRY -ne "your-registry.com") {
        docker-compose pull
    }
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be healthy
    Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Blue
    Start-Sleep -Seconds 30
    
    # Check service health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Status "Frontend is healthy"
        } else {
            Write-Error "Frontend health check failed"
            exit 1
        }
    } catch {
        Write-Error "Frontend health check failed: $($_.Exception.Message)"
        exit 1
    }
    
    Write-Status "Deployment completed successfully"
}

# Run post-deployment checks
function Test-PostDeployment {
    Write-Host "🔍 Running post-deployment checks..." -ForegroundColor Blue
    
    # Check if services are running
    $services = docker-compose ps
    if ($services -match "Up") {
        Write-Status "All services are running"
    } else {
        Write-Error "Some services are not running"
        docker-compose ps
        exit 1
    }
    
    # Check application accessibility
    try {
        $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Status "Application is accessible"
        } else {
            Write-Error "Application is not accessible"
            exit 1
        }
    } catch {
        Write-Error "Application is not accessible: $($_.Exception.Message)"
        exit 1
    }
    
    # Check API health (if backend is running)
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Status "Backend API is healthy"
        } else {
            Write-Warning "Backend API health check failed (may not be implemented)"
        }
    } catch {
        Write-Warning "Backend API health check failed (may not be implemented)"
    }
    
    Write-Status "Post-deployment checks completed"
}

# Cleanup old images
function Remove-OldImages {
    Write-Host "🧹 Cleaning up old images..." -ForegroundColor Blue
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old versions (keep last 3)
    $oldImages = docker images $PROJECT_NAME --format "table {{.Tag}}\t{{.ID}}" | Select-Object -Skip 3
    if ($oldImages) {
        $oldImages | ForEach-Object {
            $imageId = ($_ -split '\s+')[1]
            if ($imageId) {
                docker rmi $imageId -f
            }
        }
    }
    
    Write-Status "Cleanup completed"
}

# Main deployment flow
function Start-Deployment {
    Test-Prerequisites
    Build-Application
    Build-DockerImage
    Push-ToRegistry
    Deploy-WithCompose
    Test-PostDeployment
    Remove-OldImages
    
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "📊 Application is available at: http://localhost" -ForegroundColor Blue
    Write-Host "📈 Monitoring: http://localhost:3000 (Grafana)" -ForegroundColor Blue
    Write-Host "🔍 Metrics: http://localhost:9090 (Prometheus)" -ForegroundColor Blue
}

# Handle script interruption
$ErrorActionPreference = "Stop"

try {
    # Run main function
    Start-Deployment
} catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    exit 1
}
