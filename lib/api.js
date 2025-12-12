import axios from 'axios';

// Get API base URL from environment or use default
const getApiBase = () => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

// Callback function to reset idle timer on user activity
let resetIdleCb = null;
export const setResetIdleCb = (cb) => { resetIdleCb = cb; };

// Global request wrapper that handles all HTTP methods
const makeRequest = async (method, url, data = null, config = {}) => {
    const API = getApiBase();
    const fullUrl = `${API}${url}`;

    // Merge config with credentials setting
    const requestConfig = {
        ...config,
        withCredentials: true,
    };

    // Reset idle timer before request
    if (typeof resetIdleCb === 'function') resetIdleCb();

    try {
        let response;
        // GET and DELETE methods don't send data in body
        if (method === 'get' || method === 'delete') {
            response = await axios[method](fullUrl, requestConfig);
        } else {
            // POST, PUT, PATCH send data in body
            response = await axios[method](fullUrl, data, requestConfig);
        }

        // Reset idle timer after successful response
        if (typeof resetIdleCb === 'function') resetIdleCb();
        return response;
    } catch (error) {
        // Reset idle timer even on error
        if (typeof resetIdleCb === 'function') resetIdleCb();

        // Handle 401 Unauthorized - logout user
        if (error?.response && error?.response?.status === 401) {
            // Only redirect if NOT already on an auth page to avoid loops
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
                // window.location.href = '/auth/login';
            }
        }

        return error;
    }
};

// Exported HTTP methods for making API requests
export const request = {
    get: (url, config) => makeRequest('get', url, null, config),
    post: (url, data, config) => makeRequest('post', url, data, config),
    put: (url, data, config) => makeRequest('put', url, data, config),
    patch: (url, data, config) => makeRequest('patch', url, data, config),
    delete: (url, config) => makeRequest('delete', url, null, config),
};

export default request;
