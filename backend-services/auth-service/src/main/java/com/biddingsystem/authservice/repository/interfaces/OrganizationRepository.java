package com.biddingsystem.authservice.repository.interfaces;

import com.biddingsystem.authservice.model.Organization;

public interface OrganizationRepository
{
    Long saveOrganizationProfile(Organization profile);
    Organization findByUserId(Long userId);
    void updateOrganizationProfile(Organization profile);
    void deleteByUserId(Long userId);
}