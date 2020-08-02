const Router = require("express");
const api = require("axios");

const routes = new Router();

routes.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

routes.get("/login-url", (req, res) => {
  return res.send(
    `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=https://spotify-lyrics.netlify.app/&scope=user-read-private%20user-read-email&state=activity`
  );
});

routes.post("/get-info", async (req, res) => {
  const { code, state } = req.body;

  const data = new URLSearchParams();
  data.append("grant_type", "authorization_code");
  data.append("code", code);
  data.append("redirect_uri", "https://spotify-lyrics.netlify.app/");
  data.append("client_id", process.env.CLIENT_ID);
  data.append("client_secret", process.env.SECRET_ID);

  try {
    const response = await api.post(
      "https://accounts.spotify.com/api/token?grant_type=authorization_code",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      const data = new URLSearchParams();

      data.append("grant_type", "refresh_token");
      data.append("refresh_token", response.data.refresh_token);

      const connectionResponse = await api.get(
        "https://api.spotify.com/v1/me",
        {
          headers: {
            Authorization: "Bearer " + response.data.access_token,
          },
        }
      );
      if (connectionResponse.status === 200) {
        console.log(connectionResponse.data);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: "Tudo certo aqui!" });
});

module.exports = routes;
