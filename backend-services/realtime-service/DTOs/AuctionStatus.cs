namespace RealTimeService.DTOs
{
    /// <summary>
    /// Represents the status of an auction in the system.
    /// </summary>
    public enum AuctionStatus
    {
        /// <summary>
        /// Auction is scheduled but not yet live.
        /// </summary>
        SCHEDULED,
        
        /// <summary>
        /// Auction is currently active and accepting bids.
        /// </summary>
        ACTIVE,
        
        /// <summary>
        /// Auction has ended and winner has been determined.
        /// </summary>
        ENDED,
        
        /// <summary>
        /// Auction has been cancelled.
        /// </summary>
        CANCELLED
    }
}
