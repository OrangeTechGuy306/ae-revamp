import axios from 'axios';

const API_BASE_URL = 'https://backend.aerenewablesolution.com/';
// const API_BASE_URL = 'http://localhost:5000/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to every request if present
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ae_token');
        if (token && config.headers) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;


