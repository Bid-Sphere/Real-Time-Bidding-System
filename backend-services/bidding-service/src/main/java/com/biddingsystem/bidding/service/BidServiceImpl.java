package com.biddingsystem.bidding.service;

import com.biddingsystem.bidding.dto.ProjectDto;
import com.biddingsystem.bidding.dto.request.RejectBidRequest;
import com.biddingsystem.bidding.dto.request.SubmitBidRequest;
import com.biddingsystem.bidding.dto.request.UpdateBidRequest;
import com.biddingsystem.bidding.dto.response.BidActionResponse;
import com.biddingsystem.bidding.dto.response.BidResponse;
import com.biddingsystem.bidding.dto.response.BidStatsResponse;
import com.biddingsystem.bidding.entity.Bid;
import com.biddingsystem.bidding.enums.BidStatus;
import com.biddingsystem.bidding.enums.BidderType;
import com.biddingsystem.bidding.exception.*;
import com.biddingsystem.bidding.repository.BidRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BidServiceImpl implements BidService {
    
    private final BidRepository bidRepository;
    private final WebClient projectServiceWebClient;
    
    public BidServiceImpl(BidRepository bidRepository, WebClient projectServiceWebClient) {
        this.bidRepository = bidRepository;
        this.projectServiceWebClient = projectServiceWebClient;
    }
    
    @Override
    @Transactional
    public BidResponse submitBid(SubmitBidRequest request, String bidderId, String bidderName) {
        log.info("Submitting bid for project: {} by bidder: {}", request.getProjectId(), bidderId);
        
        // 1. Verify project exists and is open (call project-service)
        ProjectDto project = getProjectFromService(request.getProjectId());
        
        if (project == null) {
            throw new ProjectNotFoundException("Project not found: " + request.getProjectId());
        }
        
        // 2. Check if project is accepting bids
        if (!"OPEN".equals(project.getStatus())) {
            throw new InvalidBidStateException("Project is not accepting bids. Current status: " + project.getStatus());
        }
        
        // 3. Check if bidder is trying to bid on their own project
        if (bidderId.equals(project.getClientId())) {
            throw new UnauthorizedBidActionException("Cannot bid on your own project");
        }
        
        // 4. Check for duplicate bid
        if (bidRepository.existsByProjectIdAndBidderId(request.getProjectId(), bidderId)) {
            throw new DuplicateBidException("You have already submitted a bid for this project");
        }
        
        // 5. Create and save bid
        Bid bid = Bid.builder()
                .id(UUID.randomUUID().toString())
                .projectId(request.getProjectId())
                .bidderId(bidderId)
                .bidderName(bidderName)
                .bidderType(BidderType.ORGANIZATION)
                .proposedPrice(request.getProposedPrice())
                .estimatedDuration(request.getEstimatedDuration())
                .proposal(request.getProposal())
                .status(BidStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isWithdrawn(false)
                .build();
        
        bid = bidRepository.save(bid);
        log.info("Bid submitted successfully: {}", bid.getId());
        
        return mapToResponse(bid, null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BidResponse> getBidsForProject(String projectId, BidStatus status, String sort, 
                                               Pageable pageable, String userId, String userRole) {
        log.info("Getting bids for project: {}, status: {}, sort: {}", projectId, status, sort);
        
        // Determine sorting
        Sort sortOrder = getSortOrder(sort);
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortOrder);
        
        // Fetch bids
        Page<Bid> bids;
        if (status != null) {
            bids = bidRepository.findByProjectIdAndStatus(projectId, status, sortedPageable);
        } else {
            bids = bidRepository.findByProjectId(projectId, sortedPageable);
        }
        
        // Check if user is project owner
        boolean isProjectOwner = false;
        if (userId != null && "CLIENT".equals(userRole)) {
            ProjectDto project = getProjectFromService(projectId);
            isProjectOwner = project != null && userId.equals(project.getClientId());
        }
        
        // Filter bids based on user role
        final boolean showAllBids = isProjectOwner;
        
        // Calculate rankings
        Map<String, Integer> rankings = calculateRankings(projectId);
        
        return bids.map(bid -> {
            // If not project owner, only show ACCEPTED bids
            if (!showAllBids && bid.getStatus() != BidStatus.ACCEPTED) {
                return null;
            }
            return mapToResponse(bid, rankings.get(bid.getId()));
        }).map(response -> response); // Filter out nulls handled by Page
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<BidResponse> getMyBids(String bidderId, BidStatus status, Pageable pageable) {
        log.info("Getting my bids for bidder: {}, status: {}", bidderId, status);
        
        Page<Bid> bids;
        if (status != null) {
            bids = bidRepository.findByBidderIdAndStatus(bidderId, status, pageable);
        } else {
            bids = bidRepository.findByBidderId(bidderId, pageable);
        }
        
        // Calculate rankings and total bids per project
        return bids.map(bid -> {
            Map<String, Integer> rankings = calculateRankings(bid.getProjectId());
            long totalBids = bidRepository.countByProjectId(bid.getProjectId());
            
            BidResponse response = mapToResponse(bid, rankings.get(bid.getId()));
            response.setTotalBids((int) totalBids);
            
            // Fetch project title
            try {
                ProjectDto project = getProjectFromService(bid.getProjectId());
                if (project != null) {
                    response.setProjectTitle(project.getTitle());
                }
            } catch (Exception e) {
                log.warn("Could not fetch project title for: {}", bid.getProjectId());
            }
            
            return response;
        });
    }
    
    @Override
    @Transactional(readOnly = true)
    public BidResponse getBidById(String bidId, String userId, String userRole) {
        log.info("Getting bid: {} for user: {}", bidId, userId);
        
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new BidNotFoundException("Bid not found: " + bidId));
        
        // Authorization check
        boolean isOwner = userId.equals(bid.getBidderId());
        boolean isProjectOwner = false;
        
        if ("CLIENT".equals(userRole)) {
            ProjectDto project = getProjectFromService(bid.getProjectId());
            isProjectOwner = project != null && userId.equals(project.getClientId());
        }
        
        if (!isOwner && !isProjectOwner) {
            throw new UnauthorizedBidActionException("You are not authorized to view this bid");
        }
        
        // Calculate ranking
        Map<String, Integer> rankings = calculateRankings(bid.getProjectId());
        
        BidResponse response = mapToResponse(bid, rankings.get(bid.getId()));
        
        // Add project title
        try {
            ProjectDto project = getProjectFromService(bid.getProjectId());
            if (project != null) {
                response.setProjectTitle(project.getTitle());
            }
        } catch (Exception e) {
            log.warn("Could not fetch project title");
        }
        
        return response;
    }
    
    @Override
    @Transactional
    public BidResponse updateBid(String bidId, UpdateBidRequest request, String bidderId) {
        log.info("Updating bid: {} by bidder: {}", bidId, bidderId);
        
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new BidNotFoundException("Bid not found: " + bidId));
        
        // Authorization check
        if (!bid.getBidderId().equals(bidderId)) {
            throw new UnauthorizedBidActionException("You can only update your own bids");
        }
        
        // Status check
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new InvalidBidStateException("Can only update bids with PENDING status");
        }
        
        // Update bid
        bid.setProposedPrice(request.getProposedPrice());
        bid.setEstimatedDuration(request.getEstimatedDuration());
        bid.setProposal(request.getProposal());
        bid.setUpdatedAt(LocalDateTime.now());
        
        bid = bidRepository.save(bid);
        log.info("Bid updated successfully: {}", bidId);
        
        return mapToResponse(bid, null);
    }
    
    @Override
    @Transactional
    public void withdrawBid(String bidId, String bidderId) {
        log.info("Withdrawing bid: {} by bidder: {}", bidId, bidderId);
        
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new BidNotFoundException("Bid not found: " + bidId));
        
        // Authorization check
        if (!bid.getBidderId().equals(bidderId)) {
            throw new UnauthorizedBidActionException("You can only withdraw your own bids");
        }
        
        // Status check
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new InvalidBidStateException("Can only withdraw bids with PENDING status");
        }
        
        // Withdraw bid
        bid.setStatus(BidStatus.WITHDRAWN);
        bid.setIsWithdrawn(true);
        bid.setWithdrawnAt(LocalDateTime.now());
        bid.setUpdatedAt(LocalDateTime.now());
        
        bidRepository.save(bid);
        log.info("Bid withdrawn successfully: {}", bidId);
    }
    
    @Override
    @Transactional
    public BidActionResponse acceptBid(String bidId, String clientId) {
        log.info("Accepting bid: {} by client: {}", bidId, clientId);
        
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new BidNotFoundException("Bid not found: " + bidId));
        
        // Verify client owns the project
        ProjectDto project = getProjectFromService(bid.getProjectId());
        if (project == null || !project.getClientId().equals(clientId)) {
            throw new UnauthorizedBidActionException("You are not authorized to accept this bid");
        }
        
        // Status check
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new InvalidBidStateException("Can only accept bids with PENDING status");
        }
        
        // Accept bid
        bid.setStatus(BidStatus.ACCEPTED);
        bid.setAcceptedAt(LocalDateTime.now());
        bid.setUpdatedAt(LocalDateTime.now());
        
        bid = bidRepository.save(bid);
        log.info("Bid accepted successfully: {}", bidId);
        
        // Note: Frontend will handle updating project status
        
        return BidActionResponse.builder()
                .id(bid.getId())
                .status(bid.getStatus())
                .acceptedAt(bid.getAcceptedAt())
                .build();
    }
    
    @Override
    @Transactional
    public void rejectBid(String bidId, RejectBidRequest request, String clientId) {
        log.info("Rejecting bid: {} by client: {}", bidId, clientId);
        
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new BidNotFoundException("Bid not found: " + bidId));
        
        // Verify client owns the project
        ProjectDto project = getProjectFromService(bid.getProjectId());
        if (project == null || !project.getClientId().equals(clientId)) {
            throw new UnauthorizedBidActionException("You are not authorized to reject this bid");
        }
        
        // Status check
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new InvalidBidStateException("Can only reject bids with PENDING status");
        }
        
        // Reject bid
        bid.setStatus(BidStatus.REJECTED);
        bid.setRejectedAt(LocalDateTime.now());
        bid.setRejectionReason(request.getReason());
        bid.setUpdatedAt(LocalDateTime.now());
        
        bidRepository.save(bid);
        log.info("Bid rejected successfully: {}", bidId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public BidStatsResponse getBidStats(String projectId) {
        log.info("Getting bid statistics for project: {}", projectId);
        
        Long totalBids = bidRepository.countTotalBidsByProject(projectId);
        Long pendingBids = bidRepository.countPendingBidsByProject(projectId);
        Long acceptedBids = bidRepository.countAcceptedBidsByProject(projectId);
        Long rejectedBids = bidRepository.countRejectedBidsByProject(projectId);
        
        BigDecimal averageBidAmount = bidRepository.getAverageBidAmount(projectId);
        BigDecimal lowestBid = bidRepository.getLowestBid(projectId);
        BigDecimal highestBid = bidRepository.getHighestBid(projectId);
        
        return BidStatsResponse.builder()
                .totalBids(totalBids != null ? totalBids : 0L)
                .pendingBids(pendingBids != null ? pendingBids : 0L)
                .acceptedBids(acceptedBids != null ? acceptedBids : 0L)
                .rejectedBids(rejectedBids != null ? rejectedBids : 0L)
                .averageBidAmount(averageBidAmount != null ? averageBidAmount : BigDecimal.ZERO)
                .lowestBid(lowestBid != null ? lowestBid : BigDecimal.ZERO)
                .highestBid(highestBid != null ? highestBid : BigDecimal.ZERO)
                .build();
    }
    
    // Helper methods
    
    private ProjectDto getProjectFromService(String projectId) {
        try {
            log.debug("Fetching project from project-service: {}", projectId);
            
            Map<String, Object> response = projectServiceWebClient.get()
                    .uri("/api/projects/" + projectId)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            
            if (response != null && response.get("data") != null) {
                Map<String, Object> projectData = (Map<String, Object>) response.get("data");
                
                return ProjectDto.builder()
                        .id((String) projectData.get("id"))
                        .title((String) projectData.get("title"))
                        .description((String) projectData.get("description"))
                        .clientId((String) projectData.get("clientId"))
                        .clientName((String) projectData.get("clientName"))
                        .status((String) projectData.get("status"))
                        .build();
            }
            
            return null;
        } catch (Exception e) {
            log.error("Error fetching project from project-service: {}", e.getMessage());
            throw new ProjectNotFoundException("Could not fetch project details: " + projectId);
        }
    }
    
    private Map<String, Integer> calculateRankings(String projectId) {
        List<Bid> bids = bidRepository.findByProjectIdOrderByProposedPriceAsc(projectId);
        
        return bids.stream()
                .collect(Collectors.toMap(
                        Bid::getId,
                        bid -> bids.indexOf(bid) + 1
                ));
    }
    
    private Sort getSortOrder(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Direction.DESC, "submittedAt");
        }
        
        return switch (sort.toLowerCase()) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "proposedPrice");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "proposedPrice");
            case "date_asc" -> Sort.by(Sort.Direction.ASC, "submittedAt");
            case "date_desc" -> Sort.by(Sort.Direction.DESC, "submittedAt");
            default -> Sort.by(Sort.Direction.DESC, "submittedAt");
        };
    }
    
    private BidResponse mapToResponse(Bid bid, Integer ranking) {
        return BidResponse.builder()
                .id(bid.getId())
                .projectId(bid.getProjectId())
                .bidderId(bid.getBidderId())
                .bidderName(bid.getBidderName())
                .bidderType(bid.getBidderType())
                .proposedPrice(bid.getProposedPrice())
                .estimatedDuration(bid.getEstimatedDuration())
                .proposal(bid.getProposal())
                .status(bid.getStatus())
                .submittedAt(bid.getSubmittedAt())
                .updatedAt(bid.getUpdatedAt())
                .acceptedAt(bid.getAcceptedAt())
                .rejectedAt(bid.getRejectedAt())
                .rejectionReason(bid.getRejectionReason())
                .ranking(ranking)
                .build();
    }
}
