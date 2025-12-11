import axios from 'axios';

const getApiBase = () => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

let resetIdleCb = null;
export const setResetIdleCb = (cb) => { resetIdleCb = cb; };

// Global request wrapper
const makeRequest = async (method, url, data = null, config = {}) => {
    const API = getApiBase();
    const fullUrl = `${API}${url}`;
    const requestConfig = {
        ...config,
        withCredentials: true,
    };

    // Reset idle timer before request
    if (typeof resetIdleCb === 'function') resetIdleCb();

    try {
        let response;
        if (method === 'get' || method === 'delete') {
            response = await axios[method](fullUrl, requestConfig);
        } else {
            response = await axios[method](fullUrl, data, requestConfig);
        }

        // Reset idle timer after successful response
        if (typeof resetIdleCb === 'function') resetIdleCb();
        return response;
    } catch (error) {
        // Reset idle timer even on error
        if (typeof resetIdleCb === 'function') resetIdleCb();
        throw error;
    }
};

// Exported global request methods
export const request = {
    get: (url, config) => makeRequest('get', url, null, config),
    post: (url, data, config) => makeRequest('post', url, data, config),
    put: (url, data, config) => makeRequest('put', url, data, config),
    patch: (url, data, config) => makeRequest('patch', url, data, config),
    delete: (url, config) => makeRequest('delete', url, null, config),
};

export default request;
