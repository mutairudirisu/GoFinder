# GoFinder Dashboard — Progressive Web App Implementation Plan

> **Scope:** `apps/dashboard` (Next.js 16, App Router) + `apps/backend` (NestJS 10)  
> **Stack:** Serwist (service worker), Web Push API (VAPID), IndexedDB (offline storage)  
> **Goal:** A fully installable, offline-capable, push-notification-enabled PWA for student housing

---

## Table of Contents

1. [What PWA Means for GoFinder](#1-what-pwa-means-for-gofinder)
2. [Technology Decisions](#2-technology-decisions)
3. [Architecture Overview](#3-architecture-overview)
4. [Phase 1 — Web App Manifest & Identity](#4-phase-1--web-app-manifest--identity)
5. [Phase 2 — Service Worker & Caching Strategies](#5-phase-2--service-worker--caching-strategies)
6. [Phase 3 — Offline Experience](#6-phase-3--offline-experience)
7. [Phase 4 — Push Notifications (Frontend)](#7-phase-4--push-notifications-frontend)
8. [Phase 5 — Push Notifications (NestJS Backend)](#8-phase-5--push-notifications-nestjs-backend)
9. [Phase 6 — Background Sync](#9-phase-6--background-sync)
10. [Phase 7 — Install UX (Add to Home Screen)](#10-phase-7--install-ux-add-to-home-screen)
11. [Phase 8 — App Shell & Performance](#11-phase-8--app-shell--performance)
12. [Complete File Map](#12-complete-file-map)
13. [Package Installation Reference](#13-package-installation-reference)
14. [Testing & Auditing](#14-testing--auditing)
15. [Deployment Considerations](#15-deployment-considerations)

---

## 1. What PWA Means for GoFinder

GoFinder targets students who search for housing primarily on their phones. A PWA bridges the gap between a website and a native app without app store friction:

| Feature | Value for GoFinder users |
|---|---|
| **Installable** | Students tap "Add to Home Screen" — the app lives on their phone like a native app |
| **Offline browsing** | Previously viewed listings load without internet (important on campus Wi-Fi dead zones) |
| **Push notifications** | Instant alerts for new messages from landlords, booking confirmations, roommate requests |
| **Background sync** | A booking request submitted with bad signal is queued and sent automatically when signal returns |
| **Fast repeat loads** | The app shell (nav, layout, fonts) loads from cache — no waiting for a JS bundle download |
| **Fullscreen mode** | No browser chrome in standalone mode — feels native on mobile |

---

## 2. Technology Decisions

### 2.1 Service Worker Library — Serwist

**Do NOT use `next-pwa` (shadowwalker version)** — it is unmaintained and broken with Next.js App Router.

Use **`serwist`** — the actively maintained Workbox successor with first-class Next.js 16 App Router support.

```
@serwist/next          — Next.js plugin (wraps serwist + next config)
serwist                — Core service worker runtime (runs inside sw.ts)
```

Serwist is a fork/successor of `workbox` with a cleaner API, full TypeScript support, and explicit App Router compatibility.

### 2.2 Push Notifications — Web Push + VAPID

The **Web Push Protocol** is the browser standard. It requires:
- **VAPID keys** (Voluntary Application Server Identification) — a public/private key pair that identifies your server to the push gateway (FCM/APNS/Mozilla Push)
- **`web-push`** npm package on the NestJS backend — handles the VAPID signing and push delivery

**No Firebase, no third-party service is required.** All major browsers support the standard Web Push API.

### 2.3 Offline Storage — IndexedDB via `idb`

`localStorage` is synchronous and size-limited (5MB). Service workers cannot use it.  
**IndexedDB** is the correct storage for PWAs — async, large capacity (hundreds of MB), accessible from both the page and the service worker.

Use the **`idb`** library — a tiny promise-based wrapper around the raw IndexedDB API.

### 2.4 Background Sync — Serwist BackgroundSync

Serwist includes a `BackgroundSync` plugin that hooks into the **Background Sync Web API**. When a network request fails (offline), it queues the request in IndexedDB and replays it automatically when connectivity returns.

---

## 3. Architecture Overview

```
apps/dashboard/
├── app/
│   ├── manifest.ts                  ← Dynamic Web App Manifest (Next.js route)
│   ├── offline/page.tsx             ← Offline fallback page
│   └── layout.tsx                   ← Register SW + install prompt provider
│
├── src/
│   ├── components/
│   │   ├── pwa/
│   │   │   ├── ServiceWorkerRegister.tsx   ← Client component: register SW
│   │   │   ├── InstallPrompt.tsx           ← Client component: A2HS banner
│   │   │   └── PushNotificationToggle.tsx  ← Client component: subscribe/unsub
│   │   └── ...
│   ├── hooks/
│   │   ├── useInstallPrompt.ts      ← beforeinstallprompt event hook
│   │   └── usePushSubscription.ts   ← Push subscription lifecycle hook
│   └── lib/
│       ├── idb.ts                   ← IndexedDB store setup (idb)
│       └── push.ts                  ← Push subscription helpers
│
├── public/
│   └── sw.ts                        ← Service Worker entry (compiled by serwist)
│
└── next.config.ts                   ← withSerwist() wrapper

apps/backend/src/
├── notifications/
│   ├── notifications.module.ts
│   ├── notifications.controller.ts  ← POST /subscribe, DELETE /subscribe
│   ├── notifications.service.ts     ← send(), broadcast(), VAPID setup
│   └── dto/
│       ├── subscribe.dto.ts
│       └── send-notification.dto.ts
└── ...
```

**Data flow for push notifications:**

```
Browser                          NestJS Backend
  │                                    │
  │── POST /api/notifications/subscribe ──▶ Store PushSubscription in DB
  │                                    │
  │  (User gets a new message)         │
  │◀── Web Push Delivery ──────────────│── web-push.sendNotification()
  │                                    │      │
  │  ServiceWorker.push event          │   VAPID-signed request to
  │  → show notification               │   browser push gateway (FCM)
```

---

## 4. Phase 1 — Web App Manifest & Identity

The Web App Manifest is a JSON file that tells the browser the app's name, icons, colors, and how it should behave when installed.

### 4.1 Dynamic Manifest via Next.js Route Handler

Next.js 13+ supports generating the manifest from a route file, which allows dynamic values.

**File: `apps/dashboard/app/manifest.ts`**

```typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GIGS Rentals",
    short_name: "GIGS",
    description: "Find student housing, list properties, connect with roommates",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#22c55e",
    categories: ["lifestyle", "shopping", "utilities"],
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      // "any" purpose variant for browser chrome (non-masked)
      {
        src: "/icons/icon-192x192-any.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512-any.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile-home.png",
        sizes: "390x844",
        type: "image/png",
        // @ts-expect-error — form_factor is valid but not yet in TS types
        form_factor: "narrow",
        label: "Browse listings on mobile",
      },
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1280x720",
        type: "image/png",
        // @ts-expect-error
        form_factor: "wide",
        label: "GoFinder dashboard on desktop",
      },
    ],
    shortcuts: [
      {
        name: "Browse Listings",
        short_name: "Listings",
        description: "Search for student housing near you",
        url: "/listings",
        icons: [{ src: "/icons/shortcut-listings.png", sizes: "96x96" }],
      },
      {
        name: "Find Roommates",
        short_name: "Roommates",
        description: "Connect with compatible roommates",
        url: "/roommates",
        icons: [{ src: "/icons/shortcut-roommates.png", sizes: "96x96" }],
      },
      {
        name: "My Bookings",
        short_name: "Bookings",
        description: "View your booking requests",
        url: "/user/bookings",
        icons: [{ src: "/icons/shortcut-bookings.png", sizes: "96x96" }],
      },
    ],
    prefer_related_applications: false,
  };
}
```

### 4.2 Required Icon Sizes

Generate all of the following from the master GIGS logo SVG. Tools: **PWA Asset Generator** (`npx pwa-asset-generator logo.svg ./public/icons`) or **RealFaviconGenerator.net**.

- `72×72`, `96×96`, `128×128`, `192×192`, `384×384`, `512×512` — `maskable` purpose (safe zone)  
- `192×192`, `512×512` — `any` purpose (unmasked, full bleed)  
- `180×180` — `apple-touch-icon` (iOS Safari)  
- `shortcut-listings.png`, `shortcut-roommates.png`, `shortcut-bookings.png` — `96×96` monochrome

### 4.3 Update `app/layout.tsx` — Add PWA Meta Tags

The existing `layout.tsx` already has `theme-color`. Extend it:

```typescript
export const metadata: Metadata = {
  title: "GIGS Rentals - Student Housing Platform",
  description: "Find your perfect student housing, list properties, connect with roommates",
  manifest: "/manifest.webmanifest",   // Next.js auto-handles app/manifest.ts
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GIGS Rentals",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "GIGS Rentals",
    title: "GIGS Rentals - Student Housing Platform",
    description: "Find your perfect student housing",
  },
};
```

Add these to the `<head>` in `layout.tsx`:

```html
<!-- iOS specific -->
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="GIGS Rentals" />

<!-- Splash screens for iOS (optional but polished) -->
<link rel="apple-touch-startup-image" href="/splash/iphone-se.png" 
  media="(device-width: 375px) and (device-height: 667px)" />

<!-- Microsoft Tiles -->
<meta name="msapplication-TileColor" content="#22c55e" />
<meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
```

---

## 5. Phase 2 — Service Worker & Caching Strategies

### 5.1 Install and Configure Serwist

```bash
# In apps/dashboard
npm install @serwist/next serwist
npm install --save-dev @serwist/build
```

**File: `apps/dashboard/next.config.ts`**

```typescript
import type { NextConfig } from "next";
import withSerwist from "@serwist/next";

const nextConfig: NextConfig = {
  // your existing config
};

export default withSerwist({
  swSrc: "src/sw.ts",           // your source service worker
  swDest: "public/sw.js",       // compiled output (gitignore this)
  reloadOnOnline: true,          // reload page when connectivity restored
  disable: process.env.NODE_ENV === "development", // disable in dev to avoid caching issues
})(nextConfig);
```

> **Note:** Add `public/sw.js` and `public/sw.js.map` to `.gitignore` — they are build artifacts.

### 5.2 Service Worker Entry File

**File: `apps/dashboard/src/sw.ts`**

```typescript
import {
  defaultCache,
  NEXT_DATA_URL_SUFFIX,
} from "@serwist/next/worker";
import {
  BackgroundSyncPlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
  Serwist,
  CacheableResponsePlugin,
} from "serwist";

// Serwist injects the precache manifest here at build time
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,   // injected by @serwist/next
  skipWaiting: true,                      // new SW takes over immediately
  clientsClaim: true,                     // claim all open clients on activate
  navigationPreload: true,                // use Navigation Preload API for faster navigations
  runtimeCaching: [
    // ─── 1. Next.js static assets (JS, CSS chunks) ──────────────────────────
    // These are content-hashed; safe to cache forever.
    {
      matcher: /\/_next\/static\/.*/i,
      handler: new CacheFirst({
        cacheName: "next-static",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 365 * 24 * 60 * 60 }),
        ],
      }),
    },

    // ─── 2. Next.js image optimization ──────────────────────────────────────
    {
      matcher: /\/_next\/image\?.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 128, maxAgeSeconds: 30 * 24 * 60 * 60 }),
        ],
      }),
    },

    // ─── 3. External fonts (Google, Fontshare) ───────────────────────────────
    {
      matcher: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 }),
        ],
      }),
    },
    {
      matcher: /^https:\/\/api\.fontshare\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "fontshare",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 }),
        ],
      }),
    },

    // ─── 4. Listing photos (Cloudinary / CDN images) ─────────────────────────
    // Show stale images immediately, revalidate in background.
    {
      matcher: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: new StaleWhileRevalidate({
        cacheName: "listing-images",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 256,
            maxAgeSeconds: 7 * 24 * 60 * 60,   // 1 week
          }),
        ],
      }),
    },

    // ─── 5. API: Listings list & detail ──────────────────────────────────────
    // NetworkFirst: always try fresh data, fall back to cache if offline.
    {
      matcher: /\/api\/listings.*/i,
      handler: new NetworkFirst({
        cacheName: "api-listings",
        networkTimeoutSeconds: 10,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60,   // 1 day
          }),
        ],
      }),
    },

    // ─── 6. API: Roommates ────────────────────────────────────────────────────
    {
      matcher: /\/api\/roommates.*/i,
      handler: new NetworkFirst({
        cacheName: "api-roommates",
        networkTimeoutSeconds: 10,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      }),
    },

    // ─── 7. API: Messages — NetworkOnly (never stale) ────────────────────────
    {
      matcher: /\/api\/messages.*/i,
      handler: new NetworkOnly(),
    },

    // ─── 8. API: Bookings — NetworkOnly (financial data must be fresh) ───────
    {
      matcher: /\/api\/bookings.*/i,
      handler: new NetworkOnly({
        plugins: [
          new BackgroundSyncPlugin("bookings-queue", {
            maxRetentionTime: 24 * 60,   // retry for up to 24 hours
          }),
        ],
      }),
    },

    // ─── 9. Mapbox GL tiles ──────────────────────────────────────────────────
    {
      matcher: /^https:\/\/api\.mapbox\.com\/.*/i,
      handler: new NetworkFirst({
        cacheName: "mapbox",
        networkTimeoutSeconds: 5,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          }),
        ],
      }),
    },

    // ─── 10. Next.js RSC payloads ────────────────────────────────────────────
    ...defaultCache,
  ],
});

serwist.addEventListeners();

// ── Push notification handler ────────────────────────────────────────────────
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  const data = event.data.json() as {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    url?: string;
    tag?: string;
    data?: Record<string, unknown>;
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon ?? "/icons/icon-192x192.png",
      badge: data.badge ?? "/icons/badge-72x72.png",
      tag: data.tag ?? "gigs-notification",
      data: { url: data.url ?? "/", ...data.data },
      actions: [
        { action: "open", title: "View" },
        { action: "dismiss", title: "Dismiss" },
      ],
    })
  );
});

// ── Notification click handler ────────────────────────────────────────────────
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url: string = (event.notification.data?.url as string) ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // If the app is already open, focus it and navigate
      const existingClient = clients.find((c) => c.url.includes(self.location.origin));
      if (existingClient) {
        existingClient.focus();
        existingClient.postMessage({ type: "NAVIGATE", url });
        return;
      }
      // Otherwise open a new window
      return self.clients.openWindow(url);
    })
  );
});

// ── Background sync fallback (manual replay) ─────────────────────────────────
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "bookings-queue") {
    // Serwist BackgroundSyncPlugin handles replaying automatically.
    // This block is for any custom sync logic you want to add.
    console.log("[SW] Replaying queued booking requests");
  }
});
```

### 5.3 Register Service Worker in the App

**File: `apps/dashboard/src/components/pwa/ServiceWorkerRegister.tsx`**

```typescript
"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("[SW] Registered, scope:", registration.scope);

        // Listen for messages from the service worker (e.g., NAVIGATE)
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data?.type === "NAVIGATE") {
            window.location.href = event.data.url as string;
          }
        });
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
      });
  }, []);

  return null;   // renders nothing — side-effect only
}
```

Add to `app/layout.tsx`:

```typescript
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

// Inside <body>:
<ServiceWorkerRegister />
```

---

## 6. Phase 3 — Offline Experience

### 6.1 Offline Fallback Page

When a user navigates to a page that isn't in the cache and has no network, serwist falls back to `/offline`.

**File: `apps/dashboard/app/offline/page.tsx`**

```typescript
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
        <i className="ph-bold ph-wifi-slash text-4xl text-brand-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">You are offline</h1>
        <p className="mt-2 text-slate-500 max-w-xs">
          No internet connection. You can still browse listings and roommates you have viewed before.
        </p>
      </div>
      <a
        href="/"
        className="px-6 py-3 rounded-2xl bg-brand-500 text-white font-semibold text-sm active:scale-95 transition-transform"
      >
        Try again
      </a>
    </div>
  );
}
```

Register the fallback in `src/sw.ts` by adding to the serwist constructor:

```typescript
const serwist = new Serwist({
  // ...existing config...
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});
```

### 6.2 IndexedDB Store for Offline Listing Data

When a user views a listing, save it to IndexedDB so it's available offline.

**File: `apps/dashboard/src/lib/idb.ts`**

```typescript
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Listing } from "@/types/listing";

interface GoFinderDB extends DBSchema {
  listings: {
    key: string;
    value: Listing & { cachedAt: number };
    indexes: { "by-city": string };
  };
  roommates: {
    key: string;
    value: Record<string, unknown> & { cachedAt: number };
  };
  pendingActions: {
    key: string;
    value: {
      id: string;
      type: "BOOKING_REQUEST" | "CONTACT_HOST" | "ROOMMATE_JOIN";
      payload: unknown;
      createdAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<GoFinderDB>> | null = null;

export function getDB() {
  if (typeof window === "undefined") throw new Error("IndexedDB is only available in the browser");

  if (!dbPromise) {
    dbPromise = openDB<GoFinderDB>("gigs-db", 1, {
      upgrade(db) {
        const listingStore = db.createObjectStore("listings", { keyPath: "id" });
        listingStore.createIndex("by-city", "address.city");

        db.createObjectStore("roommates", { keyPath: "id" });
        db.createObjectStore("pendingActions", { keyPath: "id" });
      },
    });
  }

  return dbPromise;
}

// ── Listing helpers ───────────────────────────────────────────────────────────

export async function cacheListing(listing: Listing) {
  const db = await getDB();
  await db.put("listings", { ...listing, cachedAt: Date.now() });
}

export async function getCachedListing(id: string) {
  const db = await getDB();
  return db.get("listings", id);
}

export async function getCachedListings(): Promise<Listing[]> {
  const db = await getDB();
  const all = await db.getAll("listings");
  // Return only listings cached within the last 7 days
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return all.filter((l) => l.cachedAt > cutoff);
}

// ── Pending action helpers ────────────────────────────────────────────────────

export async function queueAction(
  type: GoFinderDB["pendingActions"]["value"]["type"],
  payload: unknown
) {
  const db = await getDB();
  await db.add("pendingActions", {
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: Date.now(),
  });
}

export async function getPendingActions() {
  const db = await getDB();
  return db.getAll("pendingActions");
}

export async function clearPendingAction(id: string) {
  const db = await getDB();
  await db.delete("pendingActions", id);
}
```

### 6.3 Cache Listing on View

In the listing detail page (`app/listings/[id]/page.tsx`), add a `useEffect` that writes to IndexedDB after the listing loads:

```typescript
// Inside the listing detail client component
import { cacheListing } from "@/lib/idb";

useEffect(() => {
  if (listing) {
    cacheListing(listing).catch(console.error);
  }
}, [listing]);
```

### 6.4 Offline-Aware Listings Page

If the user is offline and tries to visit `/listings`, show cached listings instead of an error:

```typescript
import { useEffect, useState } from "react";
import { getCachedListings } from "@/lib/idb";

function useOfflineListings() {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedListings, setCachedListings] = useState<Listing[]>([]);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      getCachedListings().then(setCachedListings).catch(console.error);
    }
  }, [isOnline]);

  return { isOnline, cachedListings };
}
```

---

## 7. Phase 4 — Push Notifications (Frontend)

### 7.1 Push Subscription Hook

**File: `apps/dashboard/src/hooks/usePushSubscription.ts`**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

type SubscriptionState = "idle" | "loading" | "subscribed" | "denied" | "unsupported";

export function usePushSubscription() {
  const [state, setState] = useState<SubscriptionState>("idle");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }

    // Check current permission and existing subscription
    navigator.serviceWorker.ready.then(async (reg) => {
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        setSubscription(existing);
        setState("subscribed");
      } else if (Notification.permission === "denied") {
        setState("denied");
      }
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return;
    setState("loading");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,    // required by Chrome — all pushes must show a notification
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send subscription to our NestJS backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
        credentials: "include",
      });

      setSubscription(sub);
      setState("subscribed");
    } catch (err) {
      console.error("[Push] Subscribe failed:", err);
      setState("idle");
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    setState("loading");

    try {
      await subscription.unsubscribe();

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
        credentials: "include",
      });

      setSubscription(null);
      setState("idle");
    } catch (err) {
      console.error("[Push] Unsubscribe failed:", err);
      setState("subscribed");
    }
  }, [subscription]);

  return { state, subscription, subscribe, unsubscribe };
}
```

### 7.2 Push Notification Toggle Component

**File: `apps/dashboard/src/components/pwa/PushNotificationToggle.tsx`**

```typescript
"use client";

import { usePushSubscription } from "@/hooks/usePushSubscription";

export function PushNotificationToggle() {
  const { state, subscribe, unsubscribe } = usePushSubscription();

  if (state === "unsupported") return null;

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">Push Notifications</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {state === "denied"
            ? "Blocked in browser settings"
            : state === "subscribed"
            ? "You'll be notified about messages and bookings"
            : "Get notified about messages and bookings"}
        </p>
      </div>

      <button
        onClick={state === "subscribed" ? unsubscribe : subscribe}
        disabled={state === "loading" || state === "denied"}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          state === "subscribed" ? "bg-brand-500" : "bg-slate-200"
        } disabled:opacity-50`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            state === "subscribed" ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
```

Place this component in `app/user/settings/page.tsx` under a "Notifications" section.

### 7.3 Required Environment Variable

Add to `apps/dashboard/.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your_vapid_public_key>
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 8. Phase 5 — Push Notifications (NestJS Backend)

This is the backend side. The NestJS app handles storing subscriptions, generating VAPID keys, and sending pushes when events occur.

### 8.1 Install Dependencies

```bash
# In apps/backend
npm install web-push
npm install --save-dev @types/web-push
```

### 8.2 Generate VAPID Keys

Run this **once** to generate your key pair. Store them as environment variables — never commit them.

```bash
npx web-push generate-vapid-keys
```

Output:
```
Public Key: BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ
Private Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Add to `apps/backend/.env`:

```env
VAPID_PUBLIC_KEY=BxxxxQ
VAPID_PRIVATE_KEY=xxxx
VAPID_SUBJECT=mailto:admin@gigsrentals.com
PORT=3000
```

### 8.3 Push Subscription DTO

**File: `apps/backend/src/notifications/dto/subscribe.dto.ts`**

```typescript
export class SubscribeDto {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}
```

### 8.4 Notifications Service

**File: `apps/backend/src/notifications/notifications.service.ts`**

```typescript
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import * as webpush from "web-push";
import { SubscribeDto } from "./dto/subscribe.dto";

interface StoredSubscription {
  userId?: string;
  subscription: webpush.PushSubscription;
  createdAt: Date;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);

  // In-memory store for now — replace with a database table when the DB is wired up
  private subscriptions = new Map<string, StoredSubscription>();

  onModuleInit() {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
    this.logger.log("VAPID keys configured");
  }

  getVapidPublicKey(): string {
    return process.env.VAPID_PUBLIC_KEY!;
  }

  addSubscription(dto: SubscribeDto, userId?: string): void {
    this.subscriptions.set(dto.endpoint, {
      userId,
      subscription: {
        endpoint: dto.endpoint,
        expirationTime: dto.expirationTime,
        keys: dto.keys,
      },
      createdAt: new Date(),
    });
    this.logger.log(`Subscription added: ${dto.endpoint.slice(-20)}`);
  }

  removeSubscription(endpoint: string): void {
    this.subscriptions.delete(endpoint);
    this.logger.log(`Subscription removed: ${endpoint.slice(-20)}`);
  }

  async sendToEndpoint(
    endpoint: string,
    payload: {
      title: string;
      body: string;
      icon?: string;
      url?: string;
      tag?: string;
      data?: Record<string, unknown>;
    },
  ): Promise<void> {
    const stored = this.subscriptions.get(endpoint);
    if (!stored) return;

    try {
      await webpush.sendNotification(
        stored.subscription,
        JSON.stringify(payload),
        { TTL: 86400 },   // 24 hours — if device is offline, retry for 24h
      );
    } catch (err: unknown) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      if (statusCode === 404 || statusCode === 410) {
        // Subscription expired or unsubscribed — clean up
        this.subscriptions.delete(endpoint);
        this.logger.warn(`Cleaned up expired subscription: ${endpoint.slice(-20)}`);
      } else {
        this.logger.error("Push send failed:", err);
      }
    }
  }

  async sendToUser(
    userId: string,
    payload: Parameters<typeof this.sendToEndpoint>[1],
  ): Promise<void> {
    const userSubs = [...this.subscriptions.values()].filter((s) => s.userId === userId);
    await Promise.allSettled(
      userSubs.map((s) => this.sendToEndpoint(s.subscription.endpoint, payload)),
    );
  }

  async broadcast(payload: Parameters<typeof this.sendToEndpoint>[1]): Promise<void> {
    const endpoints = [...this.subscriptions.keys()];
    this.logger.log(`Broadcasting to ${endpoints.length} subscriptions`);
    await Promise.allSettled(endpoints.map((ep) => this.sendToEndpoint(ep, payload)));
  }
}
```

### 8.5 Notifications Controller

**File: `apps/backend/src/notifications/notifications.controller.ts`**

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { SubscribeDto } from "./dto/subscribe.dto";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // The frontend needs the VAPID public key to subscribe
  @Get("vapid-public-key")
  getVapidPublicKey() {
    return { publicKey: this.notificationsService.getVapidPublicKey() };
  }

  // Called by the frontend when the user grants notification permission
  @Post("subscribe")
  @HttpCode(HttpStatus.CREATED)
  subscribe(@Body() body: SubscribeDto) {
    // TODO: extract userId from JWT once auth is wired up
    this.notificationsService.addSubscription(body, undefined);
    return { ok: true };
  }

  // Called when the user revokes permission or logs out
  @Delete("subscribe")
  @HttpCode(HttpStatus.NO_CONTENT)
  unsubscribe(@Body() body: { endpoint: string }) {
    this.notificationsService.removeSubscription(body.endpoint);
  }

  // Temporary dev/test endpoint — remove before production
  @Post("test-send")
  async testSend(@Body() body: { endpoint: string }) {
    await this.notificationsService.sendToEndpoint(body.endpoint, {
      title: "Test Notification",
      body: "GoFinder PWA push is working!",
      icon: "/icons/icon-192x192.png",
      url: "/",
      tag: "test",
    });
    return { ok: true };
  }
}
```

### 8.6 Notifications Module

**File: `apps/backend/src/notifications/notifications.module.ts`**

```typescript
import { Module } from "@nestjs/common";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],   // export so other modules can inject it
})
export class NotificationsModule {}
```

Register in `app.module.ts`:

```typescript
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [NotificationsModule],
  // ...
})
export class AppModule {}
```

### 8.7 Enable CORS in `main.ts`

The dashboard (port 3001) needs to call the backend (port 3000):

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3001",       // dashboard dev
      "https://app.gigsrentals.com", // dashboard production
    ],
    credentials: true,
  });

  app.setGlobalPrefix("api");   // all routes become /api/...

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 8.8 Triggering Notifications from Other Services

Once the full API is built out, inject `NotificationsService` into any module to send pushes:

```typescript
// Example: inside MessagesService (future)
constructor(
  private readonly notificationsService: NotificationsService,
) {}

async sendMessage(toUserId: string, fromName: string, preview: string) {
  // ...save message to DB...

  await this.notificationsService.sendToUser(toUserId, {
    title: `New message from ${fromName}`,
    body: preview,
    icon: "/icons/icon-192x192.png",
    url: "/user/messages",
    tag: `message-${toUserId}`,
  });
}
```

The `tag` field is important — it groups notifications so a flood of messages shows as one grouped notification instead of 20 separate alerts.

---

## 9. Phase 6 — Background Sync

Background Sync is already wired into `src/sw.ts` via `BackgroundSyncPlugin` on the bookings route handler. This section explains the full flow and the frontend integration.

### 9.1 How It Works

1. User submits a booking request while offline.
2. `fetch()` to `/api/bookings` fails (network error).
3. Serwist `BackgroundSyncPlugin` catches the failure and saves the request to IndexedDB (`workbox-background-sync` store).
4. When connectivity returns, the browser triggers a `sync` event.
5. The plugin replays all queued requests automatically — no user action needed.

### 9.2 Offline Queue Feedback

Give the user visual feedback when they submit a form offline:

```typescript
"use client";

import { useState } from "react";
import { queueAction } from "@/lib/idb";

export function BookingRequestButton({ listingId }: { listingId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "queued" | "sent">("idle");

  const handleSubmit = async () => {
    setStatus("loading");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        throw new Error("Server error");
      }
    } catch {
      if (!navigator.onLine) {
        // Save to IndexedDB for manual retry display
        await queueAction("BOOKING_REQUEST", { listingId });
        setStatus("queued");
        // The BackgroundSyncPlugin will actually replay the fetch automatically
      } else {
        setStatus("idle");
      }
    }
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={status === "loading"}>
        {status === "queued" ? "Queued — will send when online" : "Request Booking"}
      </button>
      {status === "queued" && (
        <p className="text-xs text-amber-600 mt-1">
          Your request is saved and will be sent automatically when you reconnect.
        </p>
      )}
    </div>
  );
}
```

---

## 10. Phase 7 — Install UX (Add to Home Screen)

### 10.1 Install Prompt Hook

**File: `apps/dashboard/src/hooks/useInstallPrompt.ts`**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [outcome, setOutcome] = useState<"accepted" | "dismissed" | null>(null);

  useEffect(() => {
    // Already installed (standalone or fullscreen)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();   // prevent the browser's mini-infobar
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setPromptEvent(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const prompt = useCallback(async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome: result } = await promptEvent.userChoice;
    setOutcome(result);
    setPromptEvent(null);
  }, [promptEvent]);

  const canInstall = !!promptEvent && !isInstalled;

  return { canInstall, isInstalled, outcome, prompt };
}
```

### 10.2 Install Banner Component

Show this non-intrusively at the bottom of the screen (above the BottomTabNav) after the user has been active for ~30 seconds:

**File: `apps/dashboard/src/components/pwa/InstallPrompt.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallPrompt() {
  const { canInstall, prompt, outcome } = useInstallPrompt();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if user already dismissed in this session
    const wasDismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) return;

    // Show after 30 seconds of activity
    const timer = setTimeout(() => {
      if (canInstall) setVisible(true);
    }, 30_000);

    return () => clearTimeout(timer);
  }, [canInstall]);

  // Hide once user accepts or we have an outcome
  useEffect(() => {
    if (outcome) setVisible(false);
  }, [outcome]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-install-dismissed", "1");
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-center gap-3">
        <img src="/icons/icon-72x72.png" alt="GIGS" className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 leading-tight">Add GIGS to your phone</p>
          <p className="text-xs text-slate-500 mt-0.5">Faster access, works offline</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Not now
          </button>
          <button
            onClick={prompt}
            className="text-xs font-semibold bg-brand-500 text-white px-3 py-1.5 rounded-xl"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
```

Add `<InstallPrompt />` to `app/layout.tsx`.

---

## 11. Phase 8 — App Shell & Performance

### 11.1 What is the App Shell

The "app shell" is the minimal HTML/CSS/JS needed to render the UI skeleton — header, nav, sidebar — without waiting for data. Serwist precaches this automatically from `self.__SW_MANIFEST`.

The current layout structure (header + sidebar + bottom nav) is already a good app shell pattern. Ensure the following are part of the precache:
- `app/layout.tsx` → compiled HTML
- All route pages (precached as RSC payloads)
- Fonts (handled by the `CacheFirst` font rule in `sw.ts`)

### 11.2 Loading Skeleton While Data Fetches

Ensure every data-fetching page has a `loading.tsx` sibling:

```typescript
// app/listings/loading.tsx
export default function ListingsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-64" />
      ))}
    </div>
  );
}
```

This renders instantly from the precached shell while fresh data loads.

### 11.3 `display-mode` Detection

Some UI should behave differently in standalone mode (e.g., hide the browser back button affordance, show a custom header back button):

```typescript
function useIsStandalone() {
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    setStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);
  return standalone;
}
```

---

## 12. Complete File Map

### Files to Create

```
apps/dashboard/
├── app/
│   ├── manifest.ts                              NEW
│   └── offline/
│       └── page.tsx                             NEW
│
├── src/
│   ├── components/pwa/
│   │   ├── ServiceWorkerRegister.tsx            NEW
│   │   ├── InstallPrompt.tsx                    NEW
│   │   └── PushNotificationToggle.tsx           NEW
│   ├── hooks/
│   │   ├── useInstallPrompt.ts                  NEW
│   │   └── usePushSubscription.ts               NEW
│   └── lib/
│       └── idb.ts                               NEW
│
├── public/
│   ├── icons/                                   NEW (all icon files)
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-192x192.png
│   │   ├── icon-192x192-any.png
│   │   ├── icon-384x384.png
│   │   ├── icon-512x512.png
│   │   ├── icon-512x512-any.png
│   │   ├── apple-touch-icon.png                 (180×180)
│   │   ├── badge-72x72.png                      (monochrome, for notification badge)
│   │   ├── shortcut-listings.png
│   │   ├── shortcut-roommates.png
│   │   └── shortcut-bookings.png
│   └── screenshots/                             NEW (for install dialog)
│       ├── mobile-home.png
│       └── desktop-home.png
│
└── src/sw.ts                                    NEW (compiled to public/sw.js)

apps/backend/src/
└── notifications/
    ├── notifications.module.ts                  NEW
    ├── notifications.controller.ts              NEW
    ├── notifications.service.ts                 NEW
    └── dto/
        └── subscribe.dto.ts                     NEW
```

### Files to Modify

```
apps/dashboard/
├── next.config.ts                               MODIFY (add withSerwist)
├── app/layout.tsx                               MODIFY (add meta tags, SW register, install prompt)
├── .gitignore                                   MODIFY (add public/sw.js, public/sw.js.map)
└── .env.local                                   MODIFY (add NEXT_PUBLIC_VAPID_PUBLIC_KEY)

apps/backend/src/
├── main.ts                                      MODIFY (add CORS, global prefix)
├── app.module.ts                                MODIFY (import NotificationsModule)
└── .env                                         MODIFY (add VAPID keys)
```

---

## 13. Package Installation Reference

### Dashboard (`apps/dashboard`)

```bash
npm install @serwist/next serwist idb
npm install --save-dev @serwist/build
```

### Backend (`apps/backend`)

```bash
npm install web-push
npm install --save-dev @types/web-push
```

---

## 14. Testing & Auditing

### 14.1 Lighthouse PWA Audit

In Chrome DevTools → Lighthouse → Progressive Web App:

**Must-pass checks:**
- ✓ Registers a service worker
- ✓ Responds with 200 when offline
- ✓ Has a `<meta name="viewport">` with `width` or `initial-scale`
- ✓ Web app manifest meets installability requirements
- ✓ Provides valid `apple-touch-icon`
- ✓ Provides a valid `manifest.webmanifest`
- ✓ `start_url` responds with 200 while offline
- ✓ `theme_color` matches meta theme-color

### 14.2 DevTools Service Worker Tab

Chrome → DevTools → Application → Service Workers:
- Verify the SW is registered and shows "activated and running"
- Use "Offline" checkbox to test offline behavior
- Use "Update on reload" during development

### 14.3 DevTools Cache Storage

Chrome → DevTools → Application → Cache Storage:
- Verify `next-static`, `next-image`, `api-listings`, `google-fonts` caches exist after first load
- Inspect cached entries for each cache

### 14.4 DevTools IndexedDB

Chrome → DevTools → Application → IndexedDB → gigs-db:
- After viewing a listing, verify it appears in the `listings` object store

### 14.5 Push Notification Testing

```bash
# Test from the backend (once wired up)
curl -X POST http://localhost:3000/api/notifications/test-send \
  -H "Content-Type: application/json" \
  -d '{"endpoint": "<paste endpoint from browser devtools>"}'
```

The endpoint can be found in: DevTools → Application → Service Workers → Push.

### 14.6 Background Sync Testing

1. Open DevTools → Application → Service Workers → check "Offline"
2. Submit a booking request — it should show "Queued"
3. DevTools → Application → IndexedDB → `workbox-background-sync` → verify the request is there
4. Uncheck "Offline" — watch the Network tab for the replayed request

---

## 15. Deployment Considerations

### 15.1 HTTPS is Mandatory

Service workers and Push notifications only work on HTTPS (or `localhost` for development). Vercel, Netlify, and Railway all provide HTTPS by default.

### 15.2 Environment Variables

| Variable | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | dashboard `.env.local` / Vercel env | From `npx web-push generate-vapid-keys` |
| `NEXT_PUBLIC_API_URL` | dashboard `.env.local` / Vercel env | `https://api.gigsrentals.com` |
| `VAPID_PUBLIC_KEY` | backend `.env` / Railway env | Same public key |
| `VAPID_PRIVATE_KEY` | backend `.env` / Railway env | Private key (secret, never expose) |
| `VAPID_SUBJECT` | backend `.env` / Railway env | `mailto:admin@gigsrentals.com` |

### 15.3 `public/sw.js` Must Be Served at Root

Serwist compiles `src/sw.ts` → `public/sw.js`. Next.js serves everything in `public/` from the root. The SW's scope covers `/` by default.

The compiled `public/sw.js` should be in `.gitignore` but must be included in your CI build output (it is generated by `next build`).

### 15.4 Service Worker Scope

The SW registers at scope `/`. If the dashboard is deployed at a subpath (e.g., `/app`), change the scope:

```typescript
navigator.serviceWorker.register("/app/sw.js", { scope: "/app/" });
```

And update `next.config.ts` accordingly.

### 15.5 Push Subscription Persistence

The current `NotificationsService` stores subscriptions in-memory. **This is only suitable for development.** Before production, subscriptions must be persisted to the database (PostgreSQL/MongoDB). Create a `PushSubscription` entity with:

- `id` (UUID)
- `userId` (foreign key to Users — nullable for unauthenticated)
- `endpoint` (string, unique)
- `p256dh` (string)
- `auth` (string)
- `expirationTime` (bigint, nullable)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

---

## Implementation Order

Follow this sequence to avoid blockers:

```
Week 1 — Foundation
  [1] Generate app icons (all sizes)
  [2] Create app/manifest.ts
  [3] Update layout.tsx meta tags
  [4] Install @serwist/next, configure next.config.ts
  [5] Create src/sw.ts with basic precaching + caching strategies
  [6] Create ServiceWorkerRegister.tsx, add to layout
  [7] Create app/offline/page.tsx
  [8] Lighthouse audit — target 100 PWA score

Week 2 — Offline & Data
  [9]  Install idb, create src/lib/idb.ts
  [10] Wire cacheListing() into listing detail page
  [11] Wire useOfflineListings() into listings page
  [12] Test offline mode in DevTools

Week 3 — Install UX
  [13] Create useInstallPrompt hook
  [14] Create InstallPrompt component
  [15] Add to layout, test on real Android device

Week 4 — Push Notifications
  [16] Install web-push in backend
  [17] Generate VAPID keys, store in .env
  [18] Create NotificationsModule (service, controller, DTOs)
  [19] Update main.ts (CORS + global prefix)
  [20] Register NotificationsModule in AppModule
  [21] Create usePushSubscription hook
  [22] Create PushNotificationToggle component
  [23] Add to user/settings/page.tsx
  [24] End-to-end push test

Week 5 — Background Sync & Polish
  [25] Wire BackgroundSyncPlugin for bookings
  [26] Add offline feedback UI to booking forms
  [27] Test background sync flow in DevTools
  [28] Final Lighthouse audit — verify all PWA checks pass
```
