package com.biddingsystem.auction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.biddingsystem.auction", "com.biddingsystem.common"})
public class ProjectAuctionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjectAuctionServiceApplication.class, args);
    }
}
