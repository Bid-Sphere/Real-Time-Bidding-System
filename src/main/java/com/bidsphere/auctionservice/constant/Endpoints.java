package com.bidsphere.auctionservice.constant;

public class Endpoints {
    private Endpoints() {}

    // Base paths
    public static final String AUCTION_BASE = "/api/auctions";
    public static final String AUCTION_ID = "/{auctionId}";
    public static final String PROJECT_ID = "/{projectId}";

    // Auction endpoints
    public static final String CREATE_AUCTION = "";
    public static final String GET_AUCTION_BY_PROJECT = "/project" + PROJECT_ID;
    public static final String GET_AUCTION_BY_ID = AUCTION_ID;
    public static final String GET_ACTIVE_AUCTIONS = "/active";
    public static final String CLOSE_AUCTION = AUCTION_ID + "/close";
    public static final String CANCEL_AUCTION = AUCTION_ID + "/cancel";

    // Bid endpoints
    public static final String SUBMIT_BID = AUCTION_ID + "/bid";
    public static final String GET_AUCTION_BIDS = AUCTION_ID + "/bids";
    public static final String GET_MY_BIDS = "/my-bids";

    // Statistics endpoint
    public static final String GET_AUCTION_STATS = AUCTION_ID + "/stats";

    // Health endpoints
    public static final String HEALTH = "/health";
    public static final String DB_HEALTH = "/health/db";
    public static final String HEALTH_ENDPOINT = AUCTION_BASE + HEALTH;
    public static final String DB_HEALTH_ENDPOINT = AUCTION_BASE + DB_HEALTH;

    // Other
    public static final String CORS_TEST = "/cors-test";
    public static final String STATUS = "/status";
}