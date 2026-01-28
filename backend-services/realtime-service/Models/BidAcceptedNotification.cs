namespace RealTimeService.Models
{
    public class BidAcceptedNotification
    {
        public string BidId { get; set; }
        public string ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public string BidderId { get; set; }
        public DateTime AcceptedAt { get; set; }
    }
}
