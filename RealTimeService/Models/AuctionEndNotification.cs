namespace RealTimeService.Models
{
    public class AuctionEndNotification
    {
        public string AuctionId { get; set; }
        public string ProjectId { get; set; }
        public string WinnerBidderName { get; set; }
        public decimal WinningBidAmount { get; set; }
        public int TotalBids { get; set; }
        public DateTime EndTime { get; set; }
    }
}
