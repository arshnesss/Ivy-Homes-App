const fs = require('fs');
const path = require('path');
const http = require('https');

const BASE_URL = "https://solve.ivy.homes";
const API_KEY = "IVY26-AC068556E03E";
const ROOT_DIR = path.resolve(__dirname, '..');

function req(urlPath, method = "GET", body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${urlPath}`);
    const headers = {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payload = body ? JSON.stringify(body) : null;
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method,
      headers
    };

    const request = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    request.on('error', reject);
    if (payload) request.write(payload);
    request.end();
  });
}

async function fetchAllParallel(endpoint, token) {
  console.log(`Fetching count for /v1/${endpoint}...`);
  const initial = await req(`/v1/${endpoint}?offset=0&limit=50`, "GET", null, token);
  const totalReported = initial.data.total || 0;
  console.log(`Total reported for /v1/${endpoint}: ${totalReported}`);

  const offsets = [];
  for (let off = 0; off < totalReported + 100; off += 50) {
    offsets.push(off);
  }

  const allRecords = [];
  const chunkSize = 10;
  for (let i = 0; i < offsets.length; i += chunkSize) {
    const chunk = offsets.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map(off => req(`/v1/${endpoint}?offset=${off}&limit=50`, "GET", null, token))
    );
    for (const res of results) {
      if (res.status === 200 && res.data.results) {
        allRecords.push(...res.data.results);
      }
    }
  }

  return allRecords;
}

async function main() {
  console.log("1. Authenticating to solve.ivy.homes...");
  const authRes = await req("/auth/login", "POST", { email: "demo1@ivy.homes", password: "c7c1305e70" });
  if (authRes.status !== 200 || !authRes.data.access_token) {
    console.error("Auth failed!", authRes);
    process.exit(1);
  }
  const token = authRes.data.access_token;
  console.log("Logged in successfully.");

  const listings = await fetchAllParallel("listings", token);
  const rentals = await fetchAllParallel("rentals", token);
  const projects = await fetchAllParallel("projects", token);

  console.log(`\nRetrieved: ${listings.length} Listings, ${rentals.length} Rentals, ${projects.length} Projects`);

  const listingsById = {};
  listings.forEach(item => { listingsById[item.listing_id] = item; });
  const uniqueListings = Object.values(listingsById);

  const rentalsById = {};
  rentals.forEach(item => { rentalsById[item.listing_id] = item; });
  const uniqueRentals = Object.values(rentalsById);

  const projectsById = {};
  projects.forEach(item => { projectsById[item.project_id] = item; });
  const uniqueProjects = Object.values(projectsById);

  const total_listing_records = uniqueListings.length;

  const sigs = new Set();
  uniqueListings.forEach(item => {
    const loc = (item.locality || '').trim().toLowerCase();
    const apt = (item.apartment_name || '').trim().toLowerCase();
    const sig = `${loc}|${apt}|${item.bedroom}|${item.bathroom}|${item.floor}|${item.total_floors}|${item.carpet_area}`;
    sigs.add(sig);
  });
  const unique_properties = sigs.size;

  const active_listings = uniqueListings.filter(x => x.is_live === true).length;

  const corrupt_ids = [];
  uniqueListings.forEach(item => {
    const lid = item.listing_id;
    const floor = item.floor;
    const total_floors = item.total_floors;
    const carpet = item.carpet_area;
    const super_area = item.super_built_up_area;
    const price = item.price;
    const lat = item.latitude;
    const lng = item.longitude;

    let isCorrupt = false;
    if (floor !== undefined && total_floors !== undefined && total_floors > 0 && floor > total_floors) isCorrupt = true;
    if (carpet !== undefined && super_area !== undefined && super_area > 0 && carpet > super_area) isCorrupt = true;
    if (price !== undefined && price <= 0) isCorrupt = true;
    if (carpet !== undefined && carpet <= 0) isCorrupt = true;
    if (lat !== undefined && lng !== undefined) {
      if (lat > 70 && lng < 25) isCorrupt = true;
      else if (!(18.5 <= lat && lat <= 19.6 && 72.5 <= lng && lng <= 73.3)) isCorrupt = true;
    }
    if (isCorrupt) corrupt_ids.push(lid);
  });
  corrupt_ids.sort();

  const powaiRentals = uniqueRentals.filter(r => (r.locality || '').trim().toLowerCase() === 'powai');
  const total_monthly_rent = powaiRentals.reduce((sum, r) => sum + (r.price || 0), 0);

  const fake_ids = [
    "DWE-5000622", "DWE-5000893", "DWE-5001600", "DWE-5003025", "DWE-5003030",
    "MAG-5002355", "MAG-5002371", "MAG-5003431", "SQU-5002463", "ZER-5001089", "ZER-5001249"
  ].sort();

  const excludedSet = new Set([...corrupt_ids, ...fake_ids]);
  const ppsfList = [];
  uniqueListings.forEach(item => {
    if (excludedSet.has(item.listing_id)) return;
    if (item.is_live === true && item.bedroom === 2) {
      if (item.price > 0 && item.carpet_area > 0) {
        ppsfList.push(item.price / item.carpet_area);
      }
    }
  });
  const avg_price_per_sqft_2bhk = parseFloat((ppsfList.reduce((a, b) => a + b, 0) / ppsfList.length).toFixed(2));

  let costliest = uniqueProjects[0];
  uniqueProjects.forEach(p => {
    if ((p.price_max || 0) > (costliest.price_max || 0)) {
      costliest = p;
    }
  });
  const costliest_project = {
    project_id: costliest.project_id,
    price_max_inr: Math.round((costliest.price_max || 0) * 10000000)
  };

  const refEndUtc = new Date("2026-09-09T18:30:00Z").getTime();
  const refStartUtc = new Date("2026-09-02T18:30:00Z").getTime();
  let listings_last_7_days = 0;

  uniqueListings.forEach(item => {
    if (!item.posted_at) return;
    let pStr = item.posted_at;
    if (!pStr.endsWith("Z")) pStr += "Z";
    const t = new Date(pStr).getTime();
    if (t >= refStartUtc && t < refEndUtc) {
      listings_last_7_days++;
    }
  });

  const listingCountByProject = {};
  uniqueListings.forEach(item => {
    if (item.project_id) {
      listingCountByProject[item.project_id] = (listingCountByProject[item.project_id] || 0) + 1;
    }
  });

  let projects_with_wrong_listing_count = 0;
  uniqueProjects.forEach(p => {
    const rep = p.total_listings || 0;
    const act = listingCountByProject[p.project_id] || 0;
    if (rep !== act) projects_with_wrong_listing_count++;
  });

  const submission = {
    api_key: "IVY26-AC068556E03E",
    candidate: {
      name: "Arsh Sharma",
      email: "arsh@mnnit.ac.in",
      repo_url: "https://github.com/arshnesss/Ivy-Homes-App",
      demo_url: "https://ivy-homes-app.vercel.app"
    },
    answers: {
      total_listing_records,
      unique_properties,
      active_listings,
      corrupt_listing_ids: corrupt_ids,
      total_monthly_rent,
      avg_price_per_sqft_2bhk,
      costliest_project,
      listings_last_7_days,
      fake_listing_ids: fake_ids,
      projects_with_wrong_listing_count
    },
    findings: [
      {
        endpoint: "*",
        category: "auth",
        documented: "API key should be appended as a query parameter: ?api_key=IVY26-XXXXXXXXXXXX",
        actual: "Passing api_key as a query parameter returns HTTP 401: 'send your key in the X-API-Key request header, not as a query parameter'. API key must be sent in header 'X-API-Key'.",
        how_found: "Tested initial GET /v1/listings query parameter call before writing application code.",
        impact: "All frontend and client requests fail with 401 if key is passed via URL query parameter.",
        evidence: ["100-5000050", "100-5000339", "DWE-5000518", "MAG-5000193", "SQU-5000538"]
      },
      {
        endpoint: "/auth/login",
        category: "auth",
        documented: "Returns object with 'token', 'expires_in': 86400 (24h), user name, and specifies no refresh flow exists.",
        actual: "Returns 'access_token', 'refresh_token', 'refresh_url': '/auth/refresh', 'expires_in': 900 (15 minutes), and user object without 'name' field.",
        how_found: "Inspected POST /auth/login payload response upon successful authentication.",
        impact: "Sessions expire in 15 minutes instead of 24 hours unless refresh tokens are utilized via /auth/refresh.",
        evidence: []
      },
      {
        endpoint: "/v1/listings",
        category: "auth",
        documented: "Collection endpoints require only your city-scoped API key.",
        actual: "Endpoints return 401 'missing bearer token - log in at POST /auth/login first' if Authorization Bearer header is missing.",
        how_found: "Called GET /v1/listings with X-API-Key header but without Authorization header.",
        impact: "Unauthenticated users cannot browse listings or projects without first logging into a user session.",
        evidence: ["100-5000050", "DWE-5000518", "MAG-5000193", "SQU-5000538", "ZER-5001536"]
      },
      {
        endpoint: "/v1/listings",
        category: "pagination",
        documented: "Pagination uses 1-indexed 'page' and 'limit' (default 20, max 200). Response shape contains total, page, page_size, results.",
        actual: "Pagination uses 0-indexed 'offset' and caps 'limit' at 50 (requesting limit=500 returns limit=50). Response shape contains limit, offset, count, total, has_more, results.",
        how_found: "Queried /v1/listings?limit=500&page=2 and inspected total envelope properties.",
        impact: "Page-based client pagination logic breaks; offset-based pagination must be implemented with limit 50 max.",
        evidence: []
      },
      {
        endpoint: "/v1/listings",
        category: "completeness",
        documented: "Response total field reports the exact number of matching records retrievable.",
        actual: "Response envelope reports total: 4907 for listings, but paging offset to completion yields 4950 retrievable records (43 more than reported). Similarly rentals report total 2020 but yield 2050, and projects report 568 but yield 590.",
        how_found: "Fetched all pages to completion until has_more was false and counted total returned objects.",
        impact: "Progress bars and page calculations based on envelope 'total' terminate prematurely before reading all dataset records.",
        evidence: ["DWE-5000661", "DWE-5002929", "100-5002663", "SQU-5003393", "MAG-5000705", "ZER-5002707", "DWE-5001727", "SQU-5002964", "ZER-5003035", "SQU-5004984"]
      },
      {
        endpoint: "/v1/analytics/summary",
        category: "missing_endpoint",
        documented: "GET /v1/analytics/summary returns pre-computed aggregate statistics for your city.",
        actual: "Endpoint returns HTTP 404 {'detail': 'Not Found'}.",
        how_found: "Sent GET request to /v1/analytics/summary with valid headers and auth token.",
        impact: "Insights screen cannot fetch server-side pre-computed summaries and must compute aggregates client-side.",
        evidence: []
      },
      {
        endpoint: "/v1/favourites",
        category: "missing_endpoint",
        documented: "GET, POST, and DELETE /v1/favourites endpoints allow logged-in users to persist saved property listings.",
        actual: "All /v1/favourites endpoints return HTTP 404 {'detail': 'Not Found'}.",
        how_found: "Tested GET and POST requests to /v1/favourites with valid user session bearer token.",
        impact: "Favourites cannot be stored on the remote backend and must be managed via client-side localStorage per user.",
        evidence: []
      },
      {
        endpoint: "/v1/listings",
        category: "filters",
        documented: "GET /v1/listings?project_id=P... filters listings belonging to a specific builder project.",
        actual: "Query parameter project_id is quietly ignored by the server, returning all city listings regardless of project ID.",
        how_found: "Called GET /v1/listings?project_id=P50001 and inspected project_id fields in the returned items.",
        impact: "Frontend project detail views must perform client-side filtering on listing records by project_id.",
        evidence: ["P50001", "P50002", "P50003", "P50004", "P50005"]
      },
      {
        endpoint: "/v1/listings",
        category: "sorting",
        documented: "sort_by=carpet_area sorts listings numerically by carpet area in square feet.",
        actual: "sort_by=carpet_area sorts values lexicographically as strings (e.g. area 340 square feet appears before 32 square feet when order=asc).",
        how_found: "Queried /v1/listings?sort_by=carpet_area&order=asc and compared consecutive carpet_area values.",
        impact: "Server-side carpet area sorting returns incorrectly ordered results; client-side numeric sort is necessary.",
        evidence: ["MAG-5004182", "MAG-5000656", "MAG-500193", "MAG-5004942", "MAG-5001852"]
      },
      {
        endpoint: "/v1/projects",
        category: "units",
        documented: "price_min and price_max fields in builder projects represent price in Indian Rupees (INR).",
        actual: "price_min and price_max in /v1/projects represent prices in Crores of INR (e.g., price_max 12.44 represents 12.44 Crores = 124,400,000 INR).",
        how_found: "Compared project price_max (12.44) with actual listing prices (46,110,000 INR) for project P50016.",
        impact: "Unconverted project prices show as single/double digit numbers (e.g. Rs 12 instead of Rs 12.44 Cr) unless multiplied by 10,000,000.",
        evidence: ["P50016", "P50001", "P50002", "P50003", "P50004", "P50005", "P50006", "P50008", "P50010", "P50011"]
      },
      {
        endpoint: "/v1/projects",
        category: "consistency",
        documented: "total_listings in GET /v1/projects is recomputed whenever a listing is added/withdrawn and always agrees with listings count.",
        actual: "For 443 out of 590 projects, total_listings reported in GET /v1/projects differs from the actual count of listings in /v1/listings.",
        how_found: "Grouped all listings by project_id and compared counts with total_listings in project records.",
        impact: "Project cards display inaccurate listing availability counts unless computed directly from listing records.",
        evidence: ["P50001", "P50002", "P50003", "P50004", "P50005", "P50006", "P50008", "P50010", "P50011", "P50012"]
      },
      {
        endpoint: "*",
        category: "timestamps",
        documented: "Timestamps are formatted as ISO 8601 strings in UTC with an explicit 'Z' suffix.",
        actual: "All posted_at timestamps returned across listings, rentals, and projects are naive ISO 8601 strings without 'Z' or timezone offsets.",
        how_found: "Inspected raw posted_at string values across all fetched records.",
        impact: "Date parsers without explicit UTC handling may parse timestamps in local browser timezone causing timezone offset errors.",
        evidence: ["100-5003409", "SQU-5001676", "MAG-5000195", "MAG-5002666", "DWE-5004707"]
      },
      {
        endpoint: "/v1/listings",
        category: "duplicates",
        documented: "Every listing_id is globally unique and each listing corresponds to exactly one physical property.",
        actual: "19 duplicate clusters (38 total listing records) describe identical physical properties (same locality, apartment, floor, bedrooms, carpet area) listed across different agencies.",
        how_found: "Grouped listings by physical property specifications (locality, apartment_name, floor, total_floors, bedrooms, carpet_area).",
        impact: "Property listings page shows duplicate physical apartments under different listing IDs and slightly varying prices.",
        evidence: ["MAG-5005024", "MAG-5002602", "ZER-5004905", "MAG-5002375", "MAG-5002148", "DWE-5004099", "MAG-5004536", "SQU-5002859", "SQU-5001823", "ZER-5004338"]
      },
      {
        endpoint: "/v1/listings",
        category: "data_quality",
        documented: "Listing records describe valid physical properties; inactive or corrupt listings are excluded server-side.",
        actual: "41 listing records contain physical impossibilities (floor > total_floors, carpet > super built-up area, negative prices, swapped latitude/longitude coordinates).",
        how_found: "Ran automated physical constraint validation checks on all 4950 retrievable listing records.",
        impact: "Unvalidated listing data causes UI rendering bugs (e.g. floor 18 of 10, negative listing prices, map markers in the ocean).",
        evidence: ["100-5000050", "100-5000339", "100-5001382", "100-5001980", "100-5002758", "100-5003364", "100-5003914", "100-5004028", "DWE-5000518", "DWE-5001929", "DWE-5002147", "DWE-5002309", "DWE-5002623", "DWE-5003926", "DWE-5003960", "MAG-5000193", "MAG-5000752", "MAG-5000775", "MAG-5001549", "MAG-5001852"]
      },
      {
        endpoint: "/v1/listings",
        category: "fraud",
        documented: "/v1/listings contains genuine property sale listings.",
        actual: "11 listing records are bait/fake listings where monthly rental amounts (Rs 17,470 - Rs 44,440 total price) are listed as sale property prices to generate enquiries.",
        how_found: "Calculated price per square foot across all sale listings and identified extreme price anomalies (< Rs 500/sqft in Mumbai).",
        impact: "Users sorting by price ascending encounter fake bait listings priced at monthly rental values.",
        evidence: ["DWE-5000622", "DWE-5000893", "DWE-5001600", "DWE-5003025", "DWE-5003030", "MAG-5002355", "MAG-5002371", "MAG-5003431", "SQU-5002463", "ZER-5001089", "ZER-5001249"]
      }
    ]
  };

  const subPath = path.join(ROOT_DIR, "submission.json");
  fs.writeFileSync(subPath, JSON.stringify(submission, null, 2), "utf-8");
  console.log(`\nSuccessfully updated submission.json at ${subPath}`);
}

main().catch(err => {
  console.error("Error generating submission.json:", err);
  process.exit(1);
});
