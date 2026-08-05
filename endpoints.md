# API Testing Guide (Thunder Client)

This document describes how to manually test the GoFinder REST API endpoints using Thunder Client (or any other HTTP client like Postman or Bruno).

## Base Configuration

- **Base URL**: `http://localhost:3333/api`
- **Headers**:
  - `Content-Type`: `application/json`

---

## 1. Authentication Endpoints

### 1.1 Sign Up
Create a new user account.

- **Method**: `POST`
- **URL**: `{{BaseURL}}/auth/signup`
- **Body** (JSON):
```json
{
  "email": "student@gofinder.com",
  "password": "securepassword123",
  "name": "Jane Doe",
  "phone": "+1234567890",
  "role": "renter"
}
```
- **Expected Response** (`201 Created`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string-here",
    "email": "student@gofinder.com",
    "name": "Jane Doe",
    "phone": "+1234567890",
    "role": "renter",
    "isProfileComplete": false,
    "isEmailVerified": false,
    "createdAt": "2026-08-04T12:00:00.000Z",
    "updatedAt": "2026-08-04T12:00:00.000Z"
  }
}
```

### 1.2 Login
Authenticate an existing user to receive a JWT access token.

- **Method**: `POST`
- **URL**: `{{BaseURL}}/auth/login`
- **Body** (JSON):
```json
{
  "email": "student@gofinder.com",
  "password": "securepassword123"
}
```
- **Expected Response** (`201 Created`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string-here",
    "email": "student@gofinder.com",
    "name": "Jane Doe",
    "phone": "+1234567890",
    "role": "renter",
    "isProfileComplete": false,
    "isEmailVerified": false,
    "createdAt": "2026-08-04T12:00:00.000Z",
    "updatedAt": "2026-08-04T12:00:00.000Z"
  }
}
```

> [!TIP]
> Copy the `access_token` from the login/signup response to use in the authenticated requests below.

### 1.3 Get Current User Profile
Retrieve details of the currently authenticated user.

- **Method**: `GET`
- **URL**: `{{BaseURL}}/auth/me`
- **Headers**:
  - `Authorization`: `Bearer <your_access_token>`
- **Expected Response** (`200 OK`):
```json
{
  "id": "uuid-string-here",
  "email": "student@gofinder.com",
  "name": "Jane Doe",
  "phone": "+1234567890",
  "role": "renter",
  "isProfileComplete": false,
  "isEmailVerified": false,
  "createdAt": "2026-08-04T12:00:00.000Z",
  "updatedAt": "2026-08-04T12:00:00.000Z"
}
```

---

## 2. Listings Endpoints

### 2.1 Get All Listings
Retrieve all active property listings.

- **Method**: `GET`
- **URL**: `{{BaseURL}}/listings`
- **Expected Response** (`200 OK`):
```json
[
  {
    "id": "listing-uuid-here",
    "title": "Cozy Shared Apartment near Campus",
    "description": "A spacious 2-bedroom shared living space, perfect for students.",
    "price": 450,
    "category": "accommodation",
    "type": "apartment",
    "status": "draft",
    "hostId": "uuid-string-here",
    "location": "Boston, MA",
    "images": [],
    "amenities": ["Wifi", "Laundry", "Kitchen"],
    "createdAt": "2026-08-04T12:05:00.000Z",
    "updatedAt": "2026-08-04T12:05:00.000Z",
    "host": {
      "id": "uuid-string-here",
      "name": "Jane Doe",
      "email": "student@gofinder.com",
      "avatarUrl": null
    }
  }
]
```

### 2.2 Get Listing by ID
Fetch a single listing.

- **Method**: `GET`
- **URL**: `{{BaseURL}}/listings/<listing_id>`
- **Expected Response** (`200 OK`):
```json
{
  "id": "listing-uuid-here",
  "title": "Cozy Shared Apartment near Campus",
  "description": "A spacious 2-bedroom shared living space, perfect for students.",
  "price": 450,
  "category": "accommodation",
  "type": "apartment",
  "status": "draft",
  "hostId": "uuid-string-here",
  "location": "Boston, MA",
  "images": [],
  "amenities": ["Wifi", "Laundry", "Kitchen"],
  "createdAt": "2026-08-04T12:05:00.000Z",
  "updatedAt": "2026-08-04T12:05:00.000Z",
  "host": {
    "id": "uuid-string-here",
    "name": "Jane Doe",
    "email": "student@gofinder.com",
    "avatarUrl": null
  }
}
```

### 2.3 Create Listing
Publish a new property listing (requires authentication).

- **Method**: `POST`
- **URL**: `{{BaseURL}}/listings`
- **Headers**:
  - `Authorization`: `Bearer <your_access_token>`
- **Body** (JSON):
```json
{
  "title": "Cozy Shared Apartment near Campus",
  "description": "A spacious 2-bedroom shared living space, perfect for students.",
  "price": 450,
  "category": "accommodation",
  "type": "apartment",
  "location": "Boston, MA",
  "images": [],
  "amenities": ["Wifi", "Laundry", "Kitchen"]
}
```
- **Expected Response** (`201 Created`):
```json
{
  "id": "listing-uuid-here",
  "title": "Cozy Shared Apartment near Campus",
  "description": "A spacious 2-bedroom shared living space, perfect for students.",
  "price": 450,
  "category": "accommodation",
  "type": "apartment",
  "status": "draft",
  "hostId": "uuid-string-here",
  "location": "Boston, MA",
  "images": [],
  "amenities": ["Wifi", "Laundry", "Kitchen"],
  "createdAt": "2026-08-04T12:05:00.000Z",
  "updatedAt": "2026-08-04T12:05:00.000Z"
}
```

### 2.4 Delete Listing
Delete a listing (requires ownership validation).

- **Method**: `DELETE`
- **URL**: `{{BaseURL}}/listings/<listing_id>`
- **Headers**:
  - `Authorization`: `Bearer <your_access_token>`
- **Expected Response** (`200 OK`):
```json
{
  "id": "listing-uuid-here",
  "title": "Deleted Listing",
  "hostId": "uuid-string-here"
}
```
