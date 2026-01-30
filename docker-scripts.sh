#!/bin/bash

# ================================
# BidSphere Docker Management Scripts
# Optimized for Git Bash on Windows
# ================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
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

print_header() {
    echo -e "${CYAN}================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}================================${NC}"
}

# Check if docker and docker-compose are installed
check_requirements() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Use docker compose or docker-compose based on availability
docker_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

# Show service URLs
show_urls() {
    echo ""
    print_header "Service URLs"
    echo -e "${CYAN}Frontend:${NC}          http://localhost:3000"
    echo -e "${CYAN}API Gateway:${NC}       http://localhost:8080"
    echo -e "${CYAN}Auth Service:${NC}      http://localhost:8081/api/auth/health"
    echo -e "${CYAN}Project Service:${NC}   http://localhost:8082/api/projects/health"
    echo -e "${CYAN}Bidding Service:${NC}   http://localhost:8083/api/bids/health"
    echo -e "${CYAN}Realtime Service:${NC}  http://localhost:8084/api/health"
    echo -e "${CYAN}Auction Service:${NC}   http://localhost:8085/api/auctions/health"
    echo ""
    print_header "Database Ports"
    echo -e "${CYAN}Auth DB:${NC}           localhost:5432"
    echo -e "${CYAN}Project DB:${NC}        localhost:5433"
    echo -e "${CYAN}Bidding DB:${NC}        localhost:5434"
    echo -e "${CYAN}Auction DB:${NC}        localhost:5435"
    echo -e "${CYAN}Redis:${NC}             localhost:6379"
    echo ""
}

# Start all services or specific service
start_services() {
    if [ -z "$1" ]; then
        print_header "Starting BidSphere Services"
        docker_compose_cmd up -d
        print_success "All services started successfully!"
        show_urls
    else
        print_header "Starting Service: $1"
        # Validate service name
        case "$1" in
            frontend|auth-service|project-service|bidding-service|auction-service|realtime-service|nginx|postgres-auth|postgres-project|postgres-bidding|postgres-auction|redis)
                docker_compose_cmd up -d "$1"
                print_success "Service '$1' started successfully!"
                ;;
            *)
                print_error "Invalid service name: $1"
                list_services
                exit 1
                ;;
        esac
    fi
}

# Stop all services or specific service
stop_services() {
    if [ -z "$1" ]; then
        print_header "Stopping BidSphere Services"
        docker_compose_cmd down
        print_success "All services stopped successfully!"
    else
        print_header "Stopping Service: $1"
        docker_compose_cmd stop "$1"
        print_success "Service '$1' stopped successfully!"
    fi
}

# Stop and remove volumes
stop_with_volumes() {
    print_header "Stopping Services & Removing Volumes"
    print_warning "This will delete all database data!"
    docker_compose_cmd down -v
    print_success "Services stopped and volumes removed!"
}

# Restart all services
restart_services() {
    print_header "Restarting BidSphere Services"
    docker_compose_cmd restart
    print_success "All services restarted successfully!"
    show_urls
}

# Restart specific service
restart_service() {
    if [ -z "$1" ]; then
        print_error "Please specify a service name"
        list_services
        exit 1
    fi
    
    print_info "Restarting service: $1"
    docker_compose_cmd restart "$1"
    print_success "Service '$1' restarted successfully!"
}

# Build and start services
build_and_start() {
    if [ -z "$1" ]; then
        print_header "Building & Starting All Services"
        docker_compose_cmd up -d --build
        print_success "All services built and started successfully!"
        show_urls
    else
        print_header "Building & Starting: $1"
        # Validate service name
        case "$1" in
            frontend|auth-service|project-service|bidding-service|auction-service|realtime-service|nginx|postgres-auth|postgres-project|postgres-bidding|postgres-auction|redis)
                docker_compose_cmd up -d --build "$1"
                print_success "Service '$1' built and started successfully!"
                ;;
            *)
                print_error "Invalid service name: $1"
                list_services
                exit 1
                ;;
        esac
    fi
}

