package com.biddingsystem.authservice.repository.interfaces;


import com.biddingsystem.authservice.model.Freelancer;

public interface FreelancerRepository
{
    Long saveFreelancerProfile(Freelancer profile);
    Freelancer findByUserId(Long userId);
    void updateFreelancerProfile(Freelancer profile);
    void deleteByUserId(Long userId);
}