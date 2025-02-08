import axios from "axios";

const api = axios.create({
  // will be provided
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  headers: {
    "Content-type": "application/json",
  },
});

export const multipartApi = axios.create({
  // will be provided
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default api;
