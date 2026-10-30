import apiClient from './client';

const CACHE_KEY = 'fastor_cached_restaurants';

/**
 * Fetch Restaurant list from Fastor API with auto-retry and cache fallback
 * @param {number|string} cityId Default 118
 */
export async function getRestaurants(cityId = 118) {
  const fetchWithRetry = async (retriesLeft = 2) => {
    try {
      const response = await apiClient.get('/m/restaurant', {
        params: { city_id: cityId },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const body = response.data;
      let results = [];

      if (body?.status === 'Success' && body?.data?.results) {
        results = body.data.results;
      } else if (Array.isArray(body?.data)) {
        results = body.data;
      } else if (Array.isArray(body)) {
        results = body;
      }

      if (results && results.length > 0) {
        // Cache successful response for offline / latency resilience
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(results));
        } catch (_) {}
      }

      return results;
    } catch (error) {
      if (retriesLeft > 0) {
        // Wait 800ms and retry once
        await new Promise((resolve) => setTimeout(resolve, 800));
        return fetchWithRetry(retriesLeft - 1);
      }
      throw error;
    }
  };

  try {
    return await fetchWithRetry();
  } catch (error) {
    // If staging server times out, attempt to serve cached results if available
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (_) {}
    }

    const message =
      error.response?.data?.error_message ||
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Network timeout. Staging server took too long to respond.' : '') ||
      error.message ||
      'Failed to fetch restaurants. Please tap Retry.';
    throw new Error(message);
  }
}
