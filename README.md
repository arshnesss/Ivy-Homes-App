# Ivy Homes — Mumbai Real Estate Intelligence Portal & Forensic Audit

**Software Engineering Internship Assignment — September 2026**  
**Candidate**: Arsh Sharma (`arsh@mnnit.ac.in`)  
**Assigned Region**: Mumbai • **Assigned Micro-Market**: Powai  
**API Key**: `IVY26-AC068556E03E`  
**Reference Timestamp**: `2026-09-10T00:00:00+05:30` (IST)  
**Live Production Deployment**: [https://ivyhomesapp.vercel.app](https://ivyhomesapp.vercel.app)  
**GitHub Repository**: [https://github.com/arshnesss/Ivy-Homes-App](https://github.com/arshnesss/Ivy-Homes-App)  

---

## 🏛️ Executive Summary & Architecture

To address the challenges posed by real-world property aggregators and unearth inaccuracies within municipal and portal listings, I engineered a high-performance, responsive Single Page Application (SPA) backed by an empirical data forensics engine. 

### Key System Architectural Highlights:
- **Clean Two-Tier Experience**:
  - **Authentic Brand Landing Page**: A marketing experience matching Ivy Homes' actual direct-buyer model (transparent 60-day sale timeline, zero brokerage, cost of waiting absorption calculator, interactive FAQs, and high-trust social proof).
  - **Dedicated 3D Sign-In Portal**: When prospective clients or analysts click "Sign In to Portal" or the hero image, they transition to a dedicated authentication console featuring an interactive Three.js 3D architectural city skyline with realistic window lights, dynamic camera orbit, and mouse parallax.
- **Micro-Market Portal**:
  - **Full Listings Directory**: Robust client-side and server-side filtering across BHK, price ranges, property types, and furnishing status.
  - **Dedicated Property Routing**: Shareable URL hash routes (e.g. `#/listings/100-5000042`) with high-res galleries, RERA registration tags, financial calculators, and verified inspection actions.
  - **Rentals Directory**: Dedicated rental portfolio with yield estimations and Powai micro-market filters.
  - **Spatial 3D Simulation**: Interactive Three.js 3D simulation of Powai's high-rise clusters and rental yield matrices, accessible across all post-login screens.
  - **Forensic Audit & Question Analysis Hub**: In-app transparency view revealing the answers to all 10 technical audit questions with live data query cards.

---

## 💻 Quickstart & Local Verification

### Environment Requirements
- **Node.js**: v18.0.0 or later (verified on v23.8.0)
- **npm**: v9.0.0 or later (verified on v11.2.0)

```bash
# Clone the repository
git clone https://github.com/arshnesss/Ivy-Homes-App.git
cd Ivy-Homes-App

# Install dependencies
npm install

# Launch local development server
npm run dev
```
The application runs locally on `http://localhost:3000` (or `http://localhost:3002`).

### Production Build
```bash
npm run build
npm run preview
```

### Pre-Configured Demo Accounts
The portal comes equipped with 1-click role presets for instant review:
- **Portfolio Lead**: `demo1@ivy.homes` / `c7c1305e70`
- **Asset Analyst**: `demo2@ivy.homes` / `c7c1305e70`
- **Data Auditor**: `demo3@ivy.homes` / `c7c1305e70`

---

## 🕵️ Data Detective Methodology: Hypotheses Formulated & Tested

Rather than accepting the provided `API_REFERENCE.md` at face value, I conducted empirical API probing through automated scripts and network traces. I uncovered 16 discrete discrepancies where the server's real behavior diverged from the documented claims.

### Key Discrepancies Uncovered & Handled:

1. **Authentication Header Protocol (`auth`)**:
   - *Doc Claim*: Send API key in query parameter `?api_key=IVY26-XXXXXXXXXXXX`.
   - *Reality*: The backend rejects query parameters with HTTP 401 (`"send your key in the X-API-Key request header, not as a query parameter"`). All subsequent endpoints require `Authorization: Bearer <token>`.
2. **Short Token TTL & Refresh Flow (`auth`)**:
   - *Doc Claim*: Tokens expire after 24 hours (`86400`s) with no refresh mechanism.
   - *Reality*: Access tokens expire in 15 minutes (`900`s). The authentication endpoint returns a `refresh_token` and `refresh_url: "/auth/refresh"`. I built proactive token refresh logic into `api.js` to ensure uninterrupted sessions.
3. **Pagination Architecture (`pagination`)**:
   - *Doc Claim*: 1-indexed `page` and `limit` up to 200 with `{total, page, page_size, results}`.
   - *Reality*: 0-indexed `offset` parameter with `limit` capped at 50, returned in `{limit, offset, count, total, has_more, results}`.
4. **Envelope Count Deception (`completeness`)**:
   - *Doc Claim*: The envelope `total` property reports the exact retrievable record count.
   - *Reality*: The envelope falsely claims `4907` total records, yet querying `offset` up to completion retrieves **4950** actual records.
5. **Ghost Endpoints (`missing_endpoint`)**:
   - `/v1/analytics/summary` and `/v1/favourites` return HTTP 404. I resolved this by persisting user favourites in `localStorage` and computing real-time analytics client-side.
6. **Ignored Project Parameter (`filters`)**:
   - `GET /v1/listings?project_id=...` is silently ignored by the server. I added client-side relational filtering to match listings against project IDs.
7. **Lexicographical Carpet Area Sort (`sorting`)**:
   - `sort_by=carpet_area` sorts alphabetically (`"340"` before `"32"`). I implemented numeric client-side post-sorting to ensure mathematical correctness.
8. **Currency Unit Normalization (`units`)**:
   - Project price bounds (`price_min`, `price_max`) are expressed in Crores of INR (`12.44` Cr) rather than raw INR, which I converted to INR (`124,400,000`) for evaluation accuracy.

---

## 🟢 Hypotheses Tested That Were Truthful

A rigorous investigation must also document hypotheses that were evaluated and confirmed to be functioning as expected:

1. **Server-Side Filter Correctness on `/v1/listings`**:
   - I tested whether multi-attribute filters (`locality=powai`, `bhk=2`, `property_type=apartment`, `furnishing=semi-furnished`, `min_price`, `max_price`) were functioning or being ignored like `project_id`.
   - *Result*: **Passed**. The server accurately respects these parameters and computes filtered sets correctly.
2. **Direct Listing Lookups (`GET /v1/listings/{id}`)**:
   - I hypothesized that single property retrieval might return inconsistent payloads or drop foreign keys.
   - *Result*: **Passed**. Direct ID lookups return complete, reliable metadata for live units.
3. **Credential Integrity & Server Timezone Sync**:
   - I checked whether the `/health` endpoint exhibited clock drift or missing timezone offsets.
   - *Result*: **Passed**. The server returns an explicit `+05:30` IST offset, perfectly synchronized with our reference timestamp (`2026-09-10T00:00:00+05:30`).

---

## 📊 Summary Table of Answers to the 10 Questions

All 10 questions have been computed and verified. They are integrated into `submission.json` and rendered in the live web application's Insights tab:

| # | Question Key in `submission.json` | Verified Answer | Forensic Methodology |
|---|---|---|---|
| **1** | `total_listing_records` | **4,950** | Full pagination offset traversal (0 to 4900); bypasses the envelope's false `total: 4907` |
| **2** | `unique_properties` | **4,931** | Discovered 19 cross-broker duplicate pairs (38 records describing identical physical units with different IDs) |
| **3** | `active_listings` | **3,892** | Filtered by `is_live === true` (1,058 inactive/archived properties) |
| **4** | `corrupt_listing_ids` | **41 Listing IDs** | Flagged impossible physical anomalies: floor > total floors, negative pricing, inverted coordinates, carpet > super built-up |
| **5** | `total_monthly_rent` | **₹77,24,700** | Sum of `rent_monthly` across all 215 verified rental listings in assigned locality **Powai** |
| **6** | `avg_price_per_sqft_2bhk` | **₹62,691.14 / sqft** | Calculated on live, verified 2BHK properties excluding corrupt outliers and bait pricing |
| **7** | `costliest_project` | **P50016 (Assetz Serenity)** | `{"project_id": "P50016", "price_max_inr": 124400000}` (12.44 Cr ceiling) |
| **8** | `listings_last_7_days` | **146** | Timestamps in `[2026-09-03T00:00:00+05:30, 2026-09-10T00:00:00+05:30)` |
| **9** | `fake_listing_ids` | **11 Listing IDs** | Rental rates (₹17,000 - ₹44,000) fraudulently listed as outright property sale prices |
| **10** | `projects_with_wrong_listing_count` | **443 Projects** | Projects where reported `total_listings` diverges from the count in `/v1/listings` |

---

## 🔮 Future Roadmap (With Two Additional Days)

If I had two additional days of development, I would prioritize:
1. **Interactive Mapbox / Leaflet Spatial Clustering**:
   - Plotting all 4,950 properties on a high-density vector map of Mumbai with automated coordinate repair for the 14 inverted lat/lng listings.
2. **Offline-First Indexing with IndexedDB & Service Workers**:
   - Implementing instant sub-millisecond client-side filtering, offline query caching, and seamless background sync.
3. **Automated End-to-End Test Suite**:
   - Adding Playwright test workflows verifying token refresh, filter composition, and URL deep linking across Safari, Chrome, and Firefox.
4. **Predictive Valuation ML Engine**:
   - Building a localized valuation model to predict accurate price per square foot across Mumbai micro-markets based on recent registration data.

---
*Developed with pride by Arsh Sharma for the Ivy Homes Engineering Team.*
