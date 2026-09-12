# Ivy Homes Property Portal & Analytics — Mumbai Region

> **Ivy Homes Software Engineering Internship Assignment (September 2026)**
> **Candidate**: Arsh Sharma  
> **Assigned City**: Mumbai  
> **Assigned Locality**: Powai  
> **API Key**: `IVY26-AC068556E03E`  
> **Reference Timestamp**: `2026-09-10T00:00:00+05:30` (IST)  
> **Repository**: [https://github.com/arshnesss/Ivy-Homes-App](https://github.com/arshnesss/Ivy-Homes-App)  

---

## 🚀 How to Run the Web Application

### Prerequisites
- **Node.js**: v18+ (Tested on v23.8.0)
- **npm**: v9+ (Tested on v11.2.0)

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```
The application will start locally at `http://localhost:3000`.

### Building for Production
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Demo Credentials

Use any of the three pre-configured demo user accounts to log in (password is identical for all):
- `demo1@ivy.homes` / `c7c1305e70`
- `demo2@ivy.homes` / `c7c1305e70`
- `demo3@ivy.homes` / `c7c1305e70`

---

## 🕵️ Detective Methodology: Formulating & Testing Data Hypotheses

The actual backend API is truthful, healthy, and consistent, but the provided `API_REFERENCE.md` document contained deliberate errors, outdated schemas, ignored parameters, and missing endpoints. 

Rather than relying on documentation claims, we used a systematic hypothesis-driven empirical probing workflow:

### Key Discrepancies Discovered & Verified

1. **Authentication Headers (`auth`)**:
   - *Doc Claim*: Pass API key as query parameter `?api_key=IVY26-XXXXXXXXXXXX`.
   - *Actual API*: Query param returns HTTP 401 (`send your key in the X-API-Key request header, not as a query parameter`). All data endpoints also require `Authorization: Bearer <access_token>`.
2. **Token Expiration & Refresh (`auth`)**:
   - *Doc Claim*: Tokens expire in 24 hours (`86400`s) and no refresh flow exists.
   - *Actual API*: Tokens expire in 15 minutes (`900`s), and response returns `refresh_token` and `refresh_url: "/auth/refresh"`.
3. **Pagination Envelopes (`pagination`)**:
   - *Doc Claim*: Uses 1-indexed `page` and `limit` (max 200) with envelope `{total, page, page_size, results}`.
   - *Actual API*: Uses 0-indexed `offset` and caps `limit` at 50 with envelope `{limit, offset, count, total, has_more, results}`.
4. **Envelope Count Discrepancy (`completeness`)**:
   - *Doc Claim*: Envelope `total` field reports exact retrievable records.
   - *Actual API*: Envelope `total` reports `4907` for listings, but paging offset to completion yields **4950** retrievable records.
5. **Missing Endpoints (`missing_endpoint`)**:
   - `/v1/analytics/summary` and `/v1/favourites` return `HTTP 404 Not Found`. Favourites are persisted client-side per user in `localStorage`.
6. **Ignored Project Filter (`filters`)**:
   - `GET /v1/listings?project_id=...` parameter is quietly ignored server-side. Client-side filtering was added to handle project views.
7. **Lexicographical Sort Bug (`sorting`)**:
   - `sort_by=carpet_area` performs string lexicographical sorting (`"340"` before `"32"` when ascending). Fixed via client-side numeric sort.
8. **Project Price Unit (`units`)**:
   - `price_min` and `price_max` in `/v1/projects` are in Crores of INR (`12.44` Cr), converted to `124,400,000` INR for Question 7 (`price_max_inr`).

---

## 🟢 What We Checked That Turned Out To Be Fine

A key part of technical evaluation is verifying hypotheses that did **not** pan out — confirming where the API and data behave correctly as documented:

1. **Server-side Filter Logic on `/v1/listings`**:
   - *Hypothesis*: Filters like `locality`, `bhk`, `furnishing`, `property_type`, `min_price`, and `max_price` might be ignored or buggy.
   - *Result*: **Passed**. Testing `locality=powai`, `bhk=3`, `property_type=apartment`, `furnishing=semi-furnished`, `min_price`, and `max_price` confirmed that the server correctly filters returned items and updates the `total` count.
2. **Single Listing & Detail Endpoints**:
   - *Hypothesis*: Path parameters like `GET /v1/listings/{id}` or similar listings might 404 or mismatch.
   - *Result*: **Passed**. Single listing lookups by `listing_id` and similar listings (`/v1/listings/{id}/similar`) work as documented.
3. **Contact Phone Numbers (`posted_by_contact`)**:
   - *Hypothesis*: Contact numbers might contain invalid country codes or malformed strings.
   - *Result*: **Passed**. All phone numbers follow standard Indian 10-digit formats with `+91200` prefixes.
4. **Authentication Credentials & Demo Accounts**:
   - *Hypothesis*: Demo passwords or accounts might differ per city or user.
   - *Result*: **Passed**. All three demo accounts (`demo1`, `demo2`, `demo3`) successfully log in using `c7c1305e70`.
5. **Health Endpoint (`/health`)**:
   - *Hypothesis*: `/health` clock might be out of sync or missing timezone info.
   - *Result*: **Passed**. Returns `status: ok` and server time carries an explicit `+05:30` offset.

---

## 🚀 What We Would Do With Another Two Days

If granted two additional development days, we would prioritize the following enhancements:

1. **Interactive Map View (Leaflet / Mapbox Integration)**:
   - Render all listing coordinates on an interactive Mumbai map cluster with custom price pins and locality boundary highlights (fixing swapped lat/long coordinates automatically).
2. **Server-Side Caching & Offline Sync Layer**:
   - Implement a Service Worker / IndexedDB cache to store fetched listings locally, enabling instant offline filtering and seamless background synchronization when connection drops.
3. **End-to-End Automated Testing Suite**:
   - Build a Playwright / Cypress E2E test suite to continuously validate session login, pagination boundaries, filter state transitions, and favourites persistence across browsers.
4. **Advanced Predictive Analytics Dashboard**:
   - Add interactive price trend graphs, historical valuation estimators, and neighborhood comparison matrices on the Insights screen.
