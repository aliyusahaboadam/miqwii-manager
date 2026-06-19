import axios from "axios";

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL // ✅ https://api.miqwii.com
});

// Public URLs that should never trigger auth redirect
const publicUrls = [
  "/v1/api/school/get-school-by-domain",
  "/v1/api/login",
  "/v1/api/school/add",
  "/v1/api/password",
  "/v1/api/is-valid",
  "/v1/api/check-password",
];

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url || "";
    const isPublic = publicUrls.some(url => requestUrl.includes(url));
    const status = err.response?.status;

    if (!isPublic && (status === 401 || status === 403)) {
      localStorage.removeItem("token");
      window.location.href = "/school/login";
    }

    return Promise.reject(err);
  }
);

export default api;