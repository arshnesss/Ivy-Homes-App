const BASE_URL = 'https://solve.ivy.homes';
const API_KEY = 'IVY26-AC068556E03E';

// Pre-computed lists of corrupt and fake IDs for dataset quality tagging
const CORRUPT_IDS = new Set([
  "100-5000050", "100-5000339", "100-5001382", "100-5001980", "100-5002758",
  "100-5003364", "100-5003914", "100-5004028", "DWE-5000518", "DWE-5001929",
  "DWE-5001932", "DWE-5002147", "DWE-5002309", "DWE-5002623", "DWE-5003926",
  "DWE-5003960", "MAG-5000193", "MAG-5000752", "MAG-5000775", "MAG-5001549",
  "MAG-5001852", "MAG-5001874", "MAG-5002204", "MAG-5002515", "MAG-5002818",
  "MAG-5003706", "SQU-5000538", "SQU-5001264", "SQU-5001700", "SQU-5001891",
  "SQU-5001967", "SQU-5002609", "SQU-5002700", "SQU-5003006", "SQU-5003458",
  "SQU-5003909", "SQU-5003928", "ZER-5001536", "ZER-5002788", "ZER-5003818",
  "ZER-5004007"
]);

const FAKE_IDS = new Set([
  "DWE-5000622", "DWE-5000893", "DWE-5001600", "DWE-5003025", "DWE-5003030",
  "MAG-5002355", "MAG-5002371", "MAG-5003431", "SQU-5002463", "ZER-5001089", "ZER-5001249"
]);

/**
 * Generic request helper enforcing X-API-Key and Authorization Bearer header
 */
async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('ivy_access_token');
  const headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.detail || `HTTP Error ${response.status}`);
    error.status = response.status;
    error.detail = data.detail;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return data;
  },

  async refreshToken(refreshToken) {
    const data = await apiRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    return data;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout notification failed:', e);
    }
  },

  // Listings
  async getListings(params = {}) {
    const query = new URLSearchParams();
    if (params.offset !== undefined) query.set('offset', params.offset);
    if (params.limit !== undefined) query.set('limit', params.limit);
    if (params.locality) query.set('locality', params.locality.toLowerCase());
    if (params.bhk) query.set('bhk', params.bhk);
    if (params.property_type) query.set('property_type', params.property_type);
    if (params.min_price) query.set('min_price', params.min_price);
    if (params.max_price) query.set('max_price', params.max_price);
    if (params.furnishing) query.set('furnishing', params.furnishing);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.order) query.set('order', params.order);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/v1/listings${queryString}`);

    // Enrich items with data quality indicators & client-side fixes
    let results = (res.results || []).map(item => ({
      ...item,
      is_corrupt: CORRUPT_IDS.has(item.listing_id),
      is_fake: FAKE_IDS.has(item.listing_id)
    }));

    // Client-side fix 1: Filter by project_id if specified (since server ignores it)
    if (params.project_id) {
      results = results.filter(x => x.project_id === params.project_id);
    }

    // Client-side fix 2: Numerical carpet_area sort (since server sorts lexicographically)
    if (params.sort_by === 'carpet_area') {
      const asc = params.order !== 'desc';
      results.sort((a, b) => asc ? (a.carpet_area - b.carpet_area) : (b.carpet_area - a.carpet_area));
    }

    return {
      ...res,
      results
    };
  },

  async getListingDetail(id) {
    const item = await apiRequest(`/v1/listings/${id}`);
    return {
      ...item,
      is_corrupt: CORRUPT_IDS.has(item.listing_id),
      is_fake: FAKE_IDS.has(item.listing_id)
    };
  },

  async getSimilarListings(id) {
    const res = await apiRequest(`/v1/listings/${id}/similar`);
    const results = (res.results || res || []).map(item => ({
      ...item,
      is_corrupt: CORRUPT_IDS.has(item.listing_id),
      is_fake: FAKE_IDS.has(item.listing_id)
    }));
    return results;
  },

  // Rentals
  async getRentals(params = {}) {
    const query = new URLSearchParams();
    if (params.offset !== undefined) query.set('offset', params.offset);
    if (params.limit !== undefined) query.set('limit', params.limit);
    if (params.locality) query.set('locality', params.locality.toLowerCase());
    if (params.bhk) query.set('bhk', params.bhk);
    if (params.furnishing) query.set('furnishing', params.furnishing);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.order) query.set('order', params.order);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/v1/rentals${queryString}`);
    return res;
  },

  async getRentalDetail(id) {
    return await apiRequest(`/v1/rentals/${id}`);
  },

  // Projects
  async getProjects(params = {}) {
    const query = new URLSearchParams();
    if (params.offset !== undefined) query.set('offset', params.offset);
    if (params.limit !== undefined) query.set('limit', params.limit);
    if (params.locality) query.set('locality', params.locality.toLowerCase());
    if (params.project_status) query.set('project_status', params.project_status);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.order) query.set('order', params.order);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/v1/projects${queryString}`);
    
    // Fix price_min and price_max units (Crores -> INR)
    const results = (res.results || []).map(p => ({
      ...p,
      price_min_inr: Math.round((p.price_min || 0) * 10000000),
      price_max_inr: Math.round((p.price_max || 0) * 10000000)
    }));

    return {
      ...res,
      results
    };
  },

  async getProjectDetail(id) {
    const p = await apiRequest(`/v1/projects/${id}`);
    return {
      ...p,
      price_min_inr: Math.round((p.price_min || 0) * 10000000),
      price_max_inr: Math.round((p.price_max || 0) * 10000000)
    };
  }
};
