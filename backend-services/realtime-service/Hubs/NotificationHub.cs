using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace RealTimeService.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                // Automatically add user to their personal notification group
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
                _logger.LogInformation("User {UserId} connected to NotificationHub", userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                _logger.LogInformation("User {UserId} disconnected from NotificationHub", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinUserNotifications(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            _logger.LogInformation("Connection {ConnectionId} joined user notifications {UserId}", 
                Context.ConnectionId, userId);
        }

        public Task MarkAsRead(string notificationId)
        {
            // Optional for MVP - placeholder for future implementation
            _logger.LogInformation("Notification {NotificationId} marked as read by user {UserId}", 
                notificationId, GetUserId());
            return Task.CompletedTask;
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
