namespace RealTimeService.DTOs
{
    /// <summary>
    /// DTO representing a change in auction status.
    /// Used to broadcast status transitions to all participants.
    /// </summary>
    public class AuctionStatusChangeDTO
    {
        /// <summary>
        /// Identifier of the auction whose status changed.
        /// </summary>
        public string? AuctionId { get; set; }
        
        /// <summary>
        /// Previous status of the auction.
        /// </summary>
        public AuctionStatus OldStatus { get; set; }
        
        /// <summary>
        /// New status of the auction.
        /// </summary>
        public AuctionStatus NewStatus { get; set; }
        
        /// <summary>
        /// Timestamp when the status change occurred.
        /// </summary>
        public DateTime Timestamp { get; set; }
    }
}
