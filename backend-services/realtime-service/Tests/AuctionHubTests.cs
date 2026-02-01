using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Moq;
using RealTimeService.DTOs;
using RealTimeService.Hubs;
using RealTimeService.Services;
using System.Security.Claims;

namespace RealTimeService.Tests
{
    public class AuctionHubTests
    {
        private readonly Mock<ILogger<AuctionHub>> _mockLogger;
        private readonly Mock<IAuctionService> _mockAuctionService;
        private readonly Mock<HubCallerContext> _mockContext;
        private readonly Mock<IGroupManager> _mockGroups;
        private readonly Mock<IHubCallerClients> _mockClients;
        private readonly Mock<ISingleClientProxy> _mockClientProxy;
        private readonly AuctionHub _hub;

        public AuctionHubTests()
        {
            _mockLogger = new Mock<ILogger<AuctionHub>>();
            _mockAuctionService = new Mock<IAuctionService>();
            _mockContext = new Mock<HubCallerContext>();
            _mockGroups = new Mock<IGroupManager>();
            _mockClients = new Mock<IHubCallerClients>();
            _mockClientProxy = new Mock<ISingleClientProxy>();

            _mockClients.Setup(c => c.Caller).Returns(_mockClientProxy.Object);

            _hub = new AuctionHub(_mockLogger.Object, _mockAuctionService.Object)
            {
                Context = _mockContext.Object,
                Groups = _mockGroups.Object,
                Clients = _mockClients.Object
            };
        }

        [Fact]
        public async Task JoinAuction_AddsConnectionToGroup()
        {
            // Arrange
            var auctionId = "123";
            var connectionId = "conn-123";
            _mockContext.Setup(c => c.ConnectionId).Returns(connectionId);
            _mockAuctionService.Setup(s => s.GetLiveStateAsync(123L))
                .ReturnsAsync((LiveAuctionStateDTO?)null);

            // Act
            await _hub.JoinAuction(auctionId);

            // Assert
            _mockGroups.Verify(
                g => g.AddToGroupAsync(connectionId, auctionId, default),
                Times.Once);
        }

        [Fact]
        public async Task JoinAuction_WithValidAuctionId_SendsLiveState()
        {
            // Arrange
            var auctionId = "123";
            var connectionId = "conn-123";
            var liveState = new LiveAuctionStateDTO
            {
                AuctionStatus = AuctionStatus.ACTIVE,
                RemainingTimeMs = 3600000,
                CurrentAcceptedBid = new BidDTO
                {
                    Id = "1",
                    Amount = 50000
                }
            };

            _mockContext.Setup(c => c.ConnectionId).Returns(connectionId);
            _mockAuctionService.Setup(s => s.GetLiveStateAsync(123L))
                .ReturnsAsync(liveState);

            // Act
            await _hub.JoinAuction(auctionId);

            // Assert
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(
                    "ReceiveLiveState",
                    It.Is<object[]>(o => o.Length == 1 && o[0] == liveState),
                    default),
                Times.Once);
        }

        [Fact]
        public async Task JoinAuction_WithInvalidAuctionId_DoesNotSendLiveState()
        {
            // Arrange
            var auctionId = "invalid";
            var connectionId = "conn-123";

            _mockContext.Setup(c => c.ConnectionId).Returns(connectionId);

            // Act
            await _hub.JoinAuction(auctionId);

            // Assert
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(
                    "ReceiveLiveState",
                    It.IsAny<object[]>(),
                    default),
                Times.Never);
        }

        [Fact]
        public async Task JoinAuction_WithNullLiveState_DoesNotSendLiveState()
        {
            // Arrange
            var auctionId = "123";
            var connectionId = "conn-123";

            _mockContext.Setup(c => c.ConnectionId).Returns(connectionId);
            _mockAuctionService.Setup(s => s.GetLiveStateAsync(123L))
                .ReturnsAsync((LiveAuctionStateDTO?)null);

            // Act
            await _hub.JoinAuction(auctionId);

            // Assert
            _mockClientProxy.Verify(
                c => c.SendCoreAsync(
                    "ReceiveLiveState",
                    It.IsAny<object[]>(),
                    default),
                Times.Never);
        }

        [Fact]
        public async Task LeaveAuction_RemovesConnectionFromGroup()
        {
            // Arrange
            var auctionId = "123";
            var connectionId = "conn-123";
            _mockContext.Setup(c => c.ConnectionId).Returns(connectionId);

            // Act
            await _hub.LeaveAuction(auctionId);

            // Assert
            _mockGroups.Verify(
                g => g.RemoveFromGroupAsync(connectionId, auctionId, default),
                Times.Once);
        }

        [Fact]
        public async Task OnConnectedAsync_WithAuthenticatedUser_AddsToUserGroup()
        {
            // Arrange
            var userId = "user-123";
            var connectionId = "conn-123";
            var claims = new List<Claim>
            {
                new Claim("userId", userId)
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);

            _mockContext.Setup(c => c.ConnectionId).Returns(connectionId);
            _mockContext.Setup(c => c.User).Returns(principal);

            // Act
            await _hub.OnConnectedAsync();

            // Assert
            _mockGroups.Verify(
                g => g.AddToGroupAsync(connectionId, userId, default),
                Times.Once);
        }

        [Fact]
        public async Task OnConnectedAsync_WithoutUserId_DoesNotAddToGroup()
        {
            // Arrange
            var connectionId = "conn-123";
            var identity = new ClaimsIdentity();
            var principal = new ClaimsPrincipal(identity);

            _mockContext.Setup(c => c.ConnectionId).Returns(connectionId);
            _mockContext.Setup(c => c.User).Returns(principal);

            // Act
            await _hub.OnConnectedAsync();

            // Assert
            _mockGroups.Verify(
                g => g.AddToGroupAsync(It.IsAny<string>(), It.IsAny<string>(), default),
                Times.Never);
        }
    }
}
