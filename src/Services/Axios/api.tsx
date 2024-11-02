import axios from "axios";
import { apiUrl } from "../../Utills/constantt";

const api = axios.create({
  baseURL: apiUrl,  
 
});

// Request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
