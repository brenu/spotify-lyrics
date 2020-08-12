import axios from "axios";

const api = axios.create({
  baseURL: "https://spotify-api.brenu.ga/",
});

export default api;
