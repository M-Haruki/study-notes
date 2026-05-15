import axios from "axios";

const apiClient = axios.create({
  baseURL: "/study-notes/api",
  withCredentials: true, // Cookie を自動送信
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
