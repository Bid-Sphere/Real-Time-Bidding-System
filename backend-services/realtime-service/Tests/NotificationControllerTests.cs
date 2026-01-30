using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Moq;
using RealTimeService.Controllers;
using RealTimeService.DTOs;
using RealTimeService.Hubs;

namespace RealTimeService.Tests
{
    public class NotificationControllerTests
    {
        private readonly Mock<IHubContext<AuctionHub>> _mockHubContext;
        private readonly Mock<ILogger<NotificationController>> _mockLogger;
        private readonly NotificationController _controller;
        private readonly Mock<IHubClients> _mockClients;
        private readonly Mock<IClientProxy> _mockClientProxy;

        public NotificationControllerTests()
        {
            _mockHubContext = new Mock<IHubContext<AuctionHub>>();
            _mockLogger = new Mock<ILogger<NotificationController>>();
            _mockClients = new Mock<IHubClients>();
            _mockClientProxy = new Mock<IClientProxy>();

            _mockHubContext.Setup(h => h.Clients).Returns(_mockClients.Object);
            _mockClients.Setup(c => c.Group(It.IsAny<string>())).Returns(_mockClientProxy.Object);

            _controller = new NotificationController(_mockHubContext.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task BidSubmitted_WithValidBid_ReturnsOkAndBroadcasts()
        {
            // Arrange
            var bid = new BidDTO
            {
                Id = "1",
                AuctionId = "123",
                OrganizationId = "456",
                OrganizationName = "Test Org",
                Amount = 50000,
                Status = BidStatus.PENDING,
                CreatedAt = DateTime.UtcNow,
                IsCurrentLowest = true
            };

            // Act
            var result = await _controller.BidSubmitted(bid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(
                    "ReceiveBid",
                    It.Is<object[]>(o => o.Length == 1 && o[0] == bid),
                    default),
                Times.Once);
        }

        [Fact]
        public async Task BidSubmitted_WithNullBid_ReturnsBadRequest()
        {
            // Act
            var result = await _controller.BidSubmitted(null!);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), default),
                Times.Never);
        }

        [Fact]
        public async Task BidSubmitted_WithEmptyAuctionId_ReturnsBadRequest()
        {
            // Arrange
            var bid = new BidDTO
            {
                Id = "1",
                AuctionId = "",
                Amount = 50000
            };

            // Act
            var result = await _controller.BidSubmitted(bid);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task BidAccepted_WithValidBid_ReturnsOkAndBroadcasts()
        {
            // Arrange
            var bid = new BidDTO
            {
                Id = "1",
                AuctionId = "123",
                OrganizationId = "456",
                OrganizationName = "Test Org",
                Amount = 50000,
                Status = BidStatus.ACCEPTED,
                CreatedAt = DateTime.UtcNow
            };

            // Act
            var result = await _controller.BidAccepted(bid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(
                    "ReceiveBidAccepted",
                    It.Is<object[]>(o => o.Length == 1 && o[0] == bid),
                    default),
                Times.Once);
        }

        [Fact]
        public async Task BidRejected_WithValidBid_ReturnsOkAndBroadcasts()
        {
            // Arrange
            var bid = new BidDTO
            {
                Id = "1",
                AuctionId = "123",
                OrganizationId = "456",
                OrganizationName = "Test Org",
                Amount = 50000,
                Status = BidStatus.REJECTED,
                CreatedAt = DateTime.UtcNow
            };

            // Act
            var result = await _controller.BidRejected(bid);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(
                    "ReceiveBidRejected",
                    It.Is<object[]>(o => o.Length == 1 && o[0] == bid),
                    default),
                Times.Once);
        }

        [Fact]
        public async Task AuctionStatusChanged_WithValidStatusChange_ReturnsOkAndBroadcasts()
        {
            // Arrange
            var statusChange = new AuctionStatusChangeDTO
            {
                AuctionId = "123",
                OldStatus = AuctionStatus.SCHEDULED,
                NewStatus = AuctionStatus.ACTIVE,
                Timestamp = DateTime.UtcNow
            };

            // Act
            var result = await _controller.AuctionStatusChanged(statusChange);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(
                    "ReceiveAuctionStatusChange",
                    It.Is<object[]>(o => o.Length == 1 && o[0] == statusChange),
                    default),
                Times.Once);
        }

        [Fact]
        public async Task AuctionStatusChanged_WithNullStatusChange_ReturnsBadRequest()
        {
            // Act
            var result = await _controller.AuctionStatusChanged(null!);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task BidSubmitted_WithBroadcastException_ReturnsOkWithFailureMessage()
        {
            // Arrange
            var bid = new BidDTO
            {
                Id = "1",
                AuctionId = "123",
                Amount = 50000
            };

            _mockClientProxy
                .Setup(c => c.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), default))
                .ThrowsAsync(new Exception("Broadcast failed"));

            // Act
            var result = await _controller.BidSubmitted(bid);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
            
            // Verify the response contains success=false
            var valueType = okResult.Value.GetType();
            var successProperty = valueType.GetProperty("success");
            Assert.NotNull(successProperty);
            var successValue = (bool)successProperty.GetValue(okResult.Value)!;
            Assert.False(successValue);
        }
    }
}
