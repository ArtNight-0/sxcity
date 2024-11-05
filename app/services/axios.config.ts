import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Implementasi refresh token di sini
      const refreshToken = localStorage.getItem("refresh_token");
      // ... logika refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
