using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RealTimeService.Hubs;
using RealTimeService.DTOs;

namespace RealTimeService.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly IHubContext<AuctionHub> _hubContext;
        private readonly ILogger<NotificationController> _logger;

        public NotificationController(
            IHubContext<AuctionHub> hubContext,
            ILogger<NotificationController> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }

        /// <summary>
        /// Broadcast new bid submission to all participants in the auction
        /// </summary>
        [HttpPost("bid-submitted")]
        public async Task<IActionResult> BidSubmitted([FromBody] BidDTO bid)
        {
            try
            {
                if (bid == null || string.IsNullOrEmpty(bid.AuctionId))
                {
                    _logger.LogWarning("Received invalid bid submission notification");
                    return BadRequest(new { message = "Invalid bid data" });
                }

                // Broadcast to the group using auctionId directly (not auction_{id})
                _logger.LogInformation(
                    "Broadcasting bid submission for auction {AuctionId}, bid {BidId}, amount {Amount}",
                    bid.AuctionId, bid.Id, bid.Amount);

                await _hubContext.Clients.Group(bid.AuctionId)
                    .SendAsync("ReceiveBid", bid);

                return Ok(new { success = true, message = "Bid submitted notification sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Failed to broadcast bid submission for auction {AuctionId}", 
                    bid?.AuctionId);
                
                // Don't throw - graceful degradation
                return Ok(new { 
                    success = false, 
                    message = "Broadcast failed but operation completed" 
                });
            }
        }

        /// <summary>
        /// Broadcast bid acceptance to all participants in the auction
        /// </summary>
        [HttpPost("bid-accepted")]
        public async Task<IActionResult> BidAccepted([FromBody] BidDTO bid)
        {
            try
            {
                if (bid == null || string.IsNullOrEmpty(bid.AuctionId))
                {
                    _logger.LogWarning("Received invalid bid acceptance notification");
                    return BadRequest(new { message = "Invalid bid data" });
                }

                // Broadcast to the group using auctionId directly
                _logger.LogInformation(
                    "Broadcasting bid acceptance for auction {AuctionId}, bid {BidId}",
                    bid.AuctionId, bid.Id);

                await _hubContext.Clients.Group(bid.AuctionId)
                    .SendAsync("ReceiveBidAccepted", bid);

                return Ok(new { success = true, message = "Bid accepted notification sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Failed to broadcast bid acceptance for auction {AuctionId}", 
                    bid?.AuctionId);
                
                // Don't throw - graceful degradation
                return Ok(new { 
                    success = false, 
                    message = "Broadcast failed but operation completed" 
                });
            }
        }

        /// <summary>
        /// Broadcast bid rejection to all participants in the auction
        /// </summary>
        [HttpPost("bid-rejected")]
        public async Task<IActionResult> BidRejected([FromBody] BidDTO bid)
        {
            try
            {
                if (bid == null || string.IsNullOrEmpty(bid.AuctionId))
                {
                    _logger.LogWarning("Received invalid bid rejection notification");
                    return BadRequest(new { message = "Invalid bid data" });
                }

                // Broadcast to the group using auctionId directly
                _logger.LogInformation(
                    "Broadcasting bid rejection for auction {AuctionId}, bid {BidId}",
                    bid.AuctionId, bid.Id);

                await _hubContext.Clients.Group(bid.AuctionId)
                    .SendAsync("ReceiveBidRejected", bid);

                return Ok(new { success = true, message = "Bid rejected notification sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Failed to broadcast bid rejection for auction {AuctionId}", 
                    bid?.AuctionId);
                
                // Don't throw - graceful degradation
                return Ok(new { 
                    success = false, 
                    message = "Broadcast failed but operation completed" 
                });
            }
        }

        /// <summary>
        /// Broadcast auction status change to all participants in the auction
        /// </summary>
        [HttpPost("auction-status-changed")]
        public async Task<IActionResult> AuctionStatusChanged([FromBody] AuctionStatusChangeDTO statusChange)
        {
            try
            {
                if (statusChange == null || string.IsNullOrEmpty(statusChange.AuctionId))
                {
                    _logger.LogWarning("Received invalid auction status change notification");
                    return BadRequest(new { message = "Invalid status change data" });
                }

                // Broadcast to the group using auctionId directly
                _logger.LogInformation(
                    "Broadcasting auction status change for auction {AuctionId}: {OldStatus} -> {NewStatus}",
                    statusChange.AuctionId, statusChange.OldStatus, statusChange.NewStatus);

                await _hubContext.Clients.Group(statusChange.AuctionId)
                    .SendAsync("ReceiveAuctionStatusChange", statusChange);

                return Ok(new { success = true, message = "Auction status change notification sent" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Failed to broadcast auction status change for auction {AuctionId}", 
                    statusChange?.AuctionId);
                
                // Don't throw - graceful degradation
                return Ok(new { 
                    success = false, 
                    message = "Broadcast failed but operation completed" 
                });
            }
        }
    }
}
