# System Architecture Documentation

## GIGS-Rental Platform

**Version:** 1.0  
**Date:** March 24, 2026  
**Status:** Current Architecture

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Application Architecture](#3-application-architecture)
4. [Component Architecture](#4-component-architecture)
5. [Data Flow Architecture](#5-data-flow-architecture)
6. [State Management](#6-state-management)
7. [Authentication Architecture](#7-authentication-architecture)
8. [Deployment Architecture](#8-deployment-architecture)

---

## 1. Architecture Overview

### 1.1 High-Level System Architecture

```mermaid
flowchart TB
    subgraph "Client Layer"
        WEB[Marketing Website\nNext.js App Router]
        DASH[Dashboard App\nNext.js App Router]
    end
    
    subgraph "API Layer"
        API[NestJS Backend API]
    end
    
    subgraph "Shared Layer"
        UI[@repo/ui Components]
        AUTH[@repo/auth Logic]
        CONFIG[@repo/config]
    end
    
    subgraph "Data Layer"
        LOCAL[(Browser localStorage\nCurrent Implementation)]
        DB[(PostgreSQL\nFuture Implementation)]
        CACHE[(Redis\nFuture Implementation)]
    end
    
    subgraph "External Services"
        GOOGLE[Google OAuth]
        PHOSPHOR[Phosphor Icons CDN]
        UNSPLASH[Unsplash Images]
    end
    
    WEB --> UI
    WEB --> AUTH
    DASH --> UI
    DASH --> AUTH
    DASH --> API
    API --> AUTH
    
    WEB --> LOCAL
    DASH --> LOCAL
    API -.-> DB
    
    WEB --> GOOGLE
    DASH --> GOOGLE
    WEB --> PHOSPHOR
    DASH --> PHOSPHOR
    WEB --> UNSPLASH
    DASH --> UNSPLASH
```

### 1.2 Architecture Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| Separation of Concerns | Clear boundaries between apps and packages | Monorepo structure with shared packages |
| DRY (Don't Repeat Yourself) | Reusable components and logic | @repo/ui and @repo/auth packages |
| Mobile-First | Design for mobile, enhance for desktop | Responsive Tailwind classes |
| Progressive Enhancement | Core functionality works without JS | Next.js SSR and static generation |
| Type Safety | Compile-time error prevention | TypeScript throughout |

---

## 2. Monorepo Structure

### 2.1 Turborepo Workspace Configuration

```mermaid
flowchart TB
    ROOT[GIGS-Rental Root]
    
    subgraph "apps/"
        BACKEND[backend/\nNestJS API]
        DASHAPP[dashboard/\nNext.js App]
        WEBAPP[web/\nNext.js Marketing Site]
    end
    
    subgraph "packages/"
        subgraph "auth/"
            AUTH_CONFIG[config/]
            AUTH_HOOKS[hooks/]
            AUTH_MIDDLEWARE[middleware/]
            AUTH_PROVIDERS[providers/]
        end
        
        CONFIG_PKG[config/\nTailwind Config]
        
        subgraph "eslint-config/"
            ESLINT_BASE[base.js]
            ESLINT_NEXT[next.js]
            ESLINT_REACT[react-internal.js]
        end
        
        subgraph "typescript-config/"
            TSCONFIG_BASE[base.json]
            TSCONFIG_NEXT[nextjs.json]
            TSCONFIG_REACT[react-library.json]
        end
        
        subgraph "ui/"
            UI_BUTTON[button.tsx]
            UI_CARD[card.tsx]
            UI_MODAL[modal.tsx]
            UI_TABLE[table.tsx]
            UI_TABS[tabs.tsx]
            UI_TOAST[toast.tsx]
            UI_OTP[otp-input.tsx]
            UI_UPLOAD[file-upload.tsx]
        end
    end
    
    ROOT --> apps/
    ROOT --> packages/
```

### 2.2 Package Dependencies

```mermaid
flowchart LR
    subgraph "Applications"
        DASH[dashboard]
        WEB[web]
        API[backend]
    end
    
    subgraph "Shared Packages"
        UI[@repo/ui]
        AUTH[@repo/auth]
        CONFIG[@repo/config]
        ESLINT[@repo/eslint-config]
        TSCONFIG[@repo/typescript-config]
    end
    
    DASH --> UI
    DASH --> AUTH
    DASH --> CONFIG
    DASH --> ESLINT
    DASH --> TSCONFIG
    
    WEB --> UI
    WEB --> AUTH
    WEB --> CONFIG
    WEB --> ESLINT
    WEB --> TSCONFIG
    
    API --> AUTH
    API --> ESLINT
    API --> TSCONFIG
```

---

## 3. Application Architecture

### 3.1 Marketing Website (apps/web)

```mermaid
flowchart TB
    subgraph "web/ Application"
        subgraph "app/ - App Router"
            W_ROOT[page.tsx\nLanding]
            W_ABOUT[about-us/page.tsx]
            W_CONTACT[contact/page.tsx]
            W_PRICING[pricing/page.tsx]
            W_BLOG[blog/page.tsx]
            W_LEGAL[privacy/, terms/, cookies/]
        end
        
        subgraph "src/components/"
            W_LAYOUT[Layout/\nHeader, Footer]
            W_SECTIONS[sections/\nHome, About, Contact]
            W_AUTH[auth/\nAuthLayout, OAuthButtons]
        end
        
        subgraph "Configuration"
            W_TAILWIND[tailwind.config.js]
            W_NEXT[next.config.js]
            W_LAYOUT_TS[layout.tsx\nRoot Layout]
        end
    end
```

#### 3.1.1 Route Structure

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing page with hero, features, FAQ |
| `/about-us` | `app/about-us/page.tsx` | Company information, team, mission |
| `/contact` | `app/contact/page.tsx` | Contact form and information |
| `/pricing` | `app/pricing/page.tsx` | Pricing plans and features |
| `/blog` | `app/blog/page.tsx` | Content marketing blog |
| `/careers` | `app/careers/page.tsx` | Job listings |
| `/for-landlords` | `app/for-landlords/page.tsx` | Landlord-focused landing |
| `/roommate-match` | `app/roommate-match/page.tsx` | Roommate matching feature |
| `/help-center` | `app/help-center/page.tsx` | FAQ and support |
| `/safety-guidelines` | `app/safety-guidelines/page.tsx` | Safety information |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/cookies` | `app/cookies/page.tsx` | Cookie policy |

### 3.2 Dashboard Application (apps/dashboard)

```mermaid
flowchart TB
    subgraph "dashboard/ Application"
        subgraph "app/ - App Router"
            D_AUTH[auth/\nlogin, signup,\nonboarding,\nforgot-password,\nverify-otp,\nreset-password]
            D_LISTINGS[listings/\npage, [id]/,\ncreate/, saved/]
            D_HOSTING[hosting/\npage, calendar/,\nearnings/, listings/,\nmessages/, reviews/,\nsettings/]
            D_PROFILE[profile/\npage]
        end
        
        subgraph "src/"
            D_CONTEXT[context/\nAuthContext, MessageContext]
            D_COMPONENTS[components/\nlayout/, auth/,\nlistings/, mobile/]
        end
        
        subgraph "Configuration"
            D_TAILWIND[tailwind.config.js]
            D_NEXT[next.config.js]
            D_LAYOUT[layout.tsx]
        end
    end
```

#### 3.2.1 Route Structure

**Authentication Routes:**
| Route | File | Purpose |
|-------|------|---------|
| `/auth/login` | `auth/login/LoginClient.tsx` | User login |
| `/auth/signup` | `auth/signup/SignupClient.tsx` | User registration |
| `/auth/onboarding` | `auth/onboarding/OnboardingClient.tsx` | Profile completion |
| `/auth/forgot-password` | `auth/forgot-password/ForgotPasswordClient.tsx` | Password reset request |
| `/auth/verify-otp` | `auth/verify-otp/VerifyOtpClient.tsx` | OTP verification |
| `/auth/reset-password` | `auth/reset-password/ResetPasswordClient.tsx` | New password entry |

**Listing Routes:**
| Route | File | Purpose |
|-------|------|---------|
| `/listings` | `listings/page.tsx` | Browse all listings |
| `/listings/[id]` | `listings/[id]/page.tsx` | Listing detail view |
| `/listings/[id]/contact` | `listings/[id]/contact/page.tsx` | Contact host form |
| `/listings/[id]/message` | `listings/[id]/message/page.tsx` | Message host |
| `/listings/[id]/roommates` | `listings/[id]/roommates/page.tsx` | Find roommates |
| `/listings/[id]/split-bills` | `listings/[id]/split-bills/page.tsx` | Bill splitting tool |
| `/listings/create` | `listings/create/page.tsx` | Create new listing |
| `/listings/saved` | `listings/saved/page.tsx` | Saved favorites |

**Host Routes:**
| Route | File | Purpose |
|-------|------|---------|
| `/hosting` | `hosting/page.tsx` | Host dashboard overview |
| `/hosting/calendar` | `hosting/calendar/page.tsx` | Availability calendar |
| `/hosting/earnings` | `hosting/earnings/page.tsx` | Earnings tracking |
| `/hosting/listings` | `hosting/listings/page.tsx` | Manage listings |
| `/hosting/messages` | `hosting/messages/page.tsx` | Host inbox |
| `/hosting/reviews` | `hosting/reviews/page.tsx` | Review management |
| `/hosting/settings` | `hosting/settings/page.tsx` | Account settings |

### 3.3 Backend API (apps/backend)

```mermaid
flowchart TB
    subgraph "backend/ Application"
        subgraph "src/"
            B_MAIN[main.ts\nEntry Point]
            B_APP[app.module.ts\nRoot Module]
            B_CONTROLLER[app.controller.ts\nBase Controller]
            B_SERVICE[app.service.ts\nBase Service]
        end
        
        subgraph "test/"
            B_E2E[app.e2e-spec.ts\nE2E Tests]
        end
        
        subgraph "Configuration"
            B_NEST[nest-cli.json]
            B_TS[tsconfig.json]
            B_BUILD[tsconfig.build.json]
        end
    end
```

---

## 4. Component Architecture

### 4.1 Shared UI Components (@repo/ui)

```mermaid
flowchart TB
    subgraph "@repo/ui Package"
        subgraph "Form Components"
            UI_BUTTON[button.tsx\nPrimary, Secondary,\nGhost variants]
            UI_SELECT[select.tsx\nDropdown with\nsearch support]
            UI_TEXTAREA[textarea.tsx\nAuto-resizing\ntext area]
            UI_OTP[otp-input.tsx\n6-digit OTP\ninput]
            UI_UPLOAD[file-upload.tsx\nDrag & drop\nupload]
        end
        
        subgraph "Display Components"
            UI_CARD[card.tsx\nContainer with\nvariants]
            UI_TABLE[table.tsx\nSortable,\npaginated]
            UI_TABS[tabs.tsx\nHorizontal &\nvertical]
            UI_CODE[code.tsx\nCode display]
        end
        
        subgraph "Feedback Components"
            UI_MODAL[modal.tsx\nDialog with\nanimations]
            UI_TOAST[toast.tsx\nNotification\nsystem]
            UI_LOADER[loader.tsx\nLoading states]
        end
    end
```

### 4.2 Component Hierarchy (Dashboard)

```mermaid
flowchart TB
    subgraph "Dashboard Component Tree"
        ROOT[RootLayout]
        
        subgraph "Layout Layer"
            HEADER[Header]
            BOTTOM_NAV[MobileBottomNav]
        end
        
        subgraph "Context Providers"
            AUTH_CTX[AuthProvider]
            MSG_CTX[MessageProvider]
        end
        
        subgraph "Page Components"
            LOGIN[LoginClient]
            SIGNUP[SignupClient]
            ONBOARD[OnboardingClient]
            LISTINGS[ListingsPage]
            CREATE[CreateListingPage]
            HOSTING[HostingPage]
        end
        
        subgraph "Shared Components"
            AUTH_LAYOUT[AuthLayout]
            LISTING_CARD[ListingCard]
            SEARCH_BAR[SearchBar]
            OAUTH[OAuthButtons]
        end
        
        ROOT --> AUTH_CTX
        AUTH_CTX --> MSG_CTX
        MSG_CTX --> HEADER
        MSG_CTX --> BOTTOM_NAV
        
        HEADER --> LISTINGS
        HEADER --> HOSTING
        
        LOGIN --> AUTH_LAYOUT
        SIGNUP --> AUTH_LAYOUT
        ONBOARD --> AUTH_LAYOUT
        
        LISTINGS --> SEARCH_BAR
        LISTINGS --> LISTING_CARD
        
        AUTH_LAYOUT --> OAUTH
    end
```

### 4.3 Design System - Brutalist Style

```mermaid
flowchart LR
    subgraph "Design Tokens"
        COLORS[Colors]
        TYPO[Typography]
        SPACING[Spacing]
        SHADOWS[Shadows]
    end
    
    subgraph "Color Palette"
        BRAND[Brand Colors\nPrimary: #3B82F6\nDark: #1E40AF]
        ACCENT[Accent Colors\nPurple, Pink,\nTeal, Orange]
        NEUTRAL[Neutral Colors\nSlate scale]
    end
    
    subgraph "Typography"
        DISPLAY[Display Font\nBold, tight tracking]
        SANS[Sans Font\nInter/System]
        MONO[Mono Font\nCode elements]
    end
    
    subgraph "Shadows (Neubrutalism)"
        SM[shadow-brutal-sm\n2px offset]
        MD[shadow-brutal\n4px offset]
        LG[shadow-brutal-lg\n8px offset]
    end
    
    COLORS --> BRAND
    COLORS --> ACCENT
    COLORS --> NEUTRAL
    TYPO --> DISPLAY
    TYPO --> SANS
    TYPO --> MONO
    SHADOWS --> SM
    SHADOWS --> MD
    SHADOWS --> LG
```

---

## 5. Data Flow Architecture

### 5.1 Listing Creation Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as CreateListingPage
    participant S as State
    participant L as localStorage
    
    U->>C: Select Category
    C->>S: updateFormData({category})
    S->>C: setCurrentStep(2)
    
    U->>C: Select Property Type
    C->>S: updateFormData({type})
    S->>C: setCurrentStep(3)
    
    U->>C: Enter Details
    C->>S: updateFormData({details})
    
    U->>C: Select Amenities
    C->>S: updateFormData({amenities})
    S->>C: setCurrentStep(5)
    
    U->>C: Upload Photos
    C->>C: Process Images
    C->>S: updateFormData({images})
    S->>C: setCurrentStep(6)
    
    U->>C: Set Pricing
    C->>S: updateFormData({price})
    S->>C: setCurrentStep(7)
    
    U->>C: Review & Publish
    C->>L: Save listing
    C->>C: Show success toast
```

### 5.2 Authentication Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as AuthContext
    participant L as localStorage
    participant LAYOUT as Protected Layout
    
    alt Email Registration
        U->>A: signup(email, name, "email")
        A->>A: Generate OTP
        A->>U: Redirect to verify-otp
        U->>A: verifyOTP(otp)
        A->>L: Store user data
        A->>U: Redirect to onboarding
    else Google OAuth
        U->>A: signup(email, name, "google")
        A->>L: Store user data
        A->>U: Redirect to onboarding
    end
    
    U->>A: completeProfile(data)
    A->>L: Update user with profile
    A->>U: Redirect to listings
    
    LAYOUT->>A: Check isAuthenticated
    A->>L: Get stored user
    A->>LAYOUT: Return auth state
```

### 5.3 Messaging Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Contact Page
    participant MSG as MessageContext
    participant L as localStorage
    participant INBOX as Messages Page
    
    U->>C: Click "Contact Host"
    C->>MSG: startConversation(listingId, ...)
    MSG->>MSG: Check existing conversation
    MSG->>MSG: Create new conversation
    MSG->>L: Save conversation
    MSG->>C: Return conversationId
    C->>U: Redirect to message page
    
    U->>INBOX: View messages
    INBOX->>MSG: Get conversations
    MSG->>L: Load from storage
    MSG->>INBOX: Return conversation list
    
    U->>INBOX: Send message
    INBOX->>MSG: sendMessage(convId, content)
    MSG->>L: Update messages
    MSG->>MSG: Update conversation lastMessage
    MSG->>L: Save conversations
```

---

## 6. State Management

### 6.1 State Architecture

```mermaid
flowchart TB
    subgraph "State Management"
        subgraph "Global State (React Context)"
            AUTH_STATE[AuthContext\nUser, isAuthenticated,\nlogin, signup, logout]
            MSG_STATE[MessageContext\nConversations, messages,\nunreadCount]
        end
        
        subgraph "Local State (useState)"
            FORM_STATE[Form State\nMulti-step forms]
            UI_STATE[UI State\nModals, drawers,\nloading states]
        end
        
        subgraph "Persistent State (localStorage)"
            USER_DATA[gigs_user\nAuthenticated user]
            CONV_DATA[gigs_conversations\nMessage threads]
            MSG_DATA[gigs_messages\nMessage history]
            LIKES_DATA[gigs_liked_properties\nSaved listings]
            HOST_DATA[gigs_host_listings\nHost's listings]
        end
        
        subgraph "Server State (Future)"
            API_CACHE[API Cache\nReact Query/SWR]
            REALTIME[WebSocket\nReal-time updates]
        end
    end
```

### 6.2 Context Providers Hierarchy

```mermaid
flowchart TB
    ROOT[Root Layout]
    
    subgraph "Provider Stack"
        AUTH[AuthProvider]
        MSG[MessageProvider]
        THEME[ThemeProvider]
    end
    
    subgraph "Consumer Components"
        HEADER[Header\nUses: Auth, Message]
        LISTINGS[ListingsPage\nUses: Auth]
        MESSAGES[MessagesPage\nUses: Auth, Message]
        HOSTING[HostingPage\nUses: Auth]
    end
    
    ROOT --> AUTH
    AUTH --> MSG
    MSG --> THEME
    THEME --> HEADER
    THEME --> LISTINGS
    THEME --> MESSAGES
    THEME --> HOSTING
```

---

## 7. Authentication Architecture

### 7.1 Authentication Flow

```mermaid
flowchart TD
    subgraph "Authentication Architecture"
        A[User Access]
        
        subgraph "Auth Methods"
            EMAIL[Email + Password]
            GOOGLE[Google OAuth]
        end
        
        subgraph "Verification"
            OTP[OTP Verification\n6-digit code]
        end
        
        subgraph "Session Management"
            LOCAL[localStorage\nCurrent]
            JWT[JWT Tokens\nFuture]
            REFRESH[Refresh Tokens\nFuture]
        end
        
        subgraph "Protected Routes"
            CHECK{isAuthenticated?}
            REDIRECT[Redirect to Login]
            ALLOW[Allow Access]
        end
        
        subgraph "Role-Based Access"
            ROLE{User Role}
            RENTER[Renter Views]
            LISTER[Lister Views]
            BOTH[Both Views]
        end
        
        A --> EMAIL
        A --> GOOGLE
        
        EMAIL --> OTP
        GOOGLE --> LOCAL
        OTP --> LOCAL
        
        LOCAL --> CHECK
        CHECK -->|No| REDIRECT
        CHECK -->|Yes| ROLE
        
        ROLE -->|renter| RENTER
        ROLE -->|lister| LISTER
        ROLE -->|both| BOTH
        
        REDIRECT --> A
    end
```

### 7.2 Auth Package Structure

```mermaid
flowchart TB
    subgraph "@repo/auth Package"
        INDEX[index.ts\nExports]
        
        subgraph "config/"
            BASE[base-auth-config.ts]
            ADMIN[admin-auth-config.ts]
            OWNER[owner-auth-config.ts]
            USER[user-auth-configs.ts]
        end
        
        subgraph "hooks/"
            USE_AUTH[use-auth.ts]
        end
        
        subgraph "middleware/"
            AUTH_MW[auth-middleware.ts]
        end
        
        subgraph "providers/"
            CRED[credentials-provider.ts]
            OAUTH[oauth-providers.ts]
        end
        
        INDEX --> BASE
        INDEX --> USE_AUTH
        INDEX --> AUTH_MW
    end
```

---

## 8. Deployment Architecture

### 8.1 Current Development Setup

```mermaid
flowchart TB
    subgraph "Development Environment"
        DEV_MACHINE[Developer Machine]
        
        subgraph "Running Services"
            WEB_DEV[web\nlocalhost:8888]
            DASH_DEV[dashboard\nlocalhost:3001]
            API_DEV[backend\nlocalhost:3000]
        end
        
        subgraph "Build Tools"
            TURBO[Turborepo\nTask Runner]
            NEXT[Next.js\nDev Server]
            NEST[NestJS\nDev Server]
        end
        
        DEV_MACHINE --> TURBO
        TURBO --> WEB_DEV
        TURBO --> DASH_DEV
        TURBO --> API_DEV
        
        WEB_DEV --> NEXT
        DASH_DEV --> NEXT
        API_DEV --> NEST
    end
```

### 8.2 Future Production Architecture

```mermaid
flowchart TB
    subgraph "Production Environment"
        CDN[Cloudflare CDN\nStatic Assets]
        
        subgraph "Vercel Edge Network"
            WEB_PROD[web App\nServerless Functions]
            DASH_PROD[dashboard App\nServerless Functions]
        end
        
        subgraph "Backend Infrastructure"
            API_PROD[API Server\nDocker Container]
            LB[Load Balancer]
        end
        
        subgraph "Data Layer"
            DB[(PostgreSQL\nPrimary)]
            DB_REPLICA[(PostgreSQL\nRead Replica)]
            REDIS[(Redis\nCache + Sessions)]
            S3[(S3/Cloud Storage\nImages)]
        end
        
        subgraph "Monitoring"
            LOGS[Logging Service]
            METRICS[Metrics/APM]
        end
        
        CDN --> WEB_PROD
        CDN --> DASH_PROD
        
        WEB_PROD --> LB
        DASH_PROD --> LB
        LB --> API_PROD
        
        API_PROD --> DB
        API_PROD --> DB_REPLICA
        API_PROD --> REDIS
        API_PROD --> S3
        
        API_PROD --> LOGS
        API_PROD --> METRICS
    end
```

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-24 | Technical Team | Initial architecture documentation |

---

*End of System Architecture Documentation*