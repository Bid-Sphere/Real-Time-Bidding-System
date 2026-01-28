namespace RealTimeService.DTOs
{
    public class AuctionBidNotification
    {
        public string AuctionId { get; set; }
        public decimal BidAmount { get; set; }
        public string BidderName { get; set; }
        public int TotalBids { get; set; }
        public decimal NextMinimumBid { get; set; }
        public long TimeRemaining { get; set; }
    }
}
