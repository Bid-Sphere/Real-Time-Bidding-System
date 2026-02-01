package com.bidsphere.auctionservice.constant;

public class AppConstants {
    private AppConstants() {}

    // Response Messages
    public static final String SUCCESS_MESSAGE = "Success";
    public static final String AUCTION_CREATED = "Auction created successfully";
    public static final String BID_SUBMITTED = "Bid submitted successfully";
    public static final String AUCTION_CLOSED = "Auction closed successfully";
    public static final String AUCTION_CANCELLED = "Auction cancelled successfully";
    public static final String AUCTION_LIVE = "Auction is now live";
    public static final String AUCTION_ENDED = "Auction ended successfully";
    public static final String BID_ACCEPTED = "Bid accepted successfully";
    public static final String BID_REJECTED = "Bid rejected successfully";

    // Error Messages
    public static final String AUCTION_NOT_FOUND = "Auction not found";
    public static final String PROJECT_NOT_FOUND = "Project not found";
    public static final String BID_NOT_FOUND = "Bid not found";
    public static final String AUCTION_NOT_ACTIVE = "Auction is not active";
    public static final String AUCTION_ALREADY_ENDED = "Auction has already ended";
    public static final String AUCTION_NOT_STARTED = "Auction has not started yet";
    public static final String BID_TOO_LOW = "Bid amount must be higher than current highest bid plus minimum increment";
    public static final String INSUFFICIENT_PERMISSION = "Insufficient permission to perform this action";
    public static final String BIDDER_IS_HIGHEST = "You are already the highest bidder";

    // Validation Messages
    public static final String PROJECT_ID_REQUIRED = "Project ID is required";
    public static final String START_TIME_REQUIRED = "Start time is required";
    public static final String END_TIME_REQUIRED = "End time is required";
    public static final String MIN_BID_INCREMENT_REQUIRED = "Minimum bid increment is required";
    public static final String BID_AMOUNT_REQUIRED = "Bid amount is required";
    public static final String PROPOSAL_REQUIRED = "Proposal is required";

    // Numeric Constants
    public static final String DEFAULT_MIN_BID_INCREMENT = "100.00";
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final int MIN_PROPOSAL_LENGTH = 50;
    public static final double MIN_BID_AMOUNT = 0.01;
}