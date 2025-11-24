package com.biddingsystem.authservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client
{
    private Long id;
    private Long userId;
    private String companyName; // Optional for individual clients
    private String industry;
    private String companySize;
    private String website;
    private String billingAddress;
    private String taxId;
}