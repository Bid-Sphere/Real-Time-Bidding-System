## Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        UUID user_id PK
        STRING name
        STRING email
        STRING password_hash
        STRING role
        TIMESTAMP created_at
    }

    PROJECT {
        UUID project_id PK
        UUID owner_id FK
        STRING title
        TEXT description
        DECIMAL budget
        STRING status
        TIMESTAMP created_at
    }

    AUCTION {
        UUID auction_id PK
        UUID project_id FK
        TIMESTAMP start_time
        TIMESTAMP end_time
        STRING status
    }

    BID {
        UUID bid_id PK
        UUID user_id FK
        UUID project_id FK
        UUID auction_id FK
        DECIMAL amount
        TIMESTAMP created_at
    }

    NOTIFICATION {
        UUID notification_id PK
        UUID user_id FK
        STRING type
        TEXT message
        BOOLEAN is_read
        TIMESTAMP created_at
    }

    USER ||--o{ PROJECT : creates
    USER ||--o{ BID : places
    USER ||--o{ NOTIFICATION : receives

    PROJECT ||--|| AUCTION : has
    PROJECT ||--o{ BID : receives

    AUCTION ||--o{ BID : accepts
