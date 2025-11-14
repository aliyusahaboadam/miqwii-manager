import axios from "axios";


const api = axios.create({ baseURL: "/api" });

api.interceptors.response.use(
  (res) => res,
  (err) => {
  
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
  localStorage.removeItem("token");
  window.location.href = "#/school/login";
  }
 
    return Promise.reject(err);
  }
);

export default api;