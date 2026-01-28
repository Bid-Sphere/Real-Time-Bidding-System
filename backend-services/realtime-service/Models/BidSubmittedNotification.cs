namespace RealTimeService.Models
{
    public class BidSubmittedNotification
    {
        public string BidId { get; set; }
        public string ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public string ProjectOwnerId { get; set; }
        public string BidderName { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
