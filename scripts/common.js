import { fetchPlaceholders } from './aem.js';
import { getApiUrl, getSiteUrl } from './config.js';

export const placeholders = await fetchPlaceholders('default');

// Add placeholders with corresponding values using camelCase keys from the `placeholders` object
const {
  countrySelectorApi, statesCityApi, sendOtpApi, submitTestRideApi, priceApi,
} = placeholders;

// Cache object to store API responses (for GET requests)
const apiProxy = {};

/**
 * Function to trigger API calls with fetch, handle responses, and cache GET results.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - API endpoint URL
 * @param {Object} payload - Optional payload containing headers and request body
 * @param {Object} payload.headerJSON - Optional custom headers
 * @param {Object} payload.requestJSON - Optional request body for non-GET requests
 * @returns {Promise<Object>} - Returns JSON response or { error: string }
 */
export async function fetchAPI(
  method,
  url,
  payload = { headerJSON: {}, requestJSON: {} },
) {
  const cacheKey = `${url}-${method}`;

  // Return cached GET response if available
  if (method === 'GET' && apiProxy[cacheKey]) {
    return apiProxy[cacheKey];
  }

  const { headerJSON, requestJSON } = payload;
  const headers = new Headers({ 'Content-Type': 'application/json' });

  // Add custom headers if provided
  if (headerJSON && typeof headerJSON === 'object') {
    Object.entries(headerJSON).forEach(([headerKey, headerValue]) => {
      headers.append(headerKey, headerValue);
    });
  }

  //  request configuration
  const body = JSON.stringify(requestJSON);

  const request = {
    method,
    headers,
    body,
  };

  try {
    let response;

    if (method === 'GET') {
      response = await fetch(url);
    } else if (method === 'POST') {
      response = await fetch(url, request);
    }
    // If response fails
    if (!response.ok) {
      const errorText = await response.text();
      return { error: errorText };
    }

    // Parse JSON safely
    const data = await response.json();

    // Cache GET results
    if (method === 'GET') {
      apiProxy[cacheKey] = data;
    }

    return data;
  } catch (error) {
    return { error: error.message || 'Network error' };
  }
}

/**
 * Decode HTML entities (e.g., &#39; → ')
 * @param {string} str - The encoded string
 * @returns {string} - The decoded string
 */
export function decodeHtmlEntities(str) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

// funtion to fetch countires data
export async function fetchCountriesData() {
  const data = await fetchAPI('GET', countrySelectorApi || getApiUrl('countrySelectorApi'));
  return data;
}

// Fetch product data from API for Product Overview Component
export async function fetchProductData(apiUrl) {
  const stateCode = 'DEL';
  const cityCode = 'DELHI';
  const url = getSiteUrl(`${apiUrl}.${stateCode}.${cityCode}.json`);
  const data = await fetchAPI('GET', url);
  return data;
}
export async function StatesCityApiData() {
  const data = await fetchAPI('GET', statesCityApi || getApiUrl('statesCityApi'));
  return data;
}

export async function fetchSendOtpData(payload) {
  try {
    const response = await fetch(sendOtpApi || getApiUrl('sendOtpApi'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(' Submit API Error:', error);
    return { error };
  }
}

export async function fetchSubmitApiData(payload) {
  const apiUrl = submitTestRideApi || getApiUrl('submitTestRideApi');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let result = {};
    try {
      result = JSON.parse(text);
    } catch {
      // eslint-disable-next-line no-console
      console.warn(' Response is not valid JSON');
      result = { raw: text };
    }

    return {
      statusCode: response.status,
      ...result,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(' Submit API Error:', error);
    return { error };
  }
}

export async function fetchPriceData(state, city) {
  const key = `priceData_${state}_${city}`;
  const hour = 3600000;
  const cached = JSON.parse(localStorage.getItem(key) || 'null');
  if (cached && Date.now() - cached.t < hour) return cached.d;

  const apiUrl = (priceApi || getApiUrl('priceApi'))
    .replace('{state}', state)
    .replace('{city}', city);
  const data = await fetchAPI('GET', apiUrl);

  localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data }));
  return data;
}

export async function formatPrice(value) {
  if (!value) return '';
  // Remove any non-digit characters first
  const num = parseInt(value.toString().replace(/\D/g, ''), 10);
  return num.toLocaleString('en-IN'); // or 'en-US' depending on your format preference
}
