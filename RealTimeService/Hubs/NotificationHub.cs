using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace RealTimeService.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public async Task JoinUserNotifications(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
    }
}
