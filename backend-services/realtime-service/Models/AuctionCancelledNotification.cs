namespace RealTimeService.Models
{
    public class AuctionCancelledNotification
    {
        public string AuctionId { get; set; }
        public string ProjectId { get; set; }
        public string Reason { get; set; }
        public DateTime CancelledAt { get; set; }
    }
}
