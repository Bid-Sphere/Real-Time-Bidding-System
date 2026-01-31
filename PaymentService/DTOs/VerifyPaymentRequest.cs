namespace PaymentService.DTOs
{
    public class VerifyPaymentRequest
    {
        public int PaymentId { get; set; }
        public string RazorpayPaymentId { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpaySignature { get; set; }
    }
}
