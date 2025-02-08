import axios from "axios";

const api = axios.create({
  // will be provided
  baseURL: "http://localhost:3001",
  headers: {
    "Content-type": "application/json",
  },
});

export const multipartApi = axios.create({
  // will be provided
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default api;
