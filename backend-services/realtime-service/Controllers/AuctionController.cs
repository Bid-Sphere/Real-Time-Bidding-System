using Microsoft.AspNetCore.Mvc;
using RealTimeService.Hubs;

namespace RealTimeService.Controllers
{
    [ApiController]
    [Route("api/realtime/auctions")]
    public class AuctionController : ControllerBase
    {
        private readonly ILogger<AuctionController> _logger;

        public AuctionController(ILogger<AuctionController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{auctionId}/viewers")]
        public IActionResult GetViewerCount(string auctionId)
        {
            var viewerCount = AuctionHub.GetViewerCount(auctionId);
            _logger.LogInformation("Viewer count for auction {AuctionId}: {ViewerCount}", auctionId, viewerCount);
            
            return Ok(new { auctionId, viewerCount });
        }
    }
}
