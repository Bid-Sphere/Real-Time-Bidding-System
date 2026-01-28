using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RealTimeService.Hubs;
using RealTimeService.Models;


namespace RealTimeService.Controllers
{
    [ApiController]
    [Route("api/notify")]
    public class NotifyController : ControllerBase
    {
        private readonly IHubContext<AuctionHub> _auctionHub;
        private readonly IHubContext<NotificationHub> _notificationHub;

        // Constructor injection
        public NotifyController(
            IHubContext<AuctionHub> auctionHub,
            IHubContext<NotificationHub> notificationHub)
        {
            _auctionHub = auctionHub;
            _notificationHub = notificationHub;
        }

        // 1️⃣ Auction bid update
        [HttpPost("auction-bid")]
        public async Task<IActionResult> NotifyAuctionBid(
            [FromBody] AuctionBidNotification dto)
        {
            await _auctionHub.Clients
                .Group(dto.AuctionId)
                .SendAsync("ReceiveAuctionBid", dto);

            return Ok(new
            {
                success = true,
                message = "Auction bid notification sent",
                data = new { recipientCount = 0 } // Will be dynamic when connection tracking is added
            });
        }

        // 2️⃣ Auction started
        [HttpPost("auction-started")]
        public async Task<IActionResult> NotifyAuctionStarted(
            [FromBody] AuctionStartedNotification dto)
        {
            await _auctionHub.Clients
                .Group(dto.AuctionId)
                .SendAsync("AuctionStarted", dto);

            return Ok(new
            {
                success = true,
                message = "Auction started notification sent",
                data = new { recipientCount = 0 }
            });
        }

        // 3️⃣ Auction ended
        [HttpPost("auction-end")]
        public async Task<IActionResult> NotifyAuctionEnd(
            [FromBody] AuctionEndNotification dto)
        {
            await _auctionHub.Clients
                .Group(dto.AuctionId)
                .SendAsync("AuctionEnded", dto);

            return Ok(new
            {
                success = true,
                message = "Auction end notification sent",
                data = new { recipientCount = 0 }
            });
        }

        // 4️⃣ Auction cancelled
        [HttpPost("auction-cancelled")]
        public async Task<IActionResult> NotifyAuctionCancelled(
            [FromBody] AuctionCancelledNotification dto)
        {
            await _auctionHub.Clients
                .Group(dto.AuctionId)
                .SendAsync("AuctionCancelled", dto);

            return Ok(new
            {
                success = true,
                message = "Auction cancelled notification sent",
                data = new { recipientCount = 0 }
            });
        }

        // 5️⃣ Bid submitted (project owner)
        [HttpPost("bid-submitted")]
        public async Task<IActionResult> NotifyBidSubmitted(
            [FromBody] BidSubmittedNotification dto)
        {
            await _notificationHub.Clients
                .Group(dto.ProjectOwnerId)
                .SendAsync("BidSubmitted", dto);

            return Ok(new
            {
                success = true,
                message = "Bid submitted notification sent",
                data = new { recipientCount = 0 }
            });
        }

        // 6️⃣ Bid accepted (bidder)
        [HttpPost("bid-accepted")]
        public async Task<IActionResult> NotifyBidAccepted(
            [FromBody] BidAcceptedNotification dto)
        {
            await _notificationHub.Clients
                .Group(dto.BidderId)
                .SendAsync("BidAccepted", dto);

            return Ok(new
            {
                success = true,
                message = "Bid accepted notification sent",
                data = new { recipientCount = 0 }
            });
        }

        // 7️⃣ Bid rejected (bidder)
        [HttpPost("bid-rejected")]
        public async Task<IActionResult> NotifyBidRejected(
            [FromBody] BidRejectedNotification dto)
        {
            await _notificationHub.Clients
                .Group(dto.BidderId)
                .SendAsync("BidRejected", dto);

            return Ok(new
            {
                success = true,
                message = "Bid rejected notification sent",
                data = new { recipientCount = 0 }
            });
        }

        // 8️⃣ Project published (broadcast)
        [HttpPost("project-published")]
        public async Task<IActionResult> NotifyProjectPublished(
            [FromBody] ProjectPublishedNotification dto)
        {
            await _notificationHub.Clients
                .All
                .SendAsync("ProjectPublished", dto);

            return Ok(new
            {
                success = true,
                message = "Project published notification sent",
                data = new { recipientCount = 0 }
            });
        }
    }
}
