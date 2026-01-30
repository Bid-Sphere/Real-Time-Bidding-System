package com.bidsphere.auctionservice.repository.impl;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import com.bidsphere.auctionservice.model.Auction;
import com.bidsphere.auctionservice.repository.interfaces.AuctionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AuctionRepositoryImpl implements AuctionRepository
{

    private static final Logger log = LoggerFactory.getLogger(AuctionRepositoryImpl.class);

    private final JdbcTemplate jdbcTemplate;

    public AuctionRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Auction> auctionRowMapper = new RowMapper<Auction>() {
        @Override
        public Auction mapRow(ResultSet rs, int rowNum) throws SQLException {
            Auction auction = new Auction();
            auction.setId(rs.getString("id"));
            auction.setProjectId(rs.getString("project_id"));
            auction.setProjectTitle(rs.getString("project_title"));
            auction.setProjectOwnerId(rs.getString("project_owner_id"));
            auction.setProjectCategory(rs.getString("project_category"));
            auction.setStartTime(rs.getTimestamp("start_time").toLocalDateTime());
            auction.setEndTime(rs.getTimestamp("end_time").toLocalDateTime());
            auction.setStatus(AuctionStatus.valueOf(rs.getString("status")));

            if (rs.getObject("current_highest_bid") != null) {
                auction.setCurrentHighestBid(rs.getBigDecimal("current_highest_bid"));
            }

            auction.setCurrentHighestBidderId(rs.getString("current_highest_bidder_id"));
            auction.setCurrentHighestBidderName(rs.getString("current_highest_bidder_name"));
            auction.setMinimumBidIncrement(rs.getBigDecimal("minimum_bid_increment"));

            if (rs.getObject("reserve_price") != null) {
                auction.setReservePrice(rs.getBigDecimal("reserve_price"));
            }

            auction.setTotalBids(rs.getInt("total_bids"));
            auction.setWinnerBidId(rs.getString("winner_bid_id"));
            auction.setWinnerBidderId(rs.getString("winner_bidder_id"));
            auction.setWinnerBidderName(rs.getString("winner_bidder_name"));

            if (rs.getObject("winning_bid_amount") != null) {
                auction.setWinningBidAmount(rs.getBigDecimal("winning_bid_amount"));
            }

            if (rs.getTimestamp("closed_at") != null) {
                auction.setClosedAt(rs.getTimestamp("closed_at").toLocalDateTime());
            }

            if (rs.getTimestamp("cancelled_at") != null) {
                auction.setCancelledAt(rs.getTimestamp("cancelled_at").toLocalDateTime());
            }

            auction.setCancellationReason(rs.getString("cancellation_reason"));
            auction.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            auction.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());

            return auction;
        }
    };

    @Override
    public Auction save(Auction auction) {
        log.info("Saving auction for project: {}", auction.getProjectId());

        if (auction.getId() == null) {
            return insert(auction);
        } else {
            return update(auction) == 1 ? auction : null;
        }
    }

    private Auction insert(Auction auction) {
        String sql = "INSERT INTO auctions (" +
                "id, project_id, project_title, project_owner_id, project_category, " +
                "start_time, end_time, status, current_highest_bid, current_highest_bidder_id, " +
                "current_highest_bidder_name, minimum_bid_increment, reserve_price, total_bids, " +
                "winner_bid_id, winner_bidder_id, winner_bidder_name, winning_bid_amount, " +
                "closed_at, cancelled_at, cancellation_reason, created_at, updated_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String auctionId = UUID.randomUUID().toString();

        try {
            jdbcTemplate.update(sql,
                    auctionId,
                    auction.getProjectId(),
                    auction.getProjectTitle(),
                    auction.getProjectOwnerId(),
                    auction.getProjectCategory(),
                    Timestamp.valueOf(auction.getStartTime()),
                    Timestamp.valueOf(auction.getEndTime()),
                    auction.getStatus().name(),
                    auction.getCurrentHighestBid(),
                    auction.getCurrentHighestBidderId(),
                    auction.getCurrentHighestBidderName(),
                    auction.getMinimumBidIncrement(),
                    auction.getReservePrice(),
                    auction.getTotalBids(),
                    auction.getWinnerBidId(),
                    auction.getWinnerBidderId(),
                    auction.getWinnerBidderName(),
                    auction.getWinningBidAmount(),
                    auction.getClosedAt() != null ? Timestamp.valueOf(auction.getClosedAt()) : null,
                    auction.getCancelledAt() != null ? Timestamp.valueOf(auction.getCancelledAt()) : null,
                    auction.getCancellationReason(),
                    Timestamp.valueOf(LocalDateTime.now()),
                    Timestamp.valueOf(LocalDateTime.now())
            );

            auction.setId(auctionId);
            log.info("Auction created with ID: {}", auctionId);
            return auction;

        } catch (Exception e) {
            log.error("Failed to save auction: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save auction: " + e.getMessage(), e);
        }
    }

    @Override
    public int update(Auction auction) {
        String sql = "UPDATE auctions SET " +
                "project_title = ?, project_category = ?, " +
                "start_time = ?, end_time = ?, status = ?, current_highest_bid = ?, " +
                "current_highest_bidder_id = ?, current_highest_bidder_name = ?, " +
                "minimum_bid_increment = ?, reserve_price = ?, total_bids = ?, " +
                "winner_bid_id = ?, winner_bidder_id = ?, winner_bidder_name = ?, " +
                "winning_bid_amount = ?, closed_at = ?, cancelled_at = ?, " +
                "cancellation_reason = ?, updated_at = ? " +
                "WHERE id = ?";

        log.info("Updating auction: {}", auction.getId());

        try {
            return jdbcTemplate.update(sql,
                    auction.getProjectTitle(),
                    auction.getProjectCategory(),
                    Timestamp.valueOf(auction.getStartTime()),
                    Timestamp.valueOf(auction.getEndTime()),
                    auction.getStatus().name(),
                    auction.getCurrentHighestBid(),
                    auction.getCurrentHighestBidderId(),
                    auction.getCurrentHighestBidderName(),
                    auction.getMinimumBidIncrement(),
                    auction.getReservePrice(),
                    auction.getTotalBids(),
                    auction.getWinnerBidId(),
                    auction.getWinnerBidderId(),
                    auction.getWinnerBidderName(),
                    auction.getWinningBidAmount(),
                    auction.getClosedAt() != null ? Timestamp.valueOf(auction.getClosedAt()) : null,
                    auction.getCancelledAt() != null ? Timestamp.valueOf(auction.getCancelledAt()) : null,
                    auction.getCancellationReason(),
                    Timestamp.valueOf(LocalDateTime.now()),
                    auction.getId()
            );
        } catch (Exception e) {
            log.error("Failed to update auction: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update auction: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Auction> findById(String id) {
        String sql = "SELECT * FROM auctions WHERE id = ?";
        log.info("Finding auction by ID: {}", id);

        try {
            Auction auction = jdbcTemplate.queryForObject(sql, auctionRowMapper, id);
            return Optional.ofNullable(auction);
        } catch (EmptyResultDataAccessException e) {
            log.info("Auction not found with ID: {}", id);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error finding auction by ID: {}", e.getMessage());
            throw new RuntimeException("Error finding auction: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<Auction> findByProjectId(String projectId) {
        String sql = "SELECT * FROM auctions WHERE project_id = ?";
        log.info("Finding auction by project ID: {}", projectId);

        try {
            Auction auction = jdbcTemplate.queryForObject(sql, auctionRowMapper, projectId);
            return Optional.ofNullable(auction);
        } catch (EmptyResultDataAccessException e) {
            log.info("Auction not found for project ID: {}", projectId);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error finding auction by project ID: {}", e.getMessage());
            throw new RuntimeException("Error finding auction: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Auction> findByStatus(String status, int limit, int offset) {
        String sql = "SELECT * FROM auctions WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        log.info("Finding auctions by status: {}, limit: {}, offset: {}", status, limit, offset);

        try {
            return jdbcTemplate.query(sql, auctionRowMapper, status, limit, offset);
        } catch (Exception e) {
            log.error("Error finding auctions by status: {}", e.getMessage());
            throw new RuntimeException("Error finding auctions: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Auction> findActiveAuctions(int limit, int offset) {
        String sql = "SELECT * FROM auctions WHERE status = 'ACTIVE' ORDER BY end_time ASC LIMIT ? OFFSET ?";
        log.info("Finding active auctions, limit: {}, offset: {}", limit, offset);

        try {
            return jdbcTemplate.query(sql, auctionRowMapper, limit, offset);
        } catch (Exception e) {
            log.error("Error finding active auctions: {}", e.getMessage());
            throw new RuntimeException("Error finding active auctions: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Auction> findAuctionsToStart() {
        String sql = "SELECT * FROM auctions WHERE status = 'SCHEDULED' AND start_time <= CURRENT_TIMESTAMP";
        log.info("Finding auctions to start");

        try {
            return jdbcTemplate.query(sql, auctionRowMapper);
        } catch (Exception e) {
            log.error("Error finding auctions to start: {}", e.getMessage());
            throw new RuntimeException("Error finding auctions to start: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Auction> findAuctionsToClose() {
        String sql = "SELECT * FROM auctions WHERE status = 'ACTIVE' AND end_time <= CURRENT_TIMESTAMP";
        log.info("Finding auctions to close");

        try {
            return jdbcTemplate.query(sql, auctionRowMapper);
        } catch (Exception e) {
            log.error("Error finding auctions to close: {}", e.getMessage());
            throw new RuntimeException("Error finding auctions to close: " + e.getMessage(), e);
        }
    }

    @Override
    public int updateStatus(String auctionId, String status) {
        String sql = "UPDATE auctions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        log.info("Updating auction {} status to {}", auctionId, status);

        try {
            return jdbcTemplate.update(sql, status, auctionId);
        } catch (Exception e) {
            log.error("Failed to update auction status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update auction status: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean existsByProjectId(String projectId) {
        String sql = "SELECT COUNT(*) FROM auctions WHERE project_id = ?";
        log.info("Checking if auction exists for project: {}", projectId);

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, projectId);
            return count != null && count > 0;
        } catch (Exception e) {
            log.error("Error checking auction existence: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public int countActiveAuctions() {
        String sql = "SELECT COUNT(*) FROM auctions WHERE status = 'ACTIVE'";
        log.info("Counting active auctions");

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Error counting active auctions: {}", e.getMessage());
            return 0;
        }
    }

    @Override
    public List<Auction> findByClientUserId(String clientUserId, int limit, int offset) {
        String sql = "SELECT * FROM auctions WHERE project_owner_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?";
        log.info("Finding auctions for client: {}, limit: {}, offset: {}", clientUserId, limit, offset);

        try {
            return jdbcTemplate.query(sql, auctionRowMapper, clientUserId, limit, offset);
        } catch (Exception e) {
            log.error("Error finding auctions for client: {}", e.getMessage());
            throw new RuntimeException("Error finding auctions: " + e.getMessage(), e);
        }
    }

    @Override
    public int countByClientUserId(String clientUserId) {
        String sql = "SELECT COUNT(*) FROM auctions WHERE project_owner_id = ?";
        log.info("Counting auctions for client: {}", clientUserId);

        try {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, clientUserId);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Error counting auctions for client: {}", e.getMessage());
            return 0;
        }
    }
}