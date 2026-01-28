namespace RealTimeService.Models
{
    public class ProjectPublishedNotification
    {
        public string ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public string Category { get; set; }
        public decimal Budget { get; set; }
        public string BiddingType { get; set; } // STANDARD / LIVE_AUCTION
        public DateTime PublishedAt { get; set; }
    }
}

