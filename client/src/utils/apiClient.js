import axios from 'axios';
import { store } from '../store/store'; // We import Redux to grab the token!

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Intercept every request BEFORE it leaves React and attach the Token
apiClient.interceptors.request.use(
  (config) => {
    // Look inside Redux to see if we have a token
    const token = store.getState().auth.token;
    
    if (token) {
      // If we have a token, put it in the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;