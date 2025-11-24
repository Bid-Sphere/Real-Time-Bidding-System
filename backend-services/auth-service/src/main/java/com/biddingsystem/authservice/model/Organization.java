package com.biddingsystem.authservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Organization
{
    private Long id;
    private Long userId;
    private String companyName;
    private String industry;
    private String companySize;
    private String website;
    private String taxId;
    private String businessRegistrationNumber;
    private String contactPerson;
    private String contactPersonRole;
}