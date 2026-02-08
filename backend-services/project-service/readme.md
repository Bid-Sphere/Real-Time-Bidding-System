erDiagram
    %% ============================================
    %% Entities
    %% ============================================
    USERS {
        UUID user_id PK
        string username
        string email "Unique"
        string password_hash
        string role "enum: buyer, seller, admin"
        decimal wallet_balance "Optional: for internal currency"
        timestamp created_at
    }

    AUCTIONS {
        UUID auction_id PK
        UUID seller_id FK "References USERS.user_id"
        string title
        text description
        string image_url
        decimal starting_price
        decimal current_price "Updated in real-time by bids"
        timestamp start_time
        timestamp end_time
        enum status "DRAFT, ACTIVE, COMPLETED, EXPIRED"
    }

    BIDS {
        UUID bid_id PK
        UUID auction_id FK "References AUCTIONS.auction_id"
        UUID bidder_id FK "References USERS.user_id"
        decimal amount
        timestamp placed_at "Crucial for determining winning bid ordering"
    }

    TRANSACTIONS {
        UUID transaction_id PK
        UUID auction_id FK "Unique. References AUCTIONS.auction_id"
        UUID buyer_id FK "The winning bidder. References USERS.user_id"
        UUID seller_id FK "References USERS.user_id"
        decimal final_amount
        timestamp created_at
        enum status "PENDING, COMPLETED, FAILED"
    }

    %% ============================================
    %% Relationships
    %% ============================================

    %% A User acts as a Seller and creates zero or many Auctions.
    USERS ||--o{ AUCTIONS : "creates"

    %% A User acts as a Bidder and places zero or many Bids.
    USERS ||--o{ BIDS : "places"

    %% An Auction receives one or many bids (assuming active auctions get bids).
    AUCTIONS ||--|{ BIDS : "receives"

    %% An Auction, when successfully completed, results in exactly zero or one final Transaction record.
    AUCTIONS ||--o| TRANSACTIONS : "finalizes into"

    %% A Transaction belongs to a winning buyer and the original seller.
    USERS ||--o{ TRANSACTIONS : "participates in"
