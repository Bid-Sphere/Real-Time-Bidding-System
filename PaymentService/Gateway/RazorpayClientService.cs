using Razorpay.Api;

namespace PaymentService.Gateway
{
    public class RazorpayClientService
    {
        private readonly RazorpayClient _client;

        public RazorpayClientService(string key, string secret)
        {
            _client = new RazorpayClient(key, secret);
        }

        public Order CreateOrder(decimal amount)
        {
            var options = new Dictionary<string, object>
            {
                { "amount", amount * 100 }, // Razorpay uses paise
                { "currency", "INR" },
                { "receipt", Guid.NewGuid().ToString() }
            };

            return _client.Order.Create(options);
        }
    }
}
