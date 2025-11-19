package com.biddingsystem.projectauction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.biddingsystem.projectauction", "com.biddingsystem.common"})
public class ProjectAuctionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjectAuctionServiceApplication.class, args);
    }
}