# Build without starting
build_only() {
    if [ -z "$1" ]; then
        print_header "Building All Services"
        docker_compose_cmd build
        print_success "All services built successfully!"
    else
        print_info "Building service: $1"
        docker_compose_cmd build "$1"
        print_success "Service '$1' built successfully!"
    fi
}

# View logs
view_logs() {
    if [ -z "$1" ]; then
        print_info "Showing logs for all services (Ctrl+C to exit)..."
        docker_compose_cmd logs -f --tail=100
    else
        print_info "Showing logs for $1 (Ctrl+C to exit)..."
        docker_compose_cmd logs -f --tail=100 "$1"
    fi
}

# View recent logs (last 50 lines, no follow)
view_recent_logs() {
    if [ -z "$1" ]; then
        print_info "Recent logs for all services:"
        docker_compose_cmd logs --tail=50
    else
        print_info "Recent logs for $1:"
        docker_compose_cmd logs --tail=50 "$1"
    fi
}

# Refresh services (rebuild with latest code)
refresh_services() {
    print_header "Refreshing Services with Latest Code"
    print_warning "This will rebuild all services from scratch (no cache)"
    
    # Stop and remove containers
    print_info "Stopping and removing existing containers..."
    docker_compose_cmd down --remove-orphans
    
    # Remove existing images
    print_info "Removing existing images..."
    docker_compose_cmd down --rmi local 2>/dev/null || true
    
    # Prune build cache
    print_info "Cleaning Docker build cache..."
    docker builder prune -f
    
    # Build with no cache
    print_info "Building services with latest code (no cache)..."
    docker_compose_cmd build --no-cache
    
    # Start services
    print_info "Starting refreshed services..."
    docker_compose_cmd up -d
    
    print_success "Services refreshed successfully with latest code!"
    show_urls
}

# Quick refresh (rebuild without clearing cache)
quick_refresh() {
    print_header "Quick Refresh"
    print_info "Rebuilding and restarting services..."
    docker_compose_cmd up -d --build
    print_success "Services refreshed quickly!"
    show_urls
}

# Reset database (removes all data)
reset_database() {
    print_warning "WARNING: This will DELETE ALL DATABASE DATA!"
    echo -n "Are you sure? Type 'yes' to confirm: "
    read -r response
    if [[ "$response" == "yes" ]]; then
        print_info "Resetting all databases..."
        docker_compose_cmd down -v
        docker_compose_cmd up -d
        print_success "Databases reset successfully!"
        show_urls
    else
        print_info "Database reset cancelled."
    fi
}

# Reset specific database
reset_specific_db() {
    if [ -z "$1" ]; then
        print_error "Please specify database: auth, project, bidding, or auction"
        exit 1
    fi
    
    case "$1" in
        auth|project|bidding|auction)
            print_warning "This will delete all data in $1 database!"
            echo -n "Are you sure? Type 'yes' to confirm: "
            read -r response
            if [[ "$response" == "yes" ]]; then
                print_info "Resetting $1 database..."
                docker_compose_cmd stop "postgres-$1"
                docker volume rm "$(basename $(pwd))_postgres_${1}_data" 2>/dev/null || true
                docker_compose_cmd up -d "postgres-$1"
                print_success "$1 database reset successfully!"
            else
                print_info "Database reset cancelled."
            fi
            ;;
        *)
            print_error "Invalid database: $1"
            print_info "Available: auth, project, bidding, auction"
            exit 1
            ;;
    esac
}

