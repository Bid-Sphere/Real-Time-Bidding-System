package com.bidsphere.auctionservice.repository.interfaces;

import com.bidsphere.auctionservice.model.Auction;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository {

    Auction save(Auction auction);
    Optional<Auction> findById(String id);
    Optional<Auction> findByProjectId(String projectId);
    List<Auction> findByStatus(String status, int limit, int offset);
    List<Auction> findActiveAuctions(int limit, int offset);
    List<Auction> findByClientUserId(String clientUserId, int limit, int offset);
    List<Auction> findAuctionsToStart();
    List<Auction> findAuctionsToClose();
    int update(Auction auction);
    int updateStatus(String auctionId, String status);
    boolean existsByProjectId(String projectId);
    int countActiveAuctions();
    int countByClientUserId(String clientUserId);
}