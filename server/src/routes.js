const Router = require("express");
const api = require("axios");

const AccessMiddleware = require("./middlewares/access");
const UserController = require("./controllers/UserController");

const routes = new Router();

routes.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

routes.get("/login-url", (req, res) => {
  return res.send(
    `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=https://spotify-lyrics.netlify.app/&scope=user-read-private%20user-read-email&state=activity`
  );
});

routes.post(
  "/get-info",
  AccessMiddleware.getAccessToken,
  UserController.getUserInfo
);

module.exports = routes;
