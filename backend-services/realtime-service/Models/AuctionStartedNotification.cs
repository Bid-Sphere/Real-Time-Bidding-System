namespace RealTimeService.Models
{
    public class AuctionStartedNotification
    {
        public string AuctionId { get; set; }
        public string ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
