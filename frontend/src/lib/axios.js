import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // <-- point to your backend
  withCredentials: true,
});

export default api;
