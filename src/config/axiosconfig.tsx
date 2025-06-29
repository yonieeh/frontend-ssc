import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const bypass = error.response?.headers["x-auth-bypass"];

    if (error.response?.status === 401 && !bypass) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
)

export default axiosInstance;