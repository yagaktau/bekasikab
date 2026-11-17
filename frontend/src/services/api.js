import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(
  (req) => {
    // Ganti 'token' ini dengan nama key yang Abang pakai di Login.jsx
    let token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      // Bersihkan tanda kutip (") yang mungkin ikut tersimpan
      token = token.replace(/['"]+/g, "");
      req.headers["Authorization"] = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