# Check service health
check_health() {
    print_header "Checking Service Health"
    
    # Check databases
    echo -e "${MAGENTA}Databases:${NC}"
    for db in auth project bidding auction; do
        if docker_compose_cmd exec -T "postgres-$db" pg_isready -U postgres > /dev/null 2>&1; then
            echo -e "  ${GREEN}[OK]${NC} ${db^} Database: Healthy"
        else
            echo -e "  ${RED}[FAIL]${NC} ${db^} Database: Unhealthy"
        fi
    done
    
    # Check Redis
    if docker_compose_cmd exec -T redis redis-cli ping > /dev/null 2>&1; then
        echo -e "  ${GREEN}[OK]${NC} Redis: Healthy"
    else
        echo -e "  ${RED}[FAIL]${NC} Redis: Unhealthy"
    fi
    
    echo ""
    echo -e "${MAGENTA}Backend Services:${NC}"
    
    # Check services with timeout
    check_service_health() {
        local name=$1
        local url=$2
        if timeout 3 curl -sf "$url" > /dev/null 2>&1; then
            echo -e "  ${GREEN}[OK]${NC} $name: Healthy"
        else
            echo -e "  ${RED}[FAIL]${NC} $name: Unhealthy or starting..."
        fi
    }
    
    check_service_health "Auth Service" "http://localhost:8081/api/auth/health"
    check_service_health "Project Service" "http://localhost:8082/api/projects/health"
    check_service_health "Bidding Service" "http://localhost:8083/api/bids/health"
    check_service_health "Realtime Service" "http://localhost:8084/api/health"
    check_service_health "Auction Service" "http://localhost:8085/api/auctions/health"
    check_service_health "API Gateway" "http://localhost:8080/health"
    
    echo ""
    echo -e "${MAGENTA}Frontend:${NC}"
    check_service_health "Frontend" "http://localhost:3000"
    
    echo ""
}

# Show running containers
show_status() {
    print_header "Service Status"
    docker_compose_cmd ps
}

# List all services
list_services() {
    print_header "Available Services"
    echo -e "${CYAN}Backend Services:${NC}"
    echo "  - auth-service"
    echo "  - project-service"
    echo "  - bidding-service"
    echo "  - auction-service"
    echo "  - realtime-service"
    echo ""
    echo -e "${CYAN}Databases:${NC}"
    echo "  - postgres-auth"
    echo "  - postgres-project"
    echo "  - postgres-bidding"
    echo "  - postgres-auction"
    echo "  - redis"
    echo ""
    echo -e "${CYAN}Infrastructure:${NC}"
    echo "  - nginx (API Gateway)"
    echo "  - frontend"
    echo ""
}

# Clean up Docker resources
cleanup() {
    print_header "Cleaning Up Docker Resources"
    print_warning "This will remove stopped containers, unused networks, and dangling images"
    
    docker system prune -f
    print_success "Cleanup completed!"
}

# Deep clean (including volumes)
deep_clean() {
    print_warning "DEEP CLEAN: This will remove ALL unused Docker resources including volumes!"
    echo -n "Are you sure? Type 'yes' to confirm: "
    read -r response
    if [[ "$response" == "yes" ]]; then
        print_info "Performing deep clean..."
        docker_compose_cmd down -v --remove-orphans
        docker system prune -af --volumes
        print_success "Deep clean completed!"
    else
        print_info "Deep clean cancelled."
    fi
}

# Execute command in service container
exec_service() {
    if [ -z "$1" ]; then
        print_error "Please specify a service name"
        list_services
        exit 1
    fi
    
    local service=$1
    shift
    
    if [ $# -eq 0 ]; then
        # No command specified, open shell
        print_info "Opening shell in $service..."
        docker_compose_cmd exec "$service" /bin/sh || docker_compose_cmd exec "$service" /bin/bash
    else
        # Execute specified command
        print_info "Executing command in $service: $*"
        docker_compose_cmd exec "$service" "$@"
    fi
}

# Connect to database
db_connect() {
    if [ -z "$1" ]; then
        print_error "Please specify database: auth, project, bidding, or auction"
        exit 1
    fi
    
    case "$1" in
        auth|project|bidding|auction)
            print_info "Connecting to $1 database..."
            docker_compose_cmd exec "postgres-$1" psql -U postgres -d "${1}_db"
            ;;
        *)
            print_error "Invalid database: $1"
            print_info "Available: auth, project, bidding, auction"
            exit 1
            ;;
    esac
}

