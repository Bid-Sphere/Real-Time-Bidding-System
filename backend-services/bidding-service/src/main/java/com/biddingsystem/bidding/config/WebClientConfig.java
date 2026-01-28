package com.biddingsystem.bidding.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    
    @Value("${services.project.url}")
    private String projectServiceUrl;
    
    @Bean
    public WebClient projectServiceWebClient() {
        return WebClient.builder()
                .baseUrl(projectServiceUrl)
                .build();
    }
}
