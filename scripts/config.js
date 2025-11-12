const CONFIG = {
  ENV: 'dev', // can be 'dev', 'stage', or 'prod'

  BASE_URLS: {
    dev: 'https://dev1.heromotocorp.com',
    stage: 'https://stage.heromotocorp.com',
    prod: 'https://www.heromotocorp.com',
  },

  // Fallback API endpoint paths to use when placeholders are missing
  API_ENDPOINTS: {
    headerApi:
      'https://dev1.heromotocorp.com/content/experience-fragments/hero-aem-website/in/en/hero-site/header/master.10.json',
    countrySelectorApi:
      'https://dev1.heromotocorp.com/content/experience-fragments/hero-aem-website/in/en/site/modal/master.10.json',
    footerApi:
      'https://dev1.heromotocorp.com/content/experience-fragments/hero-aem-website/in/en/hero-site/footer/master.10.json',
    priceApi: 'https://dev1.heromotocorp.com/content/hero-commerce/in/en/products/product-page/practical/jcr:content.product.practical.splendor-plus.{state}.{city}.json',
  },
  statesCityApi:
    'https://dev1.heromotocorp.com/content/hero-commerce/in/en/products/product-page/practical/jcr:content.state-and-city.json',

  sendOtpApi:
    'https://dev1.heromotocorp.com/content/hero-commerce/in/en/products/product-page/practical/jcr:content.send-msg.json',

  submitTestRideApi:
    'https://dev1.heromotocorp.com/content/hero-commerce/in/en/products/product-page/practical/jcr:content.book-test-ride.json',
};

/**
 * Helper function to get the full API URL for a given endpoint key.
 * @param {string} endpoint - Key name of the endpoint in CONFIG.API_ENDPOINTS
 * @returns {string} Full URL combining base URL and endpoint path
 */
export const getApiUrl = (endpoint) => CONFIG.API_ENDPOINTS[endpoint];

/**
 * Helper function to get the full site URL for a given path.
 * Defaults to the base URL if no path is provided.
 * @param {string} path - Optional path to append to the base URL
 * @returns {string} Full site URL
 */
export const getSiteUrl = (path = '') => {
  // If path is already a full URL, return it as-is
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // Otherwise, prepend the base URL
  const base = CONFIG.BASE_URLS[CONFIG.ENV];
  return `${base}${path}`;
};

export default CONFIG;
