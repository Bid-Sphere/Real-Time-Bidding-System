namespace RealTimeService.Models
{
    public class BidRejectedNotification
    {
        public string BidId { get; set; }
        public string ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public string BidderId { get; set; }
        public string? Reason { get; set; }
        public DateTime RejectedAt { get; set; }
    }
}
