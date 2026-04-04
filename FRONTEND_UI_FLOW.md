# GIGS-Rentals Frontend UI Flow Documentation

## Project Overview
This is a **frontend-only prototype** demonstrating the UI/UX flow for the GIGS-Rentals application. The purpose is to show backend developers what we're building and how the user experience should work.

## Current Implementation Status

### ✅ Completed Screens & Features

#### 1. **Listings Page** (`/listings`)
- **Purpose**: Main browsing page for available properties
- **Features**:
  - Hero section with search functionality
  - Category selection modal (auto-opens on page load)
  - Empty state with "Create Your First Listing" CTA
  - Responsive grid layout for property cards
  - Mobile-optimized hamburger menu navigation

#### 2. **Category Selection Modal**
- **Purpose**: Allow users to choose listing type
- **Categories**:
  - **Accommodation** (Active) - Properties, apartments, hostels
  - **Experiences** (Coming Soon) - Tours and activities
  - **Services** (Coming Soon) - Cleaning, transport, etc.

#### 3. **Header Navigation**
- **Simplified Demo Mode** (No authentication)
  - Browse Listings
  - Host Dashboard
  - Create Listing
- Responsive design (mobile hamburger menu)

#### 4. **Create Listing Modal**
- Category selection interface
- Clean, modern UI with animations
- Directs to appropriate creation flow based on category

### 🎯 User Flow

```
Landing Page (/listings)
    ↓
Category Modal Auto-Opens
    ↓
User Selects "Accommodation"
    ↓
Redirects to /listings/create?category=accommodation
    ↓
Listing Creation Form (to be built)
    ↓
Published Listing appears on /listings
```

### 📱 Responsive Design
- **Mobile-first approach**
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Touch-friendly interactions
- Optimized layouts for all screen sizes

## Technical Details

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Phosphor Icons
- **Component Library**: Custom components + @repo/ui

### Key Components

#### Frontend Components Location
```
apps/dashboard/
├── app/
│   ├── page.tsx                    # Main listings page
│   ├── listings/
│   │   └── create/                 # Listing creation flow
│   └── hosting/                    # Host dashboard
├── src/
│   ├── components/
│   │   ├── listings/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ListingCard.tsx
│   │   │   └── CreateListingModal.tsx
│   │   └── layout/
│   │       └── Header.tsx
│   └── context/
│       └── AuthContext.tsx         # Currently disabled for demo
```

### Data Flow (Prototype)
Currently using **localStorage** for demonstration:
- User-created listings stored in browser
- No backend integration yet
- All data clears on browser cache clear

## What Backend Developers Need to Build

### 1. **Authentication System**
- User registration/login
- JWT or session-based auth
- Role management (lister, renter, both)

### 2. **Database Schema**
Based on our frontend flows:

#### Users Table
```sql
- id (UUID)
- email (string, unique)
- name (string)
- phone (string, optional)
- role (enum: lister, renter, both)
- avatar_url (string, optional)
- created_at (timestamp)
```

#### Listings Table
```sql
- id (UUID)
- user_id (FK -> Users.id)
- category (enum: accommodation, experience, services)
- title (string)
- description (text)
- location/address (string)
- price (decimal)
- images (array of URLs)
- amenities (array of strings)
- status (enum: draft, published, rented)
- created_at (timestamp)
- updated_at (timestamp)
```

### 3. **API Endpoints Needed**

#### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

#### Listings
```
GET    /api/listings              # Get all listings
POST   /api/listings              # Create listing
GET    /api/listings/:id          # Get single listing
PUT    /api/listings/:id          # Update listing
DELETE /api/listings/:id          # Delete listing
GET    /api/listings/user/:userId # Get user's listings
```

#### Search & Filter
```
GET    /api/listings?search=&location=&category=&priceRange=
```

### 4. **Integration Points**

Replace these localStorage calls with API calls:

**Current Frontend (localStorage)**:
```typescript
// Saving listing
localStorage.setItem('gigs_listings', JSON.stringify(listings));

// Loading listings
const listings = JSON.parse(localStorage.getItem('gigs_listings'));
```

**Future Backend Integration**:
```typescript
// Saving listing
await fetch('/api/listings', {
  method: 'POST',
  body: JSON.stringify(listingData)
});

// Loading listings
const response = await fetch('/api/listings');
const listings = await response.json();
```

## Next Steps for Frontend

### To Build:
1. **Listing Creation Form** (`/listings/create`)
   - Multi-step form
   - Image upload
   - Location picker
   - Amenities selection
   - Price input

2. **Listing Detail Page** (`/listings/:id`)
   - Full property details
   - Image gallery
   - Contact host button
   - Map view

3. **Host Dashboard** (`/hosting`)
   - Manage listings
   - View reservations
   - Earnings tracking
   - Messages

4. **Search & Filter UI**
   - Location filter
   - Price range slider
   - Category filters
   - Amenities filter

5. **User Profile** (`/profile`)
   - Edit profile
   - View saved listings
   - Booking history

## Design Principles

### UX Guidelines
- **Airbnb-inspired**: Clean, modern, intuitive
- **Mobile-first**: Optimize for small screens first
- **Fast loading**: Minimal bundle size
- **Accessible**: WCAG 2.1 compliance
- **Brutal shadows**: Deep shadows for depth (as per design system)

### Color Scheme
- Primary: Brand Green (#22C55E)
- Background: Gradient grays
- Text: Slate colors
- Accents: Various colors for categories

## Questions for Backend Team

1. What database will be used? (PostgreSQL, MongoDB, etc.)
2. Preferred authentication method? (JWT, OAuth, sessions)
3. File storage for images? (AWS S3, Cloudinary, etc.)
4. Real-time features needed? (WebSockets for chat)
5. Payment integration requirements?

## Contact & Collaboration

This prototype is meant to facilitate discussion between frontend and backend teams. Please review the flows and provide feedback on:
- Feasibility of proposed features
- Additional requirements
- Technical constraints
- Timeline estimates

---

**Last Updated**: March 30, 2026
**Version**: 1.0 (Prototype)
