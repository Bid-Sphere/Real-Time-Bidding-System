using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RealTimeService.Services;

namespace RealTimeService.Hubs
{
    [Authorize]
    public class AuctionHub : Hub
    {
        private readonly ILogger<AuctionHub> _logger;
        private readonly IAuctionService _auctionService;

        public AuctionHub(ILogger<AuctionHub> logger, IAuctionService auctionService)
        {
            _logger = logger;
            _auctionService = auctionService;
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
            // Join the group using the auctionId directly
            await Groups.AddToGroupAsync(Context.ConnectionId, auctionId);
            _logger.LogInformation("Connection {ConnectionId} joined auction {AuctionId}",
                Context.ConnectionId, auctionId);

            // Fetch and send live state for late joiners
            if (long.TryParse(auctionId, out long auctionIdLong))
            {
                var liveState = await _auctionService.GetLiveStateAsync(auctionIdLong);
                if (liveState != null)
                {
                    await Clients.Caller.SendAsync("ReceiveLiveState", liveState);
                    _logger.LogInformation(
                        "Sent live state to connection {ConnectionId} for auction {AuctionId}", 
                        Context.ConnectionId, auctionId);
                }
                else
                {
                    _logger.LogWarning(
                        "Could not fetch live state for auction {AuctionId}", auctionId);
                }
            }
            else
            {
                _logger.LogWarning(
                    "Invalid auction ID format: {AuctionId}", auctionId);
            }
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
