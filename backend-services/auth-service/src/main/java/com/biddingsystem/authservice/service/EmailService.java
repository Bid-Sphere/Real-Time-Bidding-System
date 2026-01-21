package com.biddingsystem.authservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Random;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    // In-memory storage for verification codes (for testing only)
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    private final Random random = new Random();
    
    /**
     * Send verification code via email (mock implementation for testing)
     */
    public String sendVerificationCode(String email) {
        // Generate 6-digit code
        String code = String.format("%06d", random.nextInt(1000000));
        
        // Store code for verification
        verificationCodes.put(email, code);
        
        // Mock email sending - log to console for testing with enhanced visibility
        System.out.println("\n" + "=".repeat(50));
        System.out.println("🔐 EMAIL VERIFICATION CODE 🔐");
        System.out.println("=".repeat(50));
        System.out.println("📧 To: " + email);
        System.out.println("📋 Subject: BidSphere Email Verification");
        System.out.println("🔢 VERIFICATION CODE: " + code);
        System.out.println("⏰ Valid for: 10 minutes");
        System.out.println("=".repeat(50) + "\n");
        
        // Also log using SLF4J for application logs
        logger.info("=== EMAIL VERIFICATION CODE ===");
        logger.info("To: {}", email);
        logger.info("Subject: BidSphere Email Verification");
        logger.info("Verification Code: {}", code);
        logger.info("===============================");
        
        // In production, you would send actual email here
        // emailClient.send(email, "Verification Code", "Your code is: " + code);
        
        return code;
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
     * Check if code exists for email (for testing)
     */
    public boolean hasCodeForEmail(String email) {
        return verificationCodes.containsKey(email);
    }
}