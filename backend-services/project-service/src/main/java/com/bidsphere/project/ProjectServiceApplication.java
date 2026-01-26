package com.bidsphere.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ProjectServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectServiceApplication.class, args);
        System.out.println("╔════════════════════════════════════════════════════════╗");
        System.out.println("║   🚀 Project Microservice Started Successfully!     ║");
        System.out.println("║   📍 Port: 8082                                      ║");
        System.out.println("║   📊 Database: project_auction_db (MySQL)           ║");
        System.out.println("║   🔗 API Docs: http://localhost:8082/api/projects  ║");
        System.out.println("╚════════════════════════════════════════════════════════╝");
    }
}
