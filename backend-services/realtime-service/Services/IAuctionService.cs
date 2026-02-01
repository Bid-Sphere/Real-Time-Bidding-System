using RealTimeService.DTOs;

namespace RealTimeService.Services
{
    public interface IAuctionService
    {
        Task<LiveAuctionStateDTO?> GetLiveStateAsync(string auctionId);
    }
}
