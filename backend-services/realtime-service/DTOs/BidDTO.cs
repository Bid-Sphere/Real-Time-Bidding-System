namespace RealTimeService.DTOs
{
    /// <summary>
    /// Data Transfer Object representing a bid in the auction system.
    /// Matches the Java BidDTO structure for cross-service compatibility.
    /// </summary>
    public class BidDTO
    {
        /// <summary>
        /// Unique identifier for the bid.
        /// </summary>
        public string? Id { get; set; }
        
        /// <summary>
        /// Identifier of the auction this bid belongs to.
        /// </summary>
        public string? AuctionId { get; set; }
        
        /// <summary>
        /// Identifier of the organization that submitted the bid.
        /// </summary>
        public string? OrganizationId { get; set; }
        
        /// <summary>
        /// Name of the organization that submitted the bid.
        /// </summary>
        public string? OrganizationName { get; set; }
        
        /// <summary>
        /// Bid amount in the auction currency.
        /// </summary>
        public decimal Amount { get; set; }
        
        /// <summary>
        /// Current status of the bid (PENDING, ACCEPTED, or REJECTED).
        /// </summary>
        public BidStatus Status { get; set; }
        
        /// <summary>
        /// Timestamp when the bid was created.
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// Indicates whether this bid is currently the lowest bid in the auction.
        /// </summary>
        public bool IsCurrentLowest { get; set; }
    }
}
