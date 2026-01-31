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

        public async Task<LiveAuctionStateDTO?> GetLiveStateAsync(string auctionId)
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
                _logger.LogInformation("Live state response: {Content}", content);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
                };

                // The response is wrapped in BaseResponse structure
                var wrapper = JsonSerializer.Deserialize<BaseResponseWrapper>(content, options);
                if (wrapper?.Data == null)
                {
                    _logger.LogWarning("No data in live state response for auction {AuctionId}", auctionId);
                    return null;
                }

                var liveState = JsonSerializer.Deserialize<LiveAuctionStateDTO>(
                    JsonSerializer.Serialize(wrapper.Data), options);
                
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

    // Helper class to deserialize the BaseResponse wrapper
    internal class BaseResponseWrapper
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public JsonElement Data { get; set; }
    }
}
