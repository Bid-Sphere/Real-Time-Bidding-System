package com.biddingsystem.bidding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.biddingsystem.bidding", "com.biddingsystem.common"})
public class BiddingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BiddingServiceApplication.class, args);
    }
}
