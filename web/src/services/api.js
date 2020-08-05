import axios from "axios";

const api = axios.create({
  baseURL: "https://spotify-lyrics-backend.herokuapp.com/",
});

export default api;
