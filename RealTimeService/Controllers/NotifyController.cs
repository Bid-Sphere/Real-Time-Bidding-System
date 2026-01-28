using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RealTimeService.Hubs;
using RealTimeService.DTOs;
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
            [FromBody] Models.AuctionBidNotification dto)
        {
            await _auctionHub.Clients
                .Group(dto.AuctionId)
                .SendAsync("ReceiveAuctionBid", dto);

            return Ok(new { success = true });
        }

        // 2️⃣ Auction ended
        [HttpPost("auction-end")]
        public async Task<IActionResult> NotifyAuctionEnd(
            [FromBody] DTOs.AuctionEndNotification dto)
        {
            await _auctionHub.Clients
                .Group(dto.AuctionId)
                .SendAsync("AuctionEnded", dto);

            return Ok(new { success = true });
        }

        // 3️⃣ Bid submitted (project owner)
        [HttpPost("bid-submitted")]
        public async Task<IActionResult> NotifyBidSubmitted(
            [FromBody] BidSubmittedNotification dto)
        {
            await _notificationHub.Clients
                .Group(dto.ProjectOwnerId)
                .SendAsync("BidSubmitted", dto);

            return Ok(new { success = true });
        }

        // 4️⃣ Bid accepted (bidder)
        [HttpPost("bid-accepted")]
        public async Task<IActionResult> NotifyBidAccepted(
            [FromBody] BidAcceptedNotification dto)
        {
            await _notificationHub.Clients
                .Group(dto.BidderId)
                .SendAsync("BidAccepted", dto);

            return Ok(new { success = true });
        }

        // 5️⃣ Bid rejected (bidder)
        [HttpPost("bid-rejected")]
        public async Task<IActionResult> NotifyBidRejected(
            [FromBody] BidRejectedNotification dto)
        {
            await _notificationHub.Clients
                .Group(dto.BidderId)
                .SendAsync("BidRejected", dto);

            return Ok(new { success = true });
        }

        // 6️⃣ Project published (broadcast)
        [HttpPost("project-published")]
        public async Task<IActionResult> NotifyProjectPublished(
            [FromBody] ProjectPublishedNotification dto)
        {
            await _notificationHub.Clients
                .All
                .SendAsync("ProjectPublished", dto);

            return Ok(new { success = true });
        }
    }
}
