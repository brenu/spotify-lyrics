const Router = require("express");

const routes = new Router();

routes.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

routes.get("/login", (req, res) => {
  return res.redirect(
    "https://accounts.spotify.com/authorize?client_id=e5e0a3b8cdd6434dadcd232b7e483fbe&response_type=code&redirect_uri=https://spotify-lyrics.netlify.app/&scope=user-read-private%20user-read-email"
  );
});

module.exports = routes;
