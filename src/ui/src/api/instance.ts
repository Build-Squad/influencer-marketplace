import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add an interceptor that checks if the response has a code of 401, then log the user out and throw him at /login
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status && error.response.status === 401) {
      localStorage.removeItem("persist:user");
      localStorage.removeItem("persist:cart");
      // window.location.href = "/";
    }
    throw error;
  }
);

export default instance;