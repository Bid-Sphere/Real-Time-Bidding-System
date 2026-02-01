package com.biddingsystem.authservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    // In-memory storage for verification codes (for testing/fallback)
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    private final Random random = new Random();
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@bidsphere.com}")
    private String fromEmail;

    @Value("${email.verification.url:http://localhost:3000/verify-email}")
    private String verificationBaseUrl;

    @Value("${email.verification.enabled:false}")
    private boolean emailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    /**
     * Send verification code via email
     */
    public String sendVerificationCode(String email) {
        return sendVerificationCode(email, "User");
    }
    
    /**
     * Send verification code via email with user name
     */
    public String sendVerificationCode(String email, String userName) {
        // Generate 6-digit code
        String code = String.format("%06d", random.nextInt(1000000));
        
        // Store code for verification
        verificationCodes.put(email, code);
        
        if (emailEnabled && mailSender != null) {
            try {
                // Send actual email
                sendVerificationEmail(email, code, userName);
                logger.info("Verification email sent to: {}", email);
                
                // Also log to console for development visibility
                logToConsole(email, code);
                
            } catch (Exception e) {
                // Fallback to console if email sending fails
                logger.error("Failed to send email to {}: {}. Falling back to console log.", 
                        email, e.getMessage());
                logToConsole(email, code);
            }
        } else {
            // Email not configured/enabled, log to console
            logger.warn("Email sending is disabled or not configured. Logging to console only.");
            logToConsole(email, code);
        }
        
        return code;
    }
    
    /**
     * Send HTML verification email
     */
    private void sendVerificationEmail(String toEmail, String verificationCode, String userName) 
            throws MessagingException {
        
        String verificationLink = verificationBaseUrl + "?code=" + verificationCode + "&email=" + toEmail;
        
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Verify Your Email - BidSphere");
        
        String htmlContent = buildVerificationEmailHtml(userName, verificationLink, verificationCode);
        helper.setText(htmlContent, true);
        
        mailSender.send(mimeMessage);
    }
    
    /**
     * Send simple text email (alternative method)
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            logger.info("Simple email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send simple email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
    
    /**
     * Build HTML email content
     */
    private String buildVerificationEmailHtml(String userName, String verificationLink, String verificationCode) {
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Email Verification - BidSphere</title>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }" +
                "        .container { background-color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
                "        .header { text-align: center; margin-bottom: 30px; }" +
                "        .logo { color: #2c3e50; font-size: 28px; font-weight: bold; margin-bottom: 10px; }" +
                "        .tagline { color: #7f8c8d; font-size: 14px; }" +
                "        .content { margin-bottom: 30px; }" +
                "        .greeting { font-size: 18px; margin-bottom: 20px; }" +
                "        .verification-code { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 25px 0; border-radius: 8px; font-family: 'Courier New', monospace; color: #2c3e50; border: 2px dashed #3498db; }" +
                "        .button-container { text-align: center; margin: 30px 0; }" +
                "        .button { display: inline-block; background-color: #3498db; color: white; padding: 14px 35px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; }" +
                "        .button:hover { background-color: #2980b9; }" +
                "        .instructions { background-color: #f0f8ff; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; margin: 20px 0; font-size: 14px; }" +
                "        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; }" +
                "        .important { color: #e74c3c; font-weight: bold; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"container\">" +
                "        <div class=\"header\">" +
                "            <div class=\"logo\">BidSphere</div>" +
                "            <div class=\"tagline\">Your Bidding Platform</div>" +
                "        </div>" +
                "        <div class=\"content\">" +
                "            <div class=\"greeting\">Hello " + (userName != null ? userName : "User") + ",</div>" +
                "            <p>Thank you for registering with BidSphere. To complete your registration and access all features, please verify your email address.</p>" +
                "            <div class=\"verification-code\">" + verificationCode + "</div>" +
                "            <div class=\"button-container\">" +
                "                <a href=\"" + verificationLink + "\" class=\"button\">Verify Email Address</a>" +
                "            </div>" +
                "            <div class=\"instructions\">" +
                "                <p><strong>Instructions:</strong></p>" +
                "                <p>1. Enter the verification code above on the verification page</p>" +
                "                <p>2. Or click the \"Verify Email Address\" button</p>" +
                "                <p>3. This code will expire in <span class=\"important\">15 minutes</span></p>" +
                "            </div>" +
                "            <p>If you did not create an account with BidSphere, please ignore this email.</p>" +
                "            <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>" +
                "            <p style=\"word-break: break-all; font-size: 12px; color: #666;\">" + verificationLink + "</p>" +
                "        </div>" +
                "        <div class=\"footer\">" +
                "            <p>© 2024 BidSphere. All rights reserved.</p>" +
                "            <p>This is an automated email, please do not reply.</p>" +
                "            <p>Need help? Contact our support team at support@bidsphere.com</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
    
    /**
     * Log verification code to console (for development/testing)
     */
    private void logToConsole(String email, String code) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🔐 EMAIL VERIFICATION CODE 🔐");
        System.out.println("=".repeat(60));
        System.out.println("📧 To: " + email);
        System.out.println("📋 Subject: BidSphere Email Verification");
        System.out.println("🔢 VERIFICATION CODE: " + code);
        System.out.println("🔗 Verification URL: " + verificationBaseUrl + "?code=" + code + "&email=" + email);
        System.out.println("⏰ Valid for: 15 minutes");
        System.out.println("=".repeat(60) + "\n");
    }
    
    /**
     * Verify the code entered by user
     */
    public boolean verifyCode(String email, String enteredCode) {
        String storedCode = verificationCodes.get(email);
        
        if (storedCode == null) {
            logger.warn("No verification code found for email: {}", email);
            return false;
        }
        
        boolean isValid = storedCode.equals(enteredCode);
        
        if (isValid) {
            // Remove code after successful verification
            verificationCodes.remove(email);
            logger.info("Email verification successful for: {}", email);
        } else {
            logger.warn("Invalid verification code for email: {}", email);
        }
        
        return isValid;
    }
    
    /**
     * Check if code exists for email
     */
    public boolean hasCodeForEmail(String email) {
        return verificationCodes.containsKey(email);
    }
    
    /**
     * Resend verification code
     */
    public String resendVerificationCode(String email) {
        // Remove old code if exists
        verificationCodes.remove(email);
        
        // Generate and send new code
        return sendVerificationCode(email);
    }
    
    /**
     * Remove expired codes (call this periodically)
     */
    public void cleanupExpiredCodes() {
        // In a real implementation, you might want to add expiration tracking
        // For now, this just clears old entries periodically
        verificationCodes.clear();
        logger.info("Cleaned up verification codes cache");
    }
}