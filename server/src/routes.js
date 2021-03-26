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
    `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=user-read-private%20user-read-email%20user-read-currently-playing%20user-read-playback-state%20user-modify-playback-state&state=activity`
  );
});

routes.post(
  "/get-info",
  AccessMiddleware.getAccessToken,
  UserController.getUserInfo
);

routes.post(
  "/get-song",
  AccessMiddleware.getAccessToken,
  UserController.getPlayingSong
);

routes.put(
  "/get-song-refreshed",
  AccessMiddleware.getRefreshedToken,
  UserController.getPlayingSong
);

routes.put("/play",
  AccessMiddleware.getRefreshedToken,
  UserController.playSong
);

routes.put("/pause",
  AccessMiddleware.getRefreshedToken,
  UserController.pauseSong
);

routes.put("/previous",
  AccessMiddleware.getRefreshedToken,
  UserController.previousSong
);

routes.put("/next",
  AccessMiddleware.getRefreshedToken,
  UserController.nextSong
);

routes.put("/rewind",
  AccessMiddleware.getRefreshedToken,
  UserController.rewindSong
);

routes.put("/forward",
  AccessMiddleware.getRefreshedToken,
  UserController.forwardSong
);

module.exports = routes;
