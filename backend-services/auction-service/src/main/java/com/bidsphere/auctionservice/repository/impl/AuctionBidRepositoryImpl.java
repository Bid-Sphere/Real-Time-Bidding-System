package com.bidsphere.auctionservice.repository.impl;

import com.bidsphere.auctionservice.model.AuctionBid;
import com.bidsphere.auctionservice.repository.interfaces.AuctionBidRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AuctionBidRepositoryImpl implements AuctionBidRepository
{

    private static final Logger log = LoggerFactory.getLogger(AuctionBidRepositoryImpl.class);

    private final JdbcTemplate jdbcTemplate;

    public AuctionBidRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<AuctionBid> auctionBidRowMapper = new RowMapper<AuctionBid>() {
        @Override
        public AuctionBid mapRow(ResultSet rs, int rowNum) throws SQLException {
            AuctionBid bid = new AuctionBid();
            bid.setId(rs.getString("id"));
            bid.setAuctionId(rs.getString("auction_id"));
            bid.setBidderId(rs.getString("bidder_id"));
            bid.setBidderName(rs.getString("bidder_name"));
            bid.setBidAmount(rs.getBigDecimal("bid_amount"));
            bid.setProposal(rs.getString("proposal"));
            bid.setIsWinning(rs.getBoolean("is_winning"));
            bid.setBidTime(rs.getTimestamp("bid_time").toLocalDateTime());
            bid.setOrganizationId(rs.getString("organization_id"));
            return bid;
        }
    };

    @Override
    public AuctionBid save(AuctionBid bid) {
        log.info("Saving bid for auction: {}, bidder: {}", bid.getAuctionId(), bid.getBidderName());

        if (bid.getId() == null) {
            return insert(bid);
        } else {
            return update(bid) == 1 ? bid : null;
        }
    }

    private AuctionBid insert(AuctionBid bid) {
        String sql = "INSERT INTO auction_bids (" +
                "id, auction_id, bidder_id, bidder_name, bid_amount, " +
                "proposal, is_winning, bid_time, organization_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String bidId = UUID.randomUUID().toString();

        try {
            jdbcTemplate.update(sql,
                    bidId,
                    bid.getAuctionId(),
                    bid.getBidderId(),
                    bid.getBidderName(),
                    bid.getBidAmount(),
                    bid.getProposal(),
                    bid.getIsWinning() != null ? bid.getIsWinning() : false,
                    Timestamp.valueOf(bid.getBidTime() != null ? bid.getBidTime() : LocalDateTime.now()),
                    bid.getOrganizationId()
            );

            bid.setId(bidId);
            log.info("Bid created with ID: {}", bidId);
            return bid;

        } catch (Exception e) {
            log.error("Failed to save bid: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save bid: " + e.getMessage(), e);
        }
    }

    private int update(AuctionBid bid) {
        String sql = "UPDATE auction_bids SET " +
                "bid_amount = ?, proposal = ?, is_winning = ? " +
                "WHERE id = ?";

        log.info("Updating bid: {}", bid.getId());

        try {
            return jdbcTemplate.update(sql,
                    bid.getBidAmount(),
                    bid.getProposal(),
                    bid.getIsWinning(),
                    bid.getId()
            );
        } catch (Exception e) {
            log.error("Failed to update bid: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update bid: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<AuctionBid> findById(String id) {
        String sql = "SELECT * FROM auction_bids WHERE id = ?";
        log.info("Finding bid by ID: {}", id);

        try {
            AuctionBid bid = jdbcTemplate.queryForObject(sql, auctionBidRowMapper, id);
            return Optional.ofNullable(bid);
        } catch (EmptyResultDataAccessException e) {
            log.info("Bid not found with ID: {}", id);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error finding bid by ID: {}", e.getMessage());
            throw new RuntimeException("Error finding bid: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AuctionBid> findByAuctionId(String auctionId, int limit, int offset) {
        String sql = "SELECT * FROM auction_bids WHERE auction_id = ? " +
                "ORDER BY bid_amount DESC, bid_time ASC LIMIT ? OFFSET ?";
        log.info("Finding bids for auction: {}, limit: {}, offset: {}", auctionId, limit, offset);

        try {
            return jdbcTemplate.query(sql, auctionBidRowMapper, auctionId, limit, offset);
        } catch (Exception e) {
            log.error("Error finding bids for auction: {}", e.getMessage());
            throw new RuntimeException("Error finding bids: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AuctionBid> findByAuctionIdOrderByAmountDesc(String auctionId) {
        String sql = "SELECT * FROM auction_bids WHERE auction_id = ? ORDER BY bid_amount DESC";
        log.info("Finding bids for auction {} ordered by amount", auctionId);

        try {
            return jdbcTemplate.query(sql, auctionBidRowMapper, auctionId);
        } catch (Exception e) {
            log.error("Error finding bids ordered by amount: {}", e.getMessage());
            throw new RuntimeException("Error finding bids: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<AuctionBid> findHighestBidForAuction(String auctionId) {
        String sql = "SELECT * FROM auction_bids WHERE auction_id = ? ORDER BY bid_amount DESC LIMIT 1";
        log.info("Finding highest bid for auction: {}", auctionId);

        try {
            AuctionBid bid = jdbcTemplate.queryForObject(sql, auctionBidRowMapper, auctionId);
            return Optional.ofNullable(bid);
        } catch (EmptyResultDataAccessException e) {
            log.info("No bids found for auction: {}", auctionId);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error finding highest bid: {}", e.getMessage());
            throw new RuntimeException("Error finding highest bid: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AuctionBid> findByBidderId(String bidderId, int limit, int offset) {
        String sql = "SELECT * FROM auction_bids WHERE bidder_id = ? " +
                "ORDER BY bid_time DESC LIMIT ? OFFSET ?";
        log.info("Finding bids by bidder: {}, limit: {}, offset: {}", bidderId, limit, offset);

        try {
            return jdbcTemplate.query(sql, auctionBidRowMapper, bidderId, limit, offset);
        } catch (Exception e) {
            log.error("Error finding bids by bidder: {}", e.getMessage());
            throw new RuntimeException("Error finding bids: " + e.getMessage(), e);
        }
    }

    @Override
    public List<AuctionBid> findByOrganizationId(String organizationId, int limit, int offset) {
        String sql = "SELECT * FROM auction_bids WHERE organization_id = ? " +
                "ORDER BY bid_time DESC LIMIT ? OFFSET ?";
        log.info("Finding bids by organization: {}, limit: {}, offset: {}", organizationId, limit, offset);

        try {
            return jdbcTemplate.query(sql, auctionBidRowMapper, organizationId, limit, offset);
        } catch (Exception e) {
            log.error("Error finding bids by organization: {}", e.getMessage());
            throw new RuntimeException("Error finding bids: " + e.getMessage(), e);
        }
    }

    @Override
    public int countByAuctionId(String auctionId) {
        String sql = "SELECT COUNT(*) FROM auction_bids WHERE auction_id = ?";
        log.info("Counting bids for auction: {}", auctionId);

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, auctionId);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Error counting bids: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    public int countUniqueBiddersForAuction(String auctionId) {
        String sql = "SELECT COUNT(DISTINCT bidder_id) FROM auction_bids WHERE auction_id = ?";
        log.info("Counting unique bidders for auction: {}", auctionId);

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, auctionId);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Error counting unique bidders: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    public Double calculateAverageBidForAuction(String auctionId) {
        String sql = "SELECT AVG(bid_amount) FROM auction_bids WHERE auction_id = ?";
        log.info("Calculating average bid for auction: {}", auctionId);

        try {
            Double average = jdbcTemplate.queryForObject(sql, Double.class, auctionId);
            return average != null ? average : 0.0;
        } catch (Exception e) {
            log.error("Error calculating average bid: {}", e.getMessage());
            return 0.0;
        }
    }

    @Override
    public int updateWinningStatus(String bidId, boolean isWinning) {
        String sql = "UPDATE auction_bids SET is_winning = ? WHERE id = ?";
        log.info("Updating winning status for bid: {} to {}", bidId, isWinning);

        try {
            return jdbcTemplate.update(sql, isWinning, bidId);
        } catch (Exception e) {
            log.error("Failed to update winning status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update winning status: " + e.getMessage(), e);
        }
    }
}