# GIGS-Rentals Frontend UI Flow Documentation

## Project Overview
This is a **frontend-only prototype** demonstrating the UI/UX flow for the GIGS-Rentals application. The purpose is to show backend developers what we're building and how the user experience should work.

## Current Implementation Status

### ✅ Completed Screens & Features

#### 1. **Home Page** (`/`)
- **Purpose**: Landing page introducing the platform
- **Features**:
  - Hero section with value proposition
  - Marquee scrolling testimonials
  - Journey scroller showcasing user flows
  - Platform showcase section
  - Features grid with key benefits
  - User testimonials carousel
  - Newsletter signup section
  - FAQ accordion
  - Responsive design for all devices

#### 2. **Listings Page** (`/listings`)
- **Purpose**: Main browsing page for available properties
- **Features**:
  - Hero section with search functionality
  - Category selection modal (auto-opens on page load)
  - Empty state with "Create Your First Listing" CTA
  - Responsive grid layout for property cards
  - Mobile-optimized hamburger menu navigation

#### 3. **For Landlords Page** (`/for-landlords`)
- **Purpose**: Dedicated landing page for property managers
- **Features**:
  - Gradient hero section with animated decorations
  - Feature cards (property listing, tenant screening, payment management)
  - Embedded pricing section with three tiers (Basic, Standard, Premium)
  - Call-to-action sections
  - Modern glass-morphism styling
  - Trust indicators (no credit card, free trial)
  - Responsive grid layout

#### 4. **Admin Dashboard - Newsletters** (`/admin/newsletters`)
- **Purpose**: Admin panel for managing email announcements
- **Features**:
  - Newsletter listing with search and filters
  - Create announcement form with:
    - Recipient group selector (All Users, Landlords, Renters)
    - Subject line input
    - Rich text message content (HTML support)
    - File attachment upload
  - Newsletter management (view, edit, delete, send)
  - Status indicators (Sent, Draft, Scheduled)
  - Toast notifications for success/error feedback
  - Mobile-responsive design

#### 5. **Category Selection Modal**
- **Purpose**: Allow users to choose listing type
- **Categories**:
  - **Accommodation** (Active) - Properties, apartments, hostels
  - **Experiences** (Coming Soon) - Tours and activities
  - **Services** (Coming Soon) - Cleaning, transport, etc.

#### 6. **Header Navigation**
- **Simplified Demo Mode** (No authentication)
  - Browse Listings
  - Host Dashboard
  - Create Listing
- Responsive design (mobile hamburger menu)

#### 7. **Create Listing Modal**
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

#### Frontend Components Location - Dashboard App
```
apps/dashboard/
├── app/
│   ├── page.tsx                    # Main listings page
│   ├── admin/
│   │   ├── layout.tsx              # Admin dashboard layout with ToastProvider
│   │   ├── page.tsx                # Admin overview
│   │   ├── listings/page.tsx       # Listing moderation
│   │   ├── users/page.tsx          # User management
│   │   ├── newsletters/page.tsx    # Newsletter management
│   │   ├── locations/page.tsx      # Location management
│   │   ├── reports/page.tsx        # Reports & analytics
│   │   ├── settings/page.tsx       # Admin settings
│   │   └── menu/page.tsx           # Admin menu
│   ├── listings/
│   │   └── create/                 # Listing creation flow
│   └── hosting/                    # Host dashboard
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminSideNav.tsx   # Admin sidebar navigation
│   │   ├── listings/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ListingCard.tsx
│   │   │   └── CreateListingModal.tsx
│   │   └── layout/
│   │       └── Header.tsx
│   └── context/
│       └── AuthContext.tsx         # Currently disabled for demo
```

#### Frontend Components Location - Web App
```
apps/web/
├── app/
│   ├── page.tsx                    # Home/landing page
│   ├── for-landlords/page.tsx      # Landlord marketing page with pricing
│   ├── pricing/ (removed)          # Pricing moved to for-landlords
│   └── [other marketing pages]
├── src/
│   ├── components/
│   │   └── sections/
│   │       └── Home/
│   │           ├── Hero.tsx
│   │           ├── Marquee.tsx
│   │           ├── JourneyScroller.tsx
│   │           ├── PlatformShowcase.tsx
│   │           ├── FeaturesGrid.tsx
│   │           ├── Testimonials.tsx
│   │           ├── Newsletter.tsx       # NEW: Newsletter signup
│   │           ├── Pricing.tsx          # MOVED: Now in for-landlords page
│   │           ├── FAQ.tsx
│   │           └── index.ts
```

