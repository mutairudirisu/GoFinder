# Quick Start Guide for Backend Developers

## 🚀 How to Run This Frontend Prototype

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation & Setup

```bash
# Navigate to project root
cd GIGS-Rentals

# Install dependencies
npm install

# Run the dashboard (development server)
npm run dev
```

The app will start at: **http://localhost:3000**

### Alternative: Run Specific App

```bash
# Dashboard only
cd apps/dashboard
npm run dev

# Web frontend
cd apps/web
npm run dev
```

## 📱 What You'll See

### 1. Landing on `/listings`
- Beautiful hero section with search
- Category modal auto-opens immediately
- Three category options (only Accommodation is active)

### 2. Navigation Menu
Click the hamburger menu (☰):
- **Browse Listings** → Goes to main listings page
- **Host Dashboard** → Goes to hosting management
- **Create Listing** → Starts listing creation flow

### 3. Empty State
When no listings exist, you'll see:
- "No Listings Yet" message
- "Create Your First Listing" button
- Clean, modern UI

## 🎯 Key Pages to Review

| Route | Purpose | Status |
|-------|---------|--------|
| `/listings` | Main browsing page | ✅ Complete |
| `/listings/create` | Create new listing | 🔄 In Progress |
| `/hosting` | Host dashboard | 🔄 In Progress |
| `/profile` | User profile | ⏳ Planned |
| `/listings/:id` | Listing details | ⏳ Planned |

## 💾 Current Data Storage

**Currently**: Browser localStorage (temporary, clears on cache clear)

**Future**: Will be replaced with backend API calls

Example of current storage:
```javascript
// Listings stored in browser
localStorage.getItem('gigs_listings')
```

This will become:
```javascript
// API call to backend
fetch('/api/listings')
```

## 🔗 Integration Points

Where backend needs to integrate:

### 1. Authentication
- Replace all auth checks with real JWT/session
- Add login/signup flows
- Implement role-based access

### 2. Data Persistence
- Replace localStorage with database
- Add CRUD operations for listings
- Implement image upload/storage

### 3. Search & Filtering
- Connect search bar to database queries
- Add location-based filtering
- Implement price range filters

## 📋 Documentation Files

- **[FRONTEND_UI_FLOW.md](./FRONTEND_UI_FLOW.md)** - Comprehensive UI flow documentation
- **[AUTH_REMOVAL_SUMMARY.md](./AUTH_REMOVAL_SUMMARY.md)** - What was removed and why
- **[docs/](./docs/)** - Full project documentation

## 🎨 Design System

Colors used in codebase:
- `brand-500`: Primary green (#22C55E)
- `slate-*`: Gray scale colors
- Custom gradients throughout

Fonts:
- Display font for headings
- Sans-serif for body text

## ❓ Questions?

Review the comprehensive documentation in:
- `FRONTEND_UI_FLOW.md` - Full technical specs
- `docs/` folder - Architecture details

Or reach out to the frontend team for clarifications.

---

**Happy Building! 🎉**
