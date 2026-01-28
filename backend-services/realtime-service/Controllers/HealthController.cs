using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace RealTimeService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;

        public HealthController(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        [HttpGet]
        public IActionResult Get()
        {
            bool redisConnected = _redis.IsConnected;

            return Ok(new
            {
                success = true,
                message = "Real-Time Service is running",
                data = new
                {
                    connectedClients = 0,   // later we can make this dynamic
                    redisConnected = redisConnected
                }
            });
        }
    }
}
