using RealTimeService.DTOs;
using System.Text.Json;

namespace RealTimeService.Services
{
    public class AuctionService : IAuctionService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AuctionService> _logger;
        private readonly string _auctionServiceUrl;

        public AuctionService(
            HttpClient httpClient, 
            IConfiguration configuration,
            ILogger<AuctionService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _auctionServiceUrl = configuration["Services:AuctionService:Url"] 
                ?? "http://localhost:8084";
        }

        public async Task<LiveAuctionStateDTO?> GetLiveStateAsync(long auctionId)
        {
            try
            {
                var url = $"{_auctionServiceUrl}/api/auctions/{auctionId}/live-state";
                _logger.LogInformation("Fetching live state for auction {AuctionId} from {Url}", 
                    auctionId, url);

                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning(
                        "Failed to fetch live state for auction {AuctionId}. Status: {StatusCode}", 
                        auctionId, response.StatusCode);
                    return null;
                }

                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var liveState = JsonSerializer.Deserialize<LiveAuctionStateDTO>(content, options);
                _logger.LogInformation(
                    "Successfully fetched live state for auction {AuctionId}", auctionId);

                return liveState;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, 
                    "Error fetching live state for auction {AuctionId}", auctionId);
                return null;
            }
        }
    }
}
