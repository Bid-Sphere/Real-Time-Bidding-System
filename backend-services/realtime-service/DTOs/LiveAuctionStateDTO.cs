namespace RealTimeService.DTOs
{
    /// <summary>
    /// DTO representing the current state of a live auction.
    /// Used for late joiners to get the complete auction state.
    /// Requirements: 8.1, 8.2, 8.3
    /// </summary>
    public class LiveAuctionStateDTO
    {
        /// <summary>
        /// The current accepted bid (winning bid).
        /// Null if no bid has been accepted yet.
        /// </summary>
        public BidDTO? CurrentAcceptedBid { get; set; }
        
        /// <summary>
        /// The last 5 bids in chronological order (most recent first).
        /// </summary>
        public List<BidDTO>? RecentBids { get; set; }
        
        /// <summary>
        /// The current status of the auction.
        /// </summary>
        public AuctionStatus AuctionStatus { get; set; }
        
        /// <summary>
        /// Remaining time until auction end in milliseconds.
        /// 0 if auction has ended.
        /// </summary>
        public long RemainingTimeMs { get; set; }
        
        /// <summary>
        /// The minimum next bid amount based on current lowest bid.
        /// Null if no bids exist yet.
        /// </summary>
        public decimal? MinimumNextBid { get; set; }
    }
}