#### UI Component Library (`@repo/ui`)
```
packages/ui/src/
├── button.tsx                 # CTA button component
├── input.tsx                  # NEW: Text input with labels/validation
├── select.tsx                 # Dropdown select component
├── textarea.tsx               # Multi-line text input
├── fileupload.tsx            # File upload with drag & drop
├── toast.tsx                 # Toast notifications provider
├── card.tsx                  # Card container component
├── modal.tsx                 # Modal/dialog component
├── table.tsx                 # Data table component
├── tabs.tsx                  # Tab navigation component
├── file-upload.tsx           # Advanced file upload
├── otp-input.tsx             # OTP input field
└── loader.tsx                # Loading spinner
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
- role (enum: lister, renter, both, admin)
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

#### Newsletters Table (NEW)
```sql
- id (UUID)
- admin_id (FK -> Users.id)
- subject (string)
- content (text)
- recipient_type (enum: all_users, landlords, renters)
- status (enum: draft, sent, scheduled)
- sent_at (timestamp, nullable)
- scheduled_for (timestamp, nullable)
- attachment_url (string, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Newsletter Subscribers Table (NEW)
```sql
- id (UUID)
- user_id (FK -> Users.id)
- email (string)
- subscribed (boolean)
- subscribed_at (timestamp)
- unsubscribed_at (timestamp, nullable)
- preferences (json: digest_frequency, categories)
```

#### Newsletter Logs Table (NEW - for tracking)
```sql
- id (UUID)
- newsletter_id (FK -> Newsletters.id)
- user_id (FK -> Users.id)
- status (enum: delivered, bounced, failed)
- sent_at (timestamp)
- opened_at (timestamp, nullable)
- clicked_at (timestamp, nullable)
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

#### Newsletters (NEW)
```
GET    /api/newsletters           # Get all newsletters
POST   /api/newsletters           # Create newsletter
GET    /api/newsletters/:id       # Get single newsletter
PUT    /api/newsletters/:id       # Update newsletter
DELETE /api/newsletters/:id       # Delete newsletter
POST   /api/newsletters/:id/send  # Send newsletter

GET    /api/newsletter-subscribers       # Get subscribers
POST   /api/newsletter-subscribers       # Subscribe user
DELETE /api/newsletter-subscribers/:id   # Unsubscribe user
```

#### Email/Messaging
```
POST   /api/emails/newsletter    # Send newsletter emails
POST   /api/messages             # Send user messages
GET    /api/messages             # Get message threads
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

### ✅ Recently Completed
1. **Newsletter Management** - Admin panel at `/admin/newsletters` with full CRUD operations
2. **Newsletter Signup** - Integrated into homepage for user subscriptions
3. **Landlord Landing Page** - Full marketing page with embedded pricing at `/for-landlords`
4. **UI Component Library** - Added Input, FileUpload, and other form components
5. **Toast Notifications** - Integrated ToastProvider in dashboard layout for user feedback
6. **Admin Navigation** - Updated sidebar and menu to include newsletters

### To Build:
1. **Listing Creation Form** (`/listings/create`)
   - Multi-step form
   - Image upload
   - Location picker
   - Amenities selection
   - Price input
   - Form validation and submission

2. **Listing Detail Page** (`/listings/:id`)
   - Full property details
   - Image gallery with lightbox
   - Contact host button
   - Map view with location
   - Reviews/ratings section
   - Similar properties carousel

3. **Host Dashboard** (`/hosting`)
   - Manage listings overview
   - View reservations/bookings
   - Earnings tracking
   - Messages/communications
   - Analytics dashboard

4. **Search & Filter UI**
   - Location filter with autocomplete
   - Price range slider
   - Category filters
   - Amenities multi-select
   - Availability date picker
   - Advanced search modal

5. **User Profile Pages**
   - Edit profile information
   - View saved listings
   - Booking history
   - Payment methods
   - Account settings

6. **Mobile-Specific Optimizations**
   - Bottom tab navigation
   - Touch-friendly form inputs
   - Mobile menu drawer
   - Optimized image sizes

7. **Messaging System UI**
   - Message thread list
   - Individual chat interface
   - Typing indicators
   - Read receipts

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

## Recent Updates (April 2026)

### New Features Added
- **Admin Newsletter Management**: Full CRUD operations for announcement campaigns in admin dashboard
- **Homepage Newsletter Signup**: Integrated email subscription form in hero section
- **For Landlords Page**: Dedicated marketing page with:
  - Modern gradient hero with animated decorations
  - Feature showcase cards
  - Embedded pricing table (Basic, Standard, Premium)
  - Trust indicators and CTAs
- **Enhanced UI Components**: 
  - Input component with validation states
  - FileUpload with drag-and-drop support
  - Toast notifications system

### Styling Improvements
- **For-Landlords Page**:
  - Glass-morphism design with backdrop blur effects
  - Gradient backgrounds and hover states
  - Improved button styling with elevation effects
  - Better typography hierarchy
  - Mobile-responsive grid layouts
  - Decorative gradient overlays

### Architecture Changes
- ToastProvider now integrated in dashboard root layout
- Admin navigation updated to include newsletters
- Recipient targeting system (All Users, Landlords, Renters)
- Mock data structure for newsletter management

### Pricing Section Update
- **Moved** pricing from homepage to `/for-landlords` page
- Pricing section now exclusive to landlord marketing page
- Plans: Basic ($0), Standard ($29/mo), Premium ($59/mo)
- Each plan includes feature descriptions and CTAs

---

**Last Updated**: April 4, 2026
**Version**: 1.1 (Admin Features & Styling Enhancements)
