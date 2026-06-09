# Database Schema Documentation

## GIGS-Rental Platform

**Version:** 1.0  
**Date:** March 24, 2026  
**Status:** Current (localStorage) + Future (PostgreSQL)

---

## Table of Contents

1. [Current Data Storage](#1-current-data-storage)
2. [Future Database Schema](#2-future-database-schema)
3. [Entity Relationship Diagrams](#3-entity-relationship-diagrams)
4. [Table Specifications](#4-table-specifications)
5. [Indexes and Constraints](#5-indexes-and-constraints)
6. [Data Migration Strategy](#6-data-migration-strategy)

---

## 1. Current Data Storage

### 1.1 localStorage Schema

Currently, the application uses browser localStorage for all data persistence.

```mermaid
erDiagram
    BROWSER["Browser Storage"] {
        string gigs_user "User profile"
        string gigs_conversations "Chat conversations"
        string gigs_messages "Message history"
        string gigs_liked_properties "Saved listing IDs"
        string gigs_host_listings "Host's listings"
        string gigs_pending_signup "Temporary signup data"
        string gigs_bill_groups "Bill splitting groups"
    }
```

### 1.2 Storage Keys and Structures

#### User Data (`gigs_user`)
```typescript
{
  "id": "user_1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "both",
  "avatar": "https://...",
  "isProfileComplete": true
}
```

#### Conversations (`gigs_conversations`)
```typescript
[
  {
    "id": "conv_123",
    "listingId": "listing_456",
    "listingTitle": "Cozy Apartment",
    "listingImage": "https://...",
    "participants": ["user_123", "user_789"],
    "participantNames": {
      "user_123": "John",
      "user_789": "Jane"
    },
    "lastMessage": "Is this still available?",
    "lastMessageTime": 1234567890,
    "unreadCount": 2
  }
]
```

#### Messages (`gigs_messages`)
```typescript
{
  "conv_123": [
    {
      "id": "msg_123",
      "conversationId": "conv_123",
      "senderId": "user_123",
      "content": "Hi, I'm interested!",
      "timestamp": 1234567890,
      "read": true
    }
  ]
}
```

#### Liked Properties (`gigs_liked_properties`)
```typescript
["listing_123", "listing_456", "listing_789"]
```

#### Host Listings (`gigs_host_listings`)
```typescript
[
  {
    "id": "listing_123",
    "title": "Modern Apartment",
    "category": "accommodation",
    "type": "apartment",
    "status": "published",
    "hostId": "user_123",
    ...
  }
]
```

---

## 2. Future Database Schema

### 2.1 Overview

When migrating to PostgreSQL, the following schema will be implemented.

### 2.2 Database Selection

| Database | Purpose | Justification |
|----------|---------|---------------|
| PostgreSQL | Primary database | ACID compliance, JSON support, Full-text search |
| Redis | Session & Cache | Fast reads, TTL support, Pub/Sub |

---

## 3. Entity Relationship Diagrams

### 3.1 Core Entities

```mermaid
erDiagram
    USERS ||--o{ LISTINGS : "creates"
    USERS ||--o{ CONVERSATIONS : "participates"
    USERS ||--o{ MESSAGES : "sends"
    USERS ||--o{ BOOKINGS : "makes"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ BILL_GROUPS : "manages"
    
    LISTINGS ||--o{ CONVERSATIONS : "generates"
    LISTINGS ||--o{ BOOKINGS : "receives"
    LISTINGS ||--o{ REVIEWS : "receives"
    LISTINGS ||--o{ LISTING_IMAGES : "has"
    LISTINGS ||--o{ LISTING_AMENITIES : "has"
    
    CONVERSATIONS ||--o{ MESSAGES : "contains"
    
    BILL_GROUPS ||--o{ BILL_MEMBERS : "includes"
    BILL_GROUPS ||--o{ EXPENSES : "tracks"
    
    CATEGORIES ||--o{ LISTINGS : "categorizes"
    LOCATIONS ||--o{ LISTINGS : "locates"
```

### 3.2 User Management

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        string phone
        enum role "lister, renter, both, admin"
        string avatar_url
        boolean is_profile_complete
        boolean is_email_verified
        timestamp email_verified_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    USER_PREFERENCES {
        uuid id PK
        uuid user_id FK
        boolean email_notifications
        boolean sms_notifications
        boolean push_notifications
        string preferred_language
        jsonb notification_settings
        timestamp created_at
        timestamp updated_at
    }
    
    USER_VERIFICATIONS {
        uuid id PK
        uuid user_id FK
        enum type "email, phone, identity"
        string token
        timestamp expires_at
        timestamp verified_at
        timestamp created_at
    }
    
    USERS ||--o{ USER_PREFERENCES : "has"
    USERS ||--o{ USER_VERIFICATIONS : "has"
```

### 3.3 Listing Management

```mermaid
erDiagram
    CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
        string description
        string icon
        integer display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    PROPERTY_TYPES {
        uuid id PK
        uuid category_id FK
        string name
        string slug
        string description
        string icon
        jsonb required_fields
        boolean is_active
    }
    
    LOCATIONS {
        uuid id PK
        string address
        string city
        string state
        string country
        string postal_code
        decimal latitude
        decimal longitude
        jsonb geojson
        timestamp created_at
    }
    
    LISTINGS {
        uuid id PK
        uuid host_id FK
        uuid category_id FK
        uuid property_type_id FK
        uuid location_id FK
        string title
        text description
        enum status "draft, pending, published, rejected, archived"
        jsonb price
        integer max_guests
        integer bedrooms
        integer bathrooms
        text house_rules
        timestamp check_in_time
        timestamp check_out_time
        integer min_stay
        integer max_stay
        timestamp created_at
        timestamp updated_at
        timestamp published_at
    }
    
    LISTING_IMAGES {
        uuid id PK
        uuid listing_id FK
        string url
        string caption
        integer display_order
        boolean is_primary
        timestamp created_at
    }
    
    AMENITIES {
        uuid id PK
        string name UK
        string icon
        string category
        boolean is_active
    }
    
    LISTING_AMENITIES {
        uuid listing_id PK,FK
        uuid amenity_id PK,FK
        timestamp created_at
    }
    
    CATEGORIES ||--o{ PROPERTY_TYPES : "has"
    CATEGORIES ||--o{ LISTINGS : "categorizes"
    PROPERTY_TYPES ||--o{ LISTINGS : "classifies"
    LOCATIONS ||--o{ LISTINGS : "locates"
    LISTINGS ||--o{ LISTING_IMAGES : "has"
    LISTINGS ||--o{ LISTING_AMENITIES : "has"
    AMENITIES ||--o{ LISTING_AMENITIES : "referenced_by"
```

### 3.4 Messaging System

```mermaid
erDiagram
    CONVERSATIONS {
        uuid id PK
        uuid listing_id FK
        uuid initiator_id FK
        uuid recipient_id FK
        text last_message
        uuid last_message_id FK
        timestamp last_message_at
        timestamp created_at
        timestamp updated_at
    }
    
    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text content
        boolean is_read
        timestamp read_at
        jsonb attachments
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    CONVERSATION_PARTICIPANTS {
        uuid conversation_id PK,FK
        uuid user_id PK,FK
        integer unread_count
        boolean is_muted
        timestamp joined_at
        timestamp last_read_at
    }
    
    CONVERSATIONS ||--o{ MESSAGES : "contains"
    CONVERSATIONS ||--o{ CONVERSATION_PARTICIPANTS : "has"
```

### 3.5 Booking System

```mermaid
erDiagram
    BOOKINGS {
        uuid id PK
        uuid listing_id FK
        uuid renter_id FK
        date check_in
        date check_out
        integer guests
        decimal total_amount
        decimal platform_fee
        decimal host_payout
        enum status "pending, confirmed, cancelled, completed"
        text special_requests
        timestamp confirmed_at
        timestamp cancelled_at
        string cancellation_reason
        timestamp created_at
        timestamp updated_at
    }
    
    PAYMENTS {
        uuid id PK
        uuid booking_id FK
        enum type "deposit, full, installment"
        decimal amount
        enum status "pending, completed, failed, refunded"
        string transaction_id
        string payment_method
        timestamp paid_at
        timestamp created_at
    }
    
    AVAILABILITY {
        uuid id PK
        uuid listing_id FK
        date date
        boolean is_available
        decimal price_override
        integer minimum_stay
        timestamp created_at
        timestamp updated_at
    }
    
    BLOCKED_DATES {
        uuid id PK
        uuid listing_id FK
        date start_date
        date end_date
        string reason
        timestamp created_at
    }
    
    BOOKINGS ||--o{ PAYMENTS : "has"
    LISTINGS ||--o{ AVAILABILITY : "has"
    LISTINGS ||--o{ BLOCKED_DATES : "has"
```

### 3.6 Review System

```mermaid
erDiagram
    REVIEWS {
        uuid id PK
        uuid listing_id FK
        uuid booking_id FK
        uuid reviewer_id FK
        uuid host_id FK
        integer overall_rating
        integer cleanliness_rating
        integer location_rating
        integer communication_rating
        integer value_rating
        text comment
        enum status "pending, published, rejected"
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    HOST_REVIEWS {
        uuid id PK
        uuid booking_id FK
        uuid host_id FK
        uuid renter_id FK
        integer communication_rating
        integer cleanliness_rating
        integer rule_following_rating
        text comment
        timestamp created_at
    }
    
    REVIEW_HELPFULNESS {
        uuid review_id PK,FK
        uuid user_id PK,FK
        boolean is_helpful
        timestamp created_at
    }
```

### 3.7 Bill Splitting System

```mermaid
erDiagram
    BILL_GROUPS {
        uuid id PK
        string name
        uuid listing_id FK
        uuid created_by FK
        decimal total_expenses
        timestamp created_at
        timestamp updated_at
    }
    
    BILL_MEMBERS {
        uuid id PK
        uuid bill_group_id FK
        uuid user_id FK
        string display_name
        decimal balance
        timestamp joined_at
    }
    
    EXPENSES {
        uuid id PK
        uuid bill_group_id FK
        uuid paid_by FK
        string description
        decimal amount
        enum split_type "equal, percentage, custom"
        string category
        date expense_date
        string receipt_url
        timestamp created_at
    }
    
    EXPENSE_SPLITS {
        uuid id PK
        uuid expense_id FK
        uuid member_id FK
        decimal amount
        decimal percentage
        boolean is_settled
        timestamp settled_at
    }
    
    SETTLEMENTS {
        uuid id PK
        uuid bill_group_id FK
        uuid from_member_id FK
        uuid to_member_id FK
        decimal amount
        enum status "pending, completed"
        timestamp completed_at
        timestamp created_at
    }
    
    BILL_GROUPS ||--o{ BILL_MEMBERS : "has"
    BILL_GROUPS ||--o{ EXPENSES : "tracks"
    EXPENSES ||--o{ EXPENSE_SPLITS : "divided_into"
    BILL_GROUPS ||--o{ SETTLEMENTS : "records"
```

---

## 4. Table Specifications

### 4.1 Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | | Bcrypt hashed password |
| name | VARCHAR(255) | NOT NULL | Display name |
| phone | VARCHAR(20) | | Phone number |
| role | ENUM | DEFAULT 'renter' | User role |
| avatar_url | TEXT | | Profile image URL |
| is_profile_complete | BOOLEAN | DEFAULT false | Profile status |
| is_email_verified | BOOLEAN | DEFAULT false | Email verification |
| email_verified_at | TIMESTAMP | | Verification timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |
| deleted_at | TIMESTAMP | | Soft delete timestamp |

### 4.2 Listings Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| host_id | UUID | FOREIGN KEY | Owner reference |
| category_id | UUID | FOREIGN KEY | Category reference |
| property_type_id | UUID | FOREIGN KEY | Property type |
| location_id | UUID | FOREIGN KEY | Location reference |
| title | VARCHAR(255) | NOT NULL | Listing title |
| description | TEXT | NOT NULL | Detailed description |
| status | ENUM | DEFAULT 'draft' | Publication status |
| price | JSONB | NOT NULL | {amount, currency, period} |
| max_guests | INTEGER | | Maximum occupancy |
| bedrooms | INTEGER | | Number of bedrooms |
| bathrooms | INTEGER | | Number of bathrooms |
| house_rules | TEXT | | Property rules |
| check_in_time | TIME | | Default check-in time |
| check_out_time | TIME | | Default check-out time |
| min_stay | INTEGER | | Minimum nights |
| max_stay | INTEGER | | Maximum nights |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |
| published_at | TIMESTAMP | | Publication time |

### 4.3 Messages Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| conversation_id | UUID | FOREIGN KEY | Parent conversation |
| sender_id | UUID | FOREIGN KEY | Message sender |
| content | TEXT | NOT NULL | Message body |
| is_read | BOOLEAN | DEFAULT false | Read status |
| read_at | TIMESTAMP | | Read timestamp |
| attachments | JSONB | | File attachments |
| created_at | TIMESTAMP | DEFAULT NOW() | Sent time |
| updated_at | TIMESTAMP | | Edit time |
| deleted_at | TIMESTAMP | | Soft delete |

### 4.4 Bookings Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| listing_id | UUID | FOREIGN KEY | Booked property |
| renter_id | UUID | FOREIGN KEY | Booking user |
| check_in | DATE | NOT NULL | Arrival date |
| check_out | DATE | NOT NULL | Departure date |
| guests | INTEGER | NOT NULL | Number of guests |
| total_amount | DECIMAL(10,2) | NOT NULL | Total price |
| platform_fee | DECIMAL(10,2) | | Service fee |
| host_payout | DECIMAL(10,2) | | Host earnings |
| status | ENUM | DEFAULT 'pending' | Booking status |
| special_requests | TEXT | | Guest requests |
| confirmed_at | TIMESTAMP | | Confirmation time |
| cancelled_at | TIMESTAMP | | Cancellation time |
| cancellation_reason | TEXT | | Why cancelled |
| created_at | TIMESTAMP | DEFAULT NOW() | Booking time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

---

## 5. Indexes and Constraints

### 5.1 Indexes

```sql
-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Listings indexes
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_category_id ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_price ON listings((price->>'amount'));
CREATE INDEX idx_listings_created_at ON listings(created_at);
CREATE INDEX idx_listings_location ON listings(location_id);

-- Full-text search indexes
CREATE INDEX idx_listings_search ON listings USING gin(to_tsvector('english', title || ' ' || description));

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Bookings indexes
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Conversations indexes
CREATE INDEX idx_conversations_participants ON conversations USING gin(participants);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);
```

### 5.2 Constraints

```sql
-- Check constraints
ALTER TABLE listings ADD CONSTRAINT chk_price_positive CHECK ((price->>'amount')::decimal > 0);
ALTER TABLE bookings ADD CONSTRAINT chk_checkout_after_checkin CHECK (check_out > check_in);
ALTER TABLE bookings ADD CONSTRAINT chk_guests_positive CHECK (guests > 0);
ALTER TABLE reviews ADD CONSTRAINT chk_rating_range CHECK (overall_rating BETWEEN 1 AND 5);

-- Unique constraints
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
ALTER TABLE categories ADD CONSTRAINT uq_categories_slug UNIQUE (slug);
ALTER TABLE listings ADD CONSTRAINT uq_listing_images_primary UNIQUE (listing_id) WHERE is_primary = true;
```

---

## 6. Data Migration Strategy

### 6.1 Migration Phases

```mermaid
gantt
    title Data Migration Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Setup
    Database Setup           :a1, 2026-04-01, 7d
    Schema Creation          :a2, after a1, 7d
    
    section Phase 2: Sync
    Dual Write Setup         :b1, after a2, 14d
    Read from PostgreSQL     :b2, after b1, 14d
    
    section Phase 3: Migration
    Historical Data Migration :c1, after b2, 14d
    localStorage Cleanup     :c2, after c1, 7d
```

### 6.2 Migration Steps

1. **Phase 1: Database Setup**
   - Create PostgreSQL instance
   - Run schema migrations
   - Set up Redis for sessions

2. **Phase 2: Dual Write**
   - Write to both localStorage and PostgreSQL
   - Implement feature flags
   - Monitor data consistency

3. **Phase 3: Read Migration**
   - Switch reads to PostgreSQL
   - Keep localStorage as fallback
   - Validate data accuracy

4. **Phase 4: Cleanup**
   - Migrate historical data
   - Remove localStorage writes
   - Archive old data

### 6.3 Migration Script Example

```typescript
// migrate-users.ts
async function migrateUsers() {
  const localUsers = JSON.parse(localStorage.getItem('gigs_user') || '[]');
  
  for (const user of localUsers) {
    await db.users.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar_url: user.avatar,
        is_profile_complete: user.isProfileComplete,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
```

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-24 | Technical Team | Initial database schema documentation |

---

*End of Database Schema Documentation*