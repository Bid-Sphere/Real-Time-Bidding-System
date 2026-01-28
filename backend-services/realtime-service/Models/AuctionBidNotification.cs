namespace RealTimeService.Models
{
    public class AuctionBidNotification
    {
        public string AuctionId { get; set; }
        public string ProjectId { get; set; }
        public string BidderName { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime BidTime { get; set; }
        public bool IsWinning { get; set; }
        public decimal NextMinimumBid { get; set; }
        public int TotalBids { get; set; }
    }
}
