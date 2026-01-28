using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace RealTimeService.Hubs
{
    [Authorize]
    public class AuctionHub : Hub
    {
        private readonly ILogger<AuctionHub> _logger;

        public AuctionHub(ILogger<AuctionHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
                _logger.LogInformation("User {UserId} connected to AuctionHub", userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                _logger.LogInformation("User {UserId} disconnected from AuctionHub", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinAuction(string auctionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, auctionId);
            _logger.LogInformation("Connection {ConnectionId} joined auction {AuctionId}", 
                Context.ConnectionId, auctionId);
        }

        public async Task LeaveAuction(string auctionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, auctionId);
            _logger.LogInformation("Connection {ConnectionId} left auction {AuctionId}", 
                Context.ConnectionId, auctionId);
        }

        protected string? GetUserId()
        {
            return Context.User?.FindFirst("userId")?.Value;
        }

        protected string? GetUserRole()
        {
            return Context.User?.FindFirst("role")?.Value;
        }

        protected bool IsAuthenticated()
        {
            return Context.User?.Identity?.IsAuthenticated ?? false;
        }
    }
}
