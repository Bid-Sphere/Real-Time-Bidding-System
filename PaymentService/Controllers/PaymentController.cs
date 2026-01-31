using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.DTOs;
using PaymentService.Gateway;
using PaymentService.Models;
using PaymentService.DTOs;
using System.Security.Cryptography;
using System.Text;


namespace PaymentService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentDbContext _context;
        private readonly RazorpayClientService _razorpay;
        private readonly IConfiguration _configuration;

        public PaymentController(PaymentDbContext context, RazorpayClientService razorpay, IConfiguration configuration)
        {
            _context = context;
            _razorpay = razorpay;
            _configuration = configuration;
        }

        // 1. Create a payment entry (before redirecting to Razorpay)

        [HttpPost("create")]
        public IActionResult CreatePayment(int userId, decimal amount)
        {
            var payment = new Payment
            {
                UserId = userId,
                Amount = amount,
                Status = "pending"
            };

            _context.payments.Add(payment);
            _context.SaveChanges();

            var order = _razorpay.CreateOrder(amount);

            return Ok(new
            {
                paymentId = payment.Id,
                razorpayOrderId = order["id"].ToString(),
                amount = amount,
                key = HttpContext.RequestServices
              .GetRequiredService<IConfiguration>()["Razorpay:Key"]
            });
        }

        // 2. Mark payment as success (after Razorpay confirms)
        [HttpPost("verify")]
        public IActionResult VerifyPayment([FromBody] VerifyPaymentRequest request)
        {
            var payment = _context.payments.FirstOrDefault(p => p.Id == request.PaymentId);

            if (payment == null)
                return NotFound("Payment record not found");

            // Create signature
            string payload = request.RazorpayOrderId + "|" + request.RazorpayPaymentId;
            string secret = _configuration["Razorpay:Secret"];

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            string generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

            if (generatedSignature != request.RazorpaySignature)
                return BadRequest("Invalid payment signature");

            // Signature valid → Payment is genuine
            payment.Status = "Success";
            payment.TransactionId = request.RazorpayPaymentId;
            _context.SaveChanges();

            return Ok("Payment verified and user can be activated");
        }


        [HttpGet("status/(userId)")]
        public IActionResult GetStatus(int userId)
        {
                var payment= _context.payments
                    .Where(p => p.UserId == userId && p.Status == "Success")
                    .OrderByDescending(p => p.CreatedAt)
                    .FirstOrDefault();

            if (payment == null)
                return Ok("not paid");
            
            return Ok("paid");
        }
    }
}
