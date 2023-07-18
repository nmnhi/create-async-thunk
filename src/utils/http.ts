import axios from "axios";
import { HashService } from "./hash.service";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/",
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const now = Date.now();
    // const token = localStorage.getItem("accessToken");
    const token = "Test access token";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers.Signature = HashService.encryptData({
        url: (config.baseURL || "" + config.url || "").replace("//", "/"),
        body: JSON.stringify(config.data),
        time: now,
      });
      config.headers.Time = now.toString();
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
