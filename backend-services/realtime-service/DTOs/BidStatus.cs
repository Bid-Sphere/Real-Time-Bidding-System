namespace RealTimeService.DTOs
{
    /// <summary>
    /// Represents the status of a bid in the auction system.
    /// </summary>
    public enum BidStatus
    {
        /// <summary>
        /// Bid has been submitted and is awaiting client decision.
        /// </summary>
        PENDING,
        
        /// <summary>
        /// Bid has been accepted by the client (current winner).
        /// </summary>
        ACCEPTED,
        
        /// <summary>
        /// Bid has been rejected by the client.
        /// </summary>
        REJECTED
    }
}
