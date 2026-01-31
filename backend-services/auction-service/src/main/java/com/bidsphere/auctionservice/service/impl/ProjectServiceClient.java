package com.bidsphere.auctionservice.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProjectServiceClient {

    private static final Logger log = LoggerFactory.getLogger(ProjectServiceClient.class);

    private final RestTemplate restTemplate;
    private final String projectServiceUrl;

    public ProjectServiceClient(
            RestTemplate restTemplate,
            @Value("${services.project-service.url:http://localhost:8082}") String projectServiceUrl) {
        this.restTemplate = restTemplate;
        this.projectServiceUrl = projectServiceUrl;
    }

    /**
     * Update project status when auction ends
     */
    public void updateProjectAfterAuction(String projectId, String winningBidId, 
                                          String winnerOrganizationId, BigDecimal winningAmount, 
                                          int totalBids, String winnerEmail, String winnerOrganizationName) {
        try {
            String url = projectServiceUrl + "/api/projects/" + projectId + "/auction-completed";
            
            Map<String, Object> request = new HashMap<>();
            request.put("winningBidId", winningBidId);
            request.put("winnerOrganizationId", winnerOrganizationId);
            request.put("winnerOrganizationName", winnerOrganizationName);
            request.put("winningAmount", winningAmount);
            request.put("totalBids", totalBids);
            request.put("winnerEmail", winnerEmail);
            request.put("status", "IN_PROGRESS");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            restTemplate.postForEntity(url, entity, Void.class);
            
            log.info("Successfully updated project {} after auction completion", projectId);
        } catch (RestClientException e) {
            log.error("Failed to update project {} after auction: {}", projectId, e.getMessage());
            // Don't throw exception - auction should still close even if project update fails
        }
    }
}
