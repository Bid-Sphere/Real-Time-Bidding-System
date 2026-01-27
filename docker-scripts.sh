#!/bin/bash

# ================================
# BidSphere Docker Management Scripts
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker and docker-compose are installed
check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Start all services
start_services() {
    print_info "Starting BidSphere services..."
    docker-compose up -d
    print_success "Services started successfully!"
    print_info "Frontend: http://localhost:3000"
    print_info "Auth API: http://localhost:8081/api/auth/health"
    print_info "Project API: http://localhost:8082/api/projects/health"
    print_info "Auth Database: localhost:5432"
    print_info "Project Database: localhost:5433"
}

# Stop all services
stop_services() {
    print_info "Stopping BidSphere services..."
    docker-compose down
    print_success "Services stopped successfully!"
}

# Restart all services
restart_services() {
    print_info "Restarting BidSphere services..."
    docker-compose down
    docker-compose up -d
    print_success "Services restarted successfully!"
}

# Build and start services
build_and_start() {
    if [ -z "$1" ]; then
        print_info "Building and starting all BidSphere services..."
        docker-compose up -d --build
        print_success "All services built and started successfully!"
    else
        print_info "Building and starting service: $1"
        # Validate service name
        case "$1" in
            frontend|auth-service|project-service|postgres-auth|postgres-project)
                docker-compose up -d --build "$1"
                print_success "Service '$1' built and started successfully!"
                ;;
            *)
                print_error "Invalid service name: $1"
                print_info "Available services: frontend, auth-service, project-service, postgres-auth, postgres-project"
                exit 1
                ;;
        esac
    fi
}

# View logs
view_logs() {
    if [ -z "$1" ]; then
        print_info "Showing logs for all services..."
        docker-compose logs -f
    else
        print_info "Showing logs for $1..."
        docker-compose logs -f "$1"
    fi
}

# Refresh services (rebuild with latest code)
refresh_services() {
    print_info "Refreshing BidSphere services with latest code..."
    print_warning "This will stop all services, remove containers, and rebuild from scratch."
    
    # Stop and remove containers, networks, and images
    print_info "Stopping and removing existing containers..."
    docker-compose down --remove-orphans
    
    # Remove existing images to force rebuild
    print_info "Removing existing images to force rebuild..."
    docker-compose down --rmi local 2>/dev/null || true
    
    # Prune build cache for fresh build
    print_info "Cleaning Docker build cache..."
    docker builder prune -f
    
    # Build and start with no cache
    print_info "Building services with latest code (no cache)..."
    docker-compose build --no-cache
    
    print_info "Starting refreshed services..."
    docker-compose up -d
    
    print_success "Services refreshed successfully with latest code!"
    print_info "Frontend: http://localhost:3000"
    print_info "Auth API: http://localhost:8081/api/auth/health"
    print_info "Project API: http://localhost:8082/api/projects/health"
    print_info "Auth Database: localhost:5432"
    print_info "Project Database: localhost:5433"
}

# Reset database (removes all data)
reset_database() {
    print_warning "This will delete all database data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "Resetting database..."
        docker-compose down -v
        docker-compose up -d
        print_success "Database reset successfully!"
    else
        print_info "Database reset cancelled."
    fi
}

# Check service health
check_health() {
    print_info "Checking service health..."
    
    # Check auth database
    if docker-compose exec -T postgres-auth pg_isready -U postgres -d auth_db > /dev/null 2>&1; then
        print_success "Auth Database: Healthy"
    else
        print_error "Auth Database: Unhealthy"
    fi
    
    # Check project database
    if docker-compose exec -T postgres-project pg_isready -U postgres -d project_db > /dev/null 2>&1; then
        print_success "Project Database: Healthy"
    else
        print_error "Project Database: Unhealthy"
    fi
    
    # Check auth service
    if curl -f http://localhost:8081/api/auth/health > /dev/null 2>&1; then
        print_success "Auth Service: Healthy"
    else
        print_error "Auth Service: Unhealthy"
    fi
    
    # Check project service
    if curl -f http://localhost:8082/api/projects/health > /dev/null 2>&1; then
        print_success "Project Service: Healthy"
    else
        print_error "Project Service: Unhealthy"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend: Healthy"
    else
        print_error "Frontend: Unhealthy"
    fi
}

# Show help
show_help() {
    echo "BidSphere Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  build       Build and start all services"
    echo "  build <svc> Build and start specific service (frontend, auth-service, project-service, postgres-auth, postgres-project)"
    echo "  refresh     Rebuild with latest code and restart (clears cache)"
    echo "  logs        View logs for all services"
    echo "  logs <svc>  View logs for specific service (postgres-auth, postgres-project, auth-service, project-service, frontend)"
    echo "  health      Check health of all services"
    echo "  reset-db    Reset database (WARNING: deletes all data)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 build frontend"
    echo "  $0 build project-service"
    echo "  $0 refresh"
    echo "  $0 logs auth-service"
    echo "  $0 logs project-service"
    echo "  $0 health"
}

# Main script logic
main() {
    check_requirements
    
    case "${1:-help}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        build)
            build_and_start "$2"
            ;;
        refresh)
            refresh_services
            ;;
        logs)
            view_logs "$2"
            ;;
        health)
            check_health
            ;;
        reset-db)
            reset_database
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"