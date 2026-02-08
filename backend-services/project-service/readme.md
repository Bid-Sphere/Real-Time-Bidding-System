### Database Schema

```mermaid
erDiagram
    USERS {
        UUID user_id PK
        string username
        string email
        string password_hash
        string role "BUYER/SELLER/ADMIN"
        decimal wallet_balance
        timestamp created_at
    }

    AUCTIONS {
        UUID auction_id PK
        UUID seller_id FK
        string title
        text description
        decimal starting_price
        decimal current_price
        timestamp start_time
        timestamp end_time
        enum status "DRAFT/ACTIVE/CLOSED"
    }

    BIDS {
        UUID bid_id PK
        UUID auction_id FK
        UUID bidder_id FK
        decimal amount
        timestamp placed_at
    }

    NOTIFICATIONS {
        UUID notification_id PK
        UUID user_id FK
        string message
        boolean is_read
        timestamp created_at
    }

    TRANSACTIONS {
        UUID transaction_id PK
        UUID auction_id FK
        UUID buyer_id FK
        UUID seller_id FK
        decimal final_amount
        timestamp created_at
    }

    USERS ||--o{ AUCTIONS : "creates"
    USERS ||--o{ BIDS : "places"
    USERS ||--o{ NOTIFICATIONS : "receives"
    AUCTIONS ||--|{ BIDS : "receives"
    AUCTIONS ||--o| TRANSACTIONS : "finalizes"