# Show help
show_help() {
    print_header "BidSphere Docker Management Script"
    echo ""
    echo -e "${CYAN}Usage:${NC} ./docker-scripts.sh [COMMAND] [OPTIONS]"
    echo ""
    echo -e "${CYAN}Service Management:${NC}"
    echo "  start              Start all services"
    echo "  start <service>    Start specific service"
    echo "  stop               Stop all services"
    echo "  stop <service>     Stop specific service"
    echo "  stop-all           Stop services and remove volumes (deletes data)"
    echo "  restart            Restart all services"
    echo "  restart <service>  Restart specific service"
    echo "  status             Show status of all services"
    echo ""
    echo -e "${CYAN}Building:${NC}"
    echo "  build              Build and start all services"
    echo "  build <service>    Build and start specific service"
    echo "  build-only         Build all services without starting"
    echo "  build-only <svc>   Build specific service without starting"
    echo "  refresh            Full rebuild with no cache (clears everything)"
    echo "  quick-refresh      Quick rebuild and restart (keeps cache)"
    echo ""
    echo -e "${CYAN}Logs & Monitoring:${NC}"
    echo "  logs               View live logs for all services"
    echo "  logs <service>     View live logs for specific service"
    echo "  recent             View recent logs (last 50 lines)"
    echo "  recent <service>   View recent logs for specific service"
    echo "  health             Check health of all services"
    echo ""
    echo -e "${CYAN}Database:${NC}"
    echo "  reset-db           Reset all databases (deletes all data)"
    echo "  reset-db <db>      Reset specific database (auth/project/bidding/auction)"
    echo "  db <database>      Connect to database shell"
    echo ""
    echo -e "${CYAN}Utilities:${NC}"
    echo "  list               List all available services"
    echo "  urls               Show all service URLs"
    echo "  exec <service>     Open shell in service container"
    echo "  exec <svc> <cmd>   Execute command in service container"
    echo "  cleanup            Clean up unused Docker resources"
    echo "  deep-clean         Remove all unused resources including volumes"
    echo "  help               Show this help message"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  ./docker-scripts.sh start"
    echo "  ./docker-scripts.sh start bidding-service"
    echo "  ./docker-scripts.sh stop auth-service"
    echo "  ./docker-scripts.sh build auth-service"
    echo "  ./docker-scripts.sh logs project-service"
    echo "  ./docker-scripts.sh restart bidding-service"
    echo "  ./docker-scripts.sh db auth"
    echo "  ./docker-scripts.sh exec auth-service"
    echo "  ./docker-scripts.sh health"
    echo "  ./docker-scripts.sh quick-refresh"
    echo ""
}

# Main script logic
main() {
    check_requirements
    
    case "${1:-help}" in
        start)
            start_services "$2"
            ;;
        stop)
            stop_services "$2"
            ;;
        stop-all)
            stop_with_volumes
            ;;
        restart)
            if [ -n "$2" ]; then
                restart_service "$2"
            else
                restart_services
            fi
            ;;
        build)
            build_and_start "$2"
            ;;
        build-only)
            build_only "$2"
            ;;
        refresh)
            refresh_services
            ;;
        quick-refresh|qr)
            quick_refresh
            ;;
        logs)
            view_logs "$2"
            ;;
        recent)
            view_recent_logs "$2"
            ;;
        health)
            check_health
            ;;
        status)
            show_status
            ;;
        list)
            list_services
            ;;
        urls)
            show_urls
            ;;
        reset-db)
            if [ -n "$2" ]; then
                reset_specific_db "$2"
            else
                reset_database
            fi
            ;;
        db)
            db_connect "$2"
            ;;
        exec)
            shift
            exec_service "$@"
            ;;
        cleanup)
            cleanup
            ;;
        deep-clean)
            deep_clean
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"