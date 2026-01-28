namespace RealTimeService.DTOs
{
    public class AuctionEndNotification
    {
        public string AuctionId { get; set; }
        public string WinnerBidderName { get; set; }
        public decimal WinningBidAmount { get; set; }
    }
}
