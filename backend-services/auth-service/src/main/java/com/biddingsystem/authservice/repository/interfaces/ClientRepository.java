package com.biddingsystem.authservice.repository.interfaces;

import com.biddingsystem.authservice.model.Client;

public interface ClientRepository
{
    Long saveClientProfile(Client profile);
    Client findByUserId(Long userId);
    void updateClientProfile(Client profile);
    void deleteByUserId(Long userId);
}