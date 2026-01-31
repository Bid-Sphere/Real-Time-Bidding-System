using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RealTimeService.Services;
using System.Collections.Concurrent;

namespace RealTimeService.Hubs
{
    [Authorize]
    public class AuctionHub : Hub
    {
        private readonly ILogger<AuctionHub> _logger;
        private readonly IAuctionService _auctionService;
        
        // Track viewers per auction: auctionId -> HashSet of connectionIds
        private static readonly ConcurrentDictionary<string, HashSet<string>> _auctionViewers = new();

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
            
            // Track viewer
            _auctionViewers.AddOrUpdate(
                auctionId,
                new HashSet<string> { Context.ConnectionId },
                (key, viewers) =>
                {
                    lock (viewers)
                    {
                        viewers.Add(Context.ConnectionId);
                    }
                    return viewers;
                });
            
            var viewerCount = GetViewerCount(auctionId);
            _logger.LogInformation("Connection {ConnectionId} joined auction {AuctionId}. Total viewers: {ViewerCount}",
                Context.ConnectionId, auctionId, viewerCount);

            // Broadcast updated viewer count to all viewers in the auction
            await Clients.Group(auctionId).SendAsync("ViewerCountUpdated", viewerCount);

            // Fetch and send live state for late joiners
            var liveState = await _auctionService.GetLiveStateAsync(auctionId);
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

        public async Task LeaveAuction(string auctionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, auctionId);
            
            // Remove viewer
            if (_auctionViewers.TryGetValue(auctionId, out var viewers))
            {
                lock (viewers)
                {
                    viewers.Remove(Context.ConnectionId);
                }
                
                // Clean up empty sets
                if (viewers.Count == 0)
                {
                    _auctionViewers.TryRemove(auctionId, out _);
                }
            }
            
            var viewerCount = GetViewerCount(auctionId);
            _logger.LogInformation("Connection {ConnectionId} left auction {AuctionId}. Total viewers: {ViewerCount}",
                Context.ConnectionId, auctionId, viewerCount);

            // Broadcast updated viewer count to remaining viewers
            await Clients.Group(auctionId).SendAsync("ViewerCountUpdated", viewerCount);
        }

        public static int GetViewerCount(string auctionId)
        {
            if (_auctionViewers.TryGetValue(auctionId, out var viewers))
            {
                lock (viewers)
                {
                    return viewers.Count;
                }
            }
            return 0;
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
