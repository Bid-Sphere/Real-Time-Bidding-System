using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using RealTimeService.DTOs;
using RealTimeService.Services;
using System.Net;
using System.Text.Json;

namespace RealTimeService.Tests
{
    public class AuctionServiceTests
    {
        private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
        private readonly Mock<ILogger<AuctionService>> _mockLogger;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly AuctionService _service;

        public AuctionServiceTests()
        {
            _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            _mockLogger = new Mock<ILogger<AuctionService>>();
            _mockConfiguration = new Mock<IConfiguration>();

            _mockConfiguration
                .Setup(c => c["Services:AuctionService:Url"])
                .Returns("http://localhost:8084");

            var httpClient = new HttpClient(_mockHttpMessageHandler.Object);
            _service = new AuctionService(httpClient, _mockConfiguration.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetLiveStateAsync_WithSuccessfulResponse_ReturnsLiveState()
        {
            // Arrange
            var auctionId = 123L;
            var expectedState = new LiveAuctionStateDTO
            {
                CurrentAcceptedBid = new BidDTO
                {
                    Id = "1",
                    AuctionId = "123",
                    Amount = 50000,
                    Status = BidStatus.ACCEPTED
                },
                RecentBids = new List<BidDTO>
                {
                    new BidDTO { Id = "2", Amount = 48000 },
                    new BidDTO { Id = "3", Amount = 47000 }
                },
                AuctionStatus = AuctionStatus.ACTIVE,
                RemainingTimeMs = 3600000,
                MinimumNextBid = 47500
            };

            var jsonResponse = JsonSerializer.Serialize(expectedState);
            var httpResponse = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse)
            };

            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);

            // Act
            var result = await _service.GetLiveStateAsync(auctionId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedState.AuctionStatus, result.AuctionStatus);
            Assert.Equal(expectedState.RemainingTimeMs, result.RemainingTimeMs);
            Assert.NotNull(result.CurrentAcceptedBid);
            Assert.Equal(expectedState.CurrentAcceptedBid.Amount, result.CurrentAcceptedBid.Amount);
        }

        [Fact]
        public async Task GetLiveStateAsync_WithNotFoundResponse_ReturnsNull()
        {
            // Arrange
            var auctionId = 123L;
            var httpResponse = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NotFound
            };

            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);

            // Act
            var result = await _service.GetLiveStateAsync(auctionId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetLiveStateAsync_WithHttpException_ReturnsNull()
        {
            // Arrange
            var auctionId = 123L;

            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ThrowsAsync(new HttpRequestException("Network error"));

            // Act
            var result = await _service.GetLiveStateAsync(auctionId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetLiveStateAsync_WithInvalidJson_ReturnsNull()
        {
            // Arrange
            var auctionId = 123L;
            var httpResponse = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("invalid json")
            };

            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(httpResponse);

            // Act
            var result = await _service.GetLiveStateAsync(auctionId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetLiveStateAsync_CallsCorrectUrl()
        {
            // Arrange
            var auctionId = 123L;
            var expectedUrl = "http://localhost:8084/api/auctions/123/live-state";
            HttpRequestMessage? capturedRequest = null;

            var httpResponse = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("{}")
            };

            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .Callback<HttpRequestMessage, CancellationToken>((req, _) => capturedRequest = req)
                .ReturnsAsync(httpResponse);

            // Act
            await _service.GetLiveStateAsync(auctionId);

            // Assert
            Assert.NotNull(capturedRequest);
            Assert.Equal(expectedUrl, capturedRequest.RequestUri?.ToString());
            Assert.Equal(HttpMethod.Get, capturedRequest.Method);
        }
    }
}
